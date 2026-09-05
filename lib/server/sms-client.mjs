export async function sendPaymentSms({ phone, paymentUrl, transactionId }) {
  const mode = process.env.SMS_MODE || "mock";
  if (mode === "mock") return { provider: "MOCK_SMS", messageId: `sms_demo_${transactionId.slice(3)}` };

  const apiUrl = process.env.SMS_API_URL;
  const apiKey = process.env.SMS_PROVIDER_API_KEY;
  if (!apiUrl || !apiKey) throw new Error("ERR_SMS_NOT_CONFIGURED");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      to: phone,
      message: `TaşıtPOS güvenli ödeme bağlantınız: ${paymentUrl}`,
      reference: transactionId,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("ERR_SMS_REQUEST_FAILED");
  const result = await response.json();
  return { provider: "LIVE_SMS", messageId: result.message_id || result.id };
}

