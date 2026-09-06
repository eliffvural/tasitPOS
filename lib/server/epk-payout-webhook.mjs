import { createHmac, timingSafeEqual } from "node:crypto";
import { getTransaction, saveTransaction } from "./transaction-repository.mjs";
import { publishPaymentEvent } from "./payment-events.mjs";
import { writeSecurityAudit } from "./security-audit.mjs";

function fail(status, code, message) {
  return Response.json({ success: false, error_code: code, message }, { status });
}

function verify(body, secret) {
  const supplied = String(body.hash_signature || "").toLowerCase();
  const source = [body.merchant_reference, body.payout_id, body.status, body.amount, body.payout_date].join("|");
  const expected = createHmac("sha256", secret).update(source).digest("hex");
  return supplied.length === expected.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}

export async function handleEpkPayoutWebhook(request) {
  const secret = process.env.EPK_PAYOUT_WEBHOOK_SECRET || process.env.EPK_WEBHOOK_SECRET;
  if (!secret) return fail(503, "ERR_INTEGRATION_NOT_CONFIGURED", "Hakediş webhook gizli anahtarı yapılandırılmadı.");
  let body;
  try { body = await request.json(); } catch { return fail(400, "ERR_INVALID_JSON", "Webhook JSON içeriği okunamadı."); }
  const required = ["merchant_reference", "payout_id", "status", "amount", "payout_date", "hash_signature"];
  if (required.some((field) => body[field] === undefined || body[field] === "")) return fail(400, "ERR_VALIDATION_FAILED", "Hakediş webhook alanları eksik.");
  if (!verify(body, secret)) return fail(401, "ERR_INVALID_SIGNATURE", "Hakediş webhook imzası doğrulanamadı.");
  if (!["PAID", "FAILED"].includes(body.status) || !Number.isFinite(Number(body.amount)) || !Number.isFinite(new Date(body.payout_date).getTime())) {
    return fail(400, "ERR_VALIDATION_FAILED", "Hakediş durumu, tutarı veya tarihi geçersiz.");
  }
  const transaction = await getTransaction(body.merchant_reference);
  if (!transaction) return fail(404, "ERR_TRANSACTION_NOT_FOUND", "İşlem bulunamadı.");
  if (transaction.status !== "SUCCESS" || !transaction.settlement) return fail(409, "ERR_SETTLEMENT_NOT_READY", "İşlem hakediş aşamasında değil.");
  if (Math.abs(Number(transaction.net_amount) - Number(body.amount)) > 0.009) return fail(409, "ERR_AMOUNT_MISMATCH", "Hakediş tutarı net galeri tutarıyla eşleşmiyor.");
  if (transaction.last_payout_signature === body.hash_signature) {
    return Response.json({ success: true, data: { transaction_id: transaction.id, payout_status: transaction.settlement.status, idempotent: true } });
  }
  transaction.settlement.status = body.status;
  transaction.settlement.payout_id = String(body.payout_id);
  transaction.settlement.payout_date = body.payout_date;
  transaction.settlement.failure_reason = body.status === "FAILED" ? String(body.reason || "EPK hakediş transferi başarısız oldu.") : null;
  transaction.last_payout_signature = body.hash_signature;
  transaction.updated_at = new Date().toISOString();
  await saveTransaction(transaction);
  writeSecurityAudit("EPK_PAYOUT_WEBHOOK_PROCESSED", { gallery_id: transaction.galeri_id, transaction_id: transaction.id, payout_status: body.status, payout_id: body.payout_id });
  publishPaymentEvent({ type: "PAYOUT_STATUS_CHANGED", gallery_id: transaction.galeri_id, transaction_id: transaction.id, status: transaction.status, settlement: transaction.settlement });
  return Response.json({ success: true, data: { transaction_id: transaction.id, payout_id: body.payout_id, payout_status: body.status, amount: Number(body.amount), payout_date: body.payout_date, verified: true } });
}
