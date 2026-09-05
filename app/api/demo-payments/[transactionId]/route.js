import { applyDemoPaymentScenario, getDemoPayment } from "../../../../lib/server/demo-payment.mjs";

export const runtime = "nodejs";

function publicResult(transaction) {
  return {
    transaction_id: transaction.id,
    status: transaction.status,
    expires_at: transaction.expires_at || null,
    failure: transaction.failure || null,
  };
}

export async function GET(_request, context) {
  const { transactionId } = await context.params;
  const transaction = await getDemoPayment(transactionId);
  if (!transaction) return Response.json({ success: false, error_code: "ERR_TRANSACTION_NOT_FOUND", message: "Ödeme işlemi bulunamadı." }, { status: 404 });
  return Response.json({ success: true, data: publicResult(transaction) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request, context) {
  const { transactionId } = await context.params;
  let body;
  try { body = await request.json(); } catch { return Response.json({ success: false, error_code: "ERR_INVALID_JSON", message: "JSON içeriği okunamadı." }, { status: 400 }); }
  try {
    const transaction = await applyDemoPaymentScenario(transactionId, body.scenario);
    return Response.json({ success: true, data: publicResult(transaction) });
  } catch (error) {
    const statuses = { ERR_TRANSACTION_NOT_FOUND: 404, ERR_DEMO_DISABLED: 403, ERR_PAYMENT_ALREADY_FINAL: 409, ERR_INVALID_SCENARIO: 400 };
    return Response.json({ success: false, error_code: error.message, message: "Demo ödeme senaryosu uygulanamadı." }, { status: statuses[error.message] || 500 });
  }
}
