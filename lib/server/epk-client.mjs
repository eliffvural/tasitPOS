export async function createEpkPaymentLink({ transactionId, grossAmount }) {
  const mode = process.env.EPK_MODE || "mock";

  if (mode === "mock") {
    const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
    return {
      epkTransactionId: `epk_demo_${transactionId.slice(3)}`,
      paymentUrl: `${baseUrl}/odeme-demo/${transactionId}`,
      provider: "MOCK_EPK",
    };
  }

  const baseUrl = process.env.EPK_BASE_URL;
  const apiKey = process.env.EPK_API_KEY;
  const subMerchantId = process.env.EPK_SUB_MERCHANT_ID;
  if (!baseUrl || !apiKey || !subMerchantId) throw new Error("ERR_EPK_NOT_CONFIGURED");

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/payment-links`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      sub_merchant_id: subMerchantId,
      amount: grossAmount,
      currency: "TRY",
      installment: 12,
      merchant_reference: transactionId,
      callback_url: `${process.env.APP_BASE_URL}/api/webhooks/epk-payment-callback`,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("ERR_EPK_REQUEST_FAILED");
  const result = await response.json();
  const paymentUrl = result.payment_url || result.url;
  if (!paymentUrl) throw new Error("ERR_EPK_INVALID_RESPONSE");
  return {
    epkTransactionId: result.transaction_id || result.id,
    paymentUrl,
    provider: "LIVE_EPK",
  };
}

export async function requestEpkRefund({ epkTransactionId, amount, reason, operationType, idempotencyKey }) {
  const mode = process.env.EPK_MODE || "mock";
  if (mode === "mock") {
    return {
      epkRefundId: `epk_ref_${idempotencyKey.replaceAll("-", "").slice(0, 14)}`,
      status: "SUCCESS",
      provider: "MOCK_EPK",
    };
  }

  const baseUrl = process.env.EPK_BASE_URL;
  const apiKey = process.env.EPK_API_KEY;
  if (!baseUrl || !apiKey) throw new Error("ERR_EPK_NOT_CONFIGURED");
  const path = operationType === "VOID" ? "/transactions/void" : "/transactions/refund";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ epk_transaction_id: epkTransactionId, amount, reason }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("ERR_EPK_REFUND_FAILED");
  const result = await response.json();
  if ((result.status || "SUCCESS") !== "SUCCESS") throw new Error("ERR_EPK_REFUND_REJECTED");
  return {
    epkRefundId: result.refund_id || result.transaction_id || result.id,
    status: "SUCCESS",
    provider: "LIVE_EPK",
  };
}
