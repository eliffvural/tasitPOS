import { getTransaction, saveTransaction } from "./transaction-repository.mjs";
import { publishPaymentEvent } from "./payment-events.mjs";
import { mapEpkFailure, persistResolvedPaymentState } from "./payment-status.mjs";

export async function getDemoPayment(transactionId) {
  const transaction = await getTransaction(transactionId);
  if (!transaction) return null;
  return persistResolvedPaymentState(transaction);
}

export async function applyDemoPaymentScenario(transactionId, scenario) {
  if ((process.env.EPK_MODE || "mock") !== "mock") throw new Error("ERR_DEMO_DISABLED");
  const transaction = await getTransaction(transactionId);
  if (!transaction) throw new Error("ERR_TRANSACTION_NOT_FOUND");
  if (!["PENDING_CUSTOMER_PAYMENT", "PENDING_3DS"].includes(transaction.status)) throw new Error("ERR_PAYMENT_ALREADY_FINAL");

  if (scenario === "INSUFFICIENT_FUNDS") {
    transaction.status = "FAILED";
    transaction.failure = { provider_code: "51", ...mapEpkFailure("51") };
    transaction.failed_at = new Date().toISOString();
    delete transaction.settlement;
  } else if (scenario === "THREEDS_CANCELLED" || scenario === "THREEDS_TIMEOUT") {
    const timeoutSeconds = Math.max(1, Number(process.env.THREEDS_TIMEOUT_SECONDS || 180));
    transaction.status = "PENDING_3DS";
    transaction.threeds_state = scenario;
    transaction.expires_at = new Date(Date.now() + timeoutSeconds * 1000).toISOString();
    delete transaction.settlement;
  } else {
    throw new Error("ERR_INVALID_SCENARIO");
  }
  transaction.updated_at = new Date().toISOString();
  await saveTransaction(transaction);
  publishPaymentEvent({ type: "PAYMENT_STATUS_CHANGED", gallery_id: transaction.galeri_id, transaction_id: transaction.id, status: transaction.status, failure: transaction.failure || null, expires_at: transaction.expires_at || null, settlement: null });
  return transaction;
}
