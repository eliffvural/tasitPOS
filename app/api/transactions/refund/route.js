import { authenticateRequest } from "../../../../lib/server/auth.mjs";
import { processRefund } from "../../../../lib/server/refund-transaction.mjs";

export const runtime = "nodejs";

const statusByError = {
  ERR_TRANSACTION_NOT_FOUND: 404,
  ERR_FORBIDDEN: 403,
  ERR_TRANSACTION_NOT_REFUNDABLE: 409,
  ERR_REFUND_AMOUNT: 400,
  ERR_FULL_REFUND_AMOUNT: 400,
  ERR_PARTIAL_REFUND_AMOUNT: 400,
};

export async function POST(request) {
  let principal;
  try { principal = authenticateRequest(request); }
  catch (error) { return Response.json({ success: false, error_code: error.message, message: "Kimlik doğrulama servisi yapılandırılmadı." }, { status: 503 }); }
  if (!principal) return Response.json({ success: false, error_code: "ERR_UNAUTHORIZED", message: "Geçerli Bearer erişim belirteci zorunludur." }, { status: 401 });
  if (principal.role !== "GALLERY") return Response.json({ success: false, error_code: "ERR_FORBIDDEN", message: "Muhasebeci erişimiyle iptal/iade başlatılamaz." }, { status: 403 });
  if (request.headers.get("x-refund-confirmation") !== "CONFIRM") {
    return Response.json({ success: false, error_code: "ERR_REFUND_CONFIRMATION_REQUIRED", message: "İade için ikinci aşama onayı zorunludur." }, { status: 428 });
  }
  const idempotencyKey = request.headers.get("idempotency-key") || "";
  if (idempotencyKey.length < 8 || idempotencyKey.length > 255) {
    return Response.json({ success: false, error_code: "ERR_IDEMPOTENCY_KEY_REQUIRED", message: "Geçerli Idempotency-Key başlığı zorunludur." }, { status: 400 });
  }

  let body;
  try { body = await request.json(); }
  catch { return Response.json({ success: false, error_code: "ERR_INVALID_JSON", message: "JSON içeriği okunamadı." }, { status: 400 }); }
  const reason = String(body.reason || "").trim();
  if (!body.transaction_id || !["FULL", "PARTIAL"].includes(body.refund_type) || !Number.isFinite(Number(body.amount)) || reason.length < 5) {
    return Response.json({ success: false, error_code: "ERR_VALIDATION_FAILED", message: "İşlem, iade tipi, geçerli tutar ve en az 5 karakterlik neden zorunludur." }, { status: 400 });
  }

  try {
    const refund = await processRefund({ principal, input: { ...body, reason }, idempotencyKey });
    const isVoid = refund.operation_type === "VOID";
    const isFull = refund.refund_type === "FULL";
    return Response.json({ success: true, data: {
      refund_id: refund.refund_id,
      transaction_id: refund.transaction_id,
      refunded_amount: Number(refund.refund_amount),
      refund_type: refund.refund_type,
      operation_type: refund.operation_type,
      status: refund.status,
      idempotent: Boolean(refund.idempotent),
      message: isVoid
        ? (isFull ? "İşlem aynı gün tamamen iptal edildi; brüt tutar kart limitine iade sürecine alındı." : "Aynı gün kısmi iptal işlendi; belirtilen tutar kart limitine iade sürecine alındı.")
        : (isFull ? "Tam iade başarıyla işlendi; bankaya bağlı olarak karta 1-3 iş gününde yansıyabilir." : "Kısmi iade başarıyla işlendi; bankaya bağlı olarak karta 1-3 iş gününde yansıyabilir."),
      processed_at: refund.created_at,
    } });
  } catch (error) {
    const code = String(error.message || "ERR_REFUND_FAILED");
    return Response.json({ success: false, error_code: code, message: "İptal/iade işlemi gerçekleştirilemedi." }, { status: statusByError[code] || 502 });
  }
}
