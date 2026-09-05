import { saveTransaction } from "./transaction-repository.mjs";
import { publishPaymentEvent } from "./payment-events.mjs";

const EPK_FAILURES = {
  "51": { code: "INSUFFICIENT_FUNDS", message: "Kartınızın limiti bu işlem için yetersizdir. Lütfen başka bir kart deneyiniz." },
  "05": { code: "DO_NOT_HONOR", message: "Ödeme banka tarafından onaylanmadı. Lütfen bankanızla görüşün veya başka bir kart deneyin." },
  "3DS_CANCELLED": { code: "THREEDS_CANCELLED", message: "3D Secure doğrulaması tamamlanmadı." },
  "3DS_TIMEOUT": { code: "THREEDS_TIMEOUT", message: "3D Secure doğrulama süresi doldu." },
};

export function mapEpkFailure(providerCode) {
  const normalized = String(providerCode || "UNKNOWN").toUpperCase();
  return EPK_FAILURES[normalized] || { code: "PAYMENT_FAILED", message: "Ödeme tamamlanamadı. Lütfen başka bir kart deneyin." };
}

export function resolvePaymentState(transaction, now = Date.now()) {
  if (transaction.status !== "PENDING_3DS" || !transaction.expires_at) return transaction;
  if (new Date(transaction.expires_at).getTime() > now) return transaction;
  return {
    ...transaction,
    status: "EXPIRED",
    failure: { provider_code: "3DS_TIMEOUT", ...mapEpkFailure("3DS_TIMEOUT") },
    expired_at: new Date(now).toISOString(),
    settlement: undefined,
  };
}

export async function persistResolvedPaymentState(transaction, now = Date.now()) {
  const resolved = resolvePaymentState(transaction, now);
  if (resolved !== transaction) {
    await saveTransaction(resolved);
    publishPaymentEvent({
      type: "PAYMENT_STATUS_CHANGED",
      gallery_id: resolved.galeri_id,
      transaction_id: resolved.id,
      status: resolved.status,
      failure: resolved.failure,
      settlement: null,
    });
  }
  return resolved;
}
