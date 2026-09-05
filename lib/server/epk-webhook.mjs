import { createHmac, timingSafeEqual } from "node:crypto";
import { getTransaction, saveTransaction } from "./transaction-repository.mjs";
import { publishPaymentEvent } from "./payment-events.mjs";
import { mapEpkFailure } from "./payment-status.mjs";
import { writeSecurityAudit } from "./security-audit.mjs";

function error(status, code, message) {
  return Response.json({ success: false, error_code: code, message }, { status });
}

function canonicalPayload(body) {
  return [body.epk_transaction_id, body.merchant_reference, body.status, body.amount, body.installment, body.payment_date].join("|");
}

function verifySignature(body, secret) {
  const supplied = String(body.hash_signature || "").toLowerCase();
  const { hash_signature: _ignored, ...unsigned } = body;
  const source = process.env.EPK_SIGNATURE_MODE === "json" ? JSON.stringify(unsigned) : canonicalPayload(body);
  const expected = createHmac("sha256", secret).update(source).digest("hex");
  return supplied.length === expected.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}

function nextBusinessDayAtNineTurkey(paymentDate) {
  const turkeyTime = new Date(new Date(paymentDate).getTime() + 3 * 60 * 60 * 1000);
  do { turkeyTime.setUTCDate(turkeyTime.getUTCDate() + 1); }
  while ([0, 6].includes(turkeyTime.getUTCDay()));
  turkeyTime.setUTCHours(6, 0, 0, 0);
  return turkeyTime.toISOString();
}

export async function handleEpkWebhook(request) {
  const secret = process.env.EPK_WEBHOOK_SECRET;
  if (!secret) return error(503, "ERR_INTEGRATION_NOT_CONFIGURED", "Webhook gizli anahtarı yapılandırılmadı.");

  let body;
  try { body = await request.json(); }
  catch { return error(400, "ERR_INVALID_JSON", "Webhook JSON içeriği okunamadı."); }

  const required = ["epk_transaction_id", "merchant_reference", "status", "amount", "installment", "payment_date", "hash_signature"];
  if (required.some((field) => body[field] === undefined || body[field] === "")) {
    return error(400, "ERR_VALIDATION_FAILED", "Webhook alanları eksik.");
  }
  if (!verifySignature(body, secret)) return error(401, "ERR_INVALID_SIGNATURE", "Webhook imzası doğrulanamadı.");
  if (!["SUCCESS", "FAILED"].includes(body.status) || !Number.isFinite(Number(body.amount)) || Number(body.installment) !== 12) {
    return error(400, "ERR_VALIDATION_FAILED", "Webhook durumu, tutarı veya taksit bilgisi geçersiz.");
  }

  const paymentTime = new Date(body.payment_date).getTime();
  const tolerance = Number(process.env.EPK_WEBHOOK_TOLERANCE_SECONDS || 600) * 1000;
  if (!Number.isFinite(paymentTime) || Math.abs(Date.now() - paymentTime) > tolerance) {
    return error(400, "ERR_WEBHOOK_EXPIRED", "Webhook zaman damgası kabul edilen aralığın dışında.");
  }

  const transaction = await getTransaction(body.merchant_reference);
  if (!transaction) return error(404, "ERR_TRANSACTION_NOT_FOUND", "İşlem bulunamadı.");
  if (transaction.epk_transaction_id && transaction.epk_transaction_id !== body.epk_transaction_id) {
    return error(409, "ERR_EPK_TRANSACTION_MISMATCH", "EPK işlem numarası kayıtla eşleşmiyor.");
  }
  if (Math.abs(Number(transaction.gross_amount) - Number(body.amount)) > 0.009) {
    return error(409, "ERR_AMOUNT_MISMATCH", "Webhook tutarı kayıtlı brüt tutarla eşleşmiyor.");
  }
  if (transaction.status === body.status && transaction.last_webhook_signature === body.hash_signature) {
    return Response.json({ success: true, data: { transaction_id: transaction.id, status: transaction.status, verified: true, idempotent: true } });
  }

  transaction.status = body.status;
  transaction.payment_date = body.payment_date;
  transaction.last_webhook_signature = body.hash_signature;
  transaction.webhook_received_at = new Date().toISOString();

  if (body.status === "SUCCESS") {
    const epkShare = Number(transaction.epk_commission_fee);
    const platformShare = Math.round((Number(transaction.gross_amount) - Number(transaction.net_amount) - epkShare) * 100) / 100;
    transaction.settlement = {
      status: "PENDING",
      payout_date: nextBusinessDayAtNineTurkey(body.payment_date),
      currency: "TRY",
      gross_amount: transaction.gross_amount,
      gallery_payout: transaction.net_amount,
      epk_share: epkShare,
      platform_share: platformShare,
      balance_check: Math.round((Number(transaction.net_amount) + epkShare + platformShare) * 100) / 100 === Number(transaction.gross_amount),
    };
    delete transaction.failure;
    delete transaction.expires_at;
  } else {
    transaction.failure = { provider_code: String(body.error_code || "UNKNOWN"), ...mapEpkFailure(body.error_code) };
    delete transaction.settlement;
  }

  await saveTransaction(transaction);
  writeSecurityAudit("EPK_WEBHOOK_PROCESSED", { gallery_id: transaction.galeri_id, transaction_id: transaction.id, status: transaction.status, provider_code: transaction.failure?.provider_code });
  publishPaymentEvent({
    type: "PAYMENT_STATUS_CHANGED",
    gallery_id: transaction.galeri_id,
    transaction_id: transaction.id,
    status: transaction.status,
    failure: transaction.failure || null,
    settlement: transaction.settlement || null,
  });

  return Response.json({
    success: true,
    data: {
      transaction_id: transaction.id,
      status: transaction.status,
      failure: transaction.failure || null,
      verified: true,
      settlement: transaction.settlement || null,
    },
  });
}
