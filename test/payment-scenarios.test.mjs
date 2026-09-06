import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { calculateFinancialBreakdown, isValidChassis, validatePaymentInput } from "../lib/tasitpos.mjs";
import { createTransaction } from "../lib/server/create-transaction.mjs";
import { handleEpkWebhook } from "../lib/server/epk-webhook.mjs";
import { handleEpkPayoutWebhook } from "../lib/server/epk-payout-webhook.mjs";
import { mapEpkFailure, resolvePaymentState } from "../lib/server/payment-status.mjs";
import { processRefund, resolveOperationType } from "../lib/server/refund-transaction.mjs";
import { getTransaction, saveTransaction } from "../lib/server/transaction-repository.mjs";

const validInput = {
  vehiclePlate: "34ABC123",
  chassisNumber: "WBA8A1107GK123456",
  motorNumber: "MTR-1",
  brandModel: "Test araç",
  netAmount: 100,
  customerPhone: "05320000000",
  document: { size: 1, type: "application/pdf" },
};

async function inTemporaryRepository(run) {
  const previousDirectory = process.cwd();
  const directory = await mkdtemp(path.join(os.tmpdir(), "tasitpos-test-"));
  process.chdir(directory);
  try { return await run(); }
  finally { process.chdir(previousDirectory); await rm(directory, { recursive: true, force: true }); }
}

test("TS-001: başarılı 12 taksit akışı dinamik tutar, SMS, webhook ve hakediş üretir", async () => {
  await inTemporaryRepository(async () => {
    process.env.EPK_MODE = "mock";
    process.env.SMS_MODE = "mock";
    process.env.DOCUMENT_STORAGE_MODE = "local";
    process.env.GROSS_CALCULATION_MODE = "DIRECT_MARKUP";
    process.env.EPK_WEBHOOK_SECRET = "test-webhook-secret";
    const document = { name: "ruhsat.pdf", size: 8, type: "application/pdf", arrayBuffer: async () => Buffer.from("%PDF-1.7") };
    const created = await createTransaction({ ...validInput, document, galleryId: "gal_demo", subMerchantId: "sub_demo" });
    assert.equal(created.gross_amount, 126.1);
    assert.equal(created.sms_status, "SENT");
    assert.match(created.epk_link, /\/odeme-demo\//);

    const paymentDate = new Date().toISOString();
    const body = { epk_transaction_id: created.epk_transaction_id, merchant_reference: created.id, status: "SUCCESS", amount: created.gross_amount, installment: 12, payment_date: paymentDate };
    body.hash_signature = createHmac("sha256", process.env.EPK_WEBHOOK_SECRET).update([body.epk_transaction_id, body.merchant_reference, body.status, body.amount, body.installment, body.payment_date].join("|")).digest("hex");
    const response = await handleEpkWebhook(new Request("http://localhost/webhooks/epk-payment-callback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
    assert.equal(response.status, 200);
    const paid = await getTransaction(created.id);
    assert.equal(paid.status, "SUCCESS");
    assert.equal(paid.settlement.gallery_payout, 100);
    assert.equal(paid.settlement.balance_check, true);

    const payout = { merchant_reference: created.id, payout_id: "payout_dynamic_test", status: "PAID", amount: 100, payout_date: new Date().toISOString() };
    payout.hash_signature = createHmac("sha256", process.env.EPK_WEBHOOK_SECRET).update([payout.merchant_reference, payout.payout_id, payout.status, payout.amount, payout.payout_date].join("|")).digest("hex");
    const payoutResponse = await handleEpkPayoutWebhook(new Request("http://localhost/webhooks/epk-payout-callback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payout) }));
    assert.equal(payoutResponse.status, 200);
    assert.equal((await getTransaction(created.id)).settlement.status, "PAID");
  });
});

test("TS-002: aynı gün tam iade EPK tarafında VOID olarak işlenir", async () => {
  await inTemporaryRepository(async () => {
    process.env.EPK_MODE = "mock";
    process.env.REFUND_CUTOFF_HOUR_TR = "23";
    const paymentDate = new Date().toISOString();
    const transaction = {
      record_id: "f148dbac-2fa8-4df3-9f0b-2195ec9cb7f7", id: "tx_void_test", galeri_id: "gal_demo",
      plate: "34ABC123", chassis_no: validInput.chassisNumber, document_url: "private://test", customer_phone: "05320000000",
      net_amount: 100, gross_amount: 126.1, platform_fee: 1.2, epk_commission_fee: 24.9, total_commission_fee: 26.1,
      epk_transaction_id: "epk_void_test", epk_link: "https://example.invalid", status: "SUCCESS", payment_date: paymentDate,
      settlement: { status: "PENDING", gallery_payout: 100 }, created_at: paymentDate,
    };
    await saveTransaction(transaction);
    const result = await processRefund({ principal: { galleryId: "gal_demo" }, input: { transaction_id: transaction.id, refund_type: "FULL", amount: 126.1, reason: "Noter satışı iptali" }, idempotencyKey: "ts-002-idempotency" });
    assert.equal(result.operation_type, "VOID");
    assert.equal(result.status, "VOIDED");
    assert.equal((await getTransaction(transaction.id)).refunded_amount, 126.1);
  });
});

test("komisyon modu örnek sayılara bağlı kalmadan doğru oran hassasiyetiyle hesaplanır", () => {
  assert.equal(calculateFinancialBreakdown(1_000_000, "DIRECT_MARKUP").gross_amount, 1_261_000);
  assert.equal(calculateFinancialBreakdown(1_000_000, "NET_SETTLEMENT").gross_amount, 1_353_179.97);
  assert.equal(calculateFinancialBreakdown(432_123.45, "DIRECT_MARKUP").gross_amount, 544_907.67);
});

test("aynı gün ve cut-off öncesi işlem tipi VOID olur", () => {
  process.env.REFUND_CUTOFF_HOUR_TR = "23";
  assert.equal(resolveOperationType("2026-09-06T07:00:00.000Z", "2026-09-06T12:00:00.000Z"), "VOID");
});

test("TS-003: zorunlu evrak olmadan istek reddedilir", () => {
  assert.deepEqual(validatePaymentInput({ ...validInput, document: null }), [
    "ERR_DOCUMENT_REQUIRED",
    "Araç tescil belgesi veya noter satış taslağı yüklenmesi zorunludur.",
  ]);
});

test("TS-004: EPK 51 kodu müşteriye güvenli yetersiz limit mesajı verir", () => {
  assert.deepEqual(mapEpkFailure("51"), {
    code: "INSUFFICIENT_FUNDS",
    message: "Kartınızın limiti bu işlem için yetersizdir. Lütfen başka bir kart deneyiniz.",
  });
});

test("TS-005: 3D Secure bekleyen işlem süresi dolunca EXPIRED olur ve hakediş üretmez", () => {
  const result = resolvePaymentState({ status: "PENDING_3DS", expires_at: "2026-01-01T00:00:00.000Z", settlement: { status: "PENDING" } }, Date.parse("2026-01-01T00:03:01.000Z"));
  assert.equal(result.status, "EXPIRED");
  assert.equal(result.settlement, undefined);
  assert.equal(result.failure.code, "THREEDS_TIMEOUT");
});

test("TS-006: 15 haneli veya yasak karakterli şasi reddedilir", () => {
  assert.equal(isValidChassis("WBA123456789012"), false);
  assert.equal(isValidChassis("WBA8A1107GK12345I"), false);
  assert.equal(isValidChassis("WBA8A1107GK123456"), true);
});
