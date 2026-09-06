import { randomUUID } from "node:crypto";
import { roundMoney } from "../tasitpos.mjs";
import { requestEpkRefund } from "./epk-client.mjs";
import { getRefundByIdempotencyKey, getTransaction, saveRefundLog, saveTransaction } from "./transaction-repository.mjs";
import { writeSecurityAudit } from "./security-audit.mjs";

function turkeyParts(value) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(value));
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function resolveOperationType(paymentDate, nowValue = Date.now()) {
  const paid = turkeyParts(paymentDate);
  const now = turkeyParts(nowValue);
  const sameDay = paid.year === now.year && paid.month === now.month && paid.day === now.day;
  const cutoffHour = Number(process.env.REFUND_CUTOFF_HOUR_TR || 23);
  return sameDay && Number(now.hour) < cutoffHour ? "VOID" : "REFUND";
}

export async function processRefund({ principal, input, idempotencyKey }) {
  const existing = await getRefundByIdempotencyKey(idempotencyKey);
  if (existing) return { ...existing, idempotent: true };

  const transaction = await getTransaction(input.transaction_id);
  if (!transaction) throw new Error("ERR_TRANSACTION_NOT_FOUND");
  if (transaction.galeri_id !== principal.galleryId) throw new Error("ERR_FORBIDDEN");
  if (!["SUCCESS", "PARTIALLY_REFUNDED"].includes(transaction.status)) throw new Error("ERR_TRANSACTION_NOT_REFUNDABLE");

  const amount = roundMoney(input.amount);
  const alreadyRefunded = roundMoney(transaction.refunded_amount || 0);
  const refundableAmount = roundMoney(transaction.gross_amount - alreadyRefunded);
  if (amount <= 0 || amount > refundableAmount) throw new Error("ERR_REFUND_AMOUNT");
  if (input.refund_type === "FULL" && amount !== refundableAmount) throw new Error("ERR_FULL_REFUND_AMOUNT");
  if (input.refund_type === "PARTIAL" && amount >= refundableAmount) throw new Error("ERR_PARTIAL_REFUND_AMOUNT");

  const operationType = resolveOperationType(transaction.payment_date || transaction.created_at);
  const epk = await requestEpkRefund({
    epkTransactionId: transaction.epk_transaction_id,
    amount,
    reason: input.reason,
    operationType,
    idempotencyKey,
  });
  const processedAt = new Date().toISOString();
  const totalRefunded = roundMoney(alreadyRefunded + amount);
  const isComplete = totalRefunded === roundMoney(transaction.gross_amount);
  const status = isComplete ? (operationType === "VOID" ? "VOIDED" : "REFUNDED") : "PARTIALLY_REFUNDED";
  const refund = {
    id: randomUUID(),
    refund_id: `ref_${randomUUID().replaceAll("-", "").slice(0, 12)}`,
    transaction_id: transaction.id,
    galeri_id: transaction.galeri_id,
    epk_refund_id: epk.epkRefundId,
    refund_amount: amount,
    refund_type: input.refund_type,
    operation_type: operationType,
    reason: input.reason,
    idempotency_key: idempotencyKey,
    status,
    created_at: processedAt,
  };

  await saveRefundLog(refund);
  transaction.refunded_amount = totalRefunded;
  transaction.status = status;
  transaction.last_refund_id = refund.refund_id;
  transaction.updated_at = processedAt;
  if (transaction.settlement) {
    transaction.settlement.refunded_amount = totalRefunded;
    transaction.settlement.remaining_gross_amount = roundMoney(transaction.gross_amount - totalRefunded);
    transaction.settlement.status = isComplete
      ? (operationType === "VOID" ? "CANCELLED" : "REFUNDED")
      : "ADJUSTMENT_REQUIRED";
  }
  await saveTransaction(transaction);
  writeSecurityAudit("REFUND_PROCESSED", { gallery_id: transaction.galeri_id, transaction_id: transaction.id, status, operation_type: operationType, refund_type: input.refund_type });
  return refund;
}
