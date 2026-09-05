import {
  validatePaymentInput,
} from "../../../../lib/tasitpos.mjs";
import { createTransaction } from "../../../../lib/server/create-transaction.mjs";
import { authenticateBearer } from "../../../../lib/server/auth.mjs";

export const runtime = "nodejs";

function jsonError(status, errorCode, message) {
  return Response.json({ success: false, error_code: errorCode, message }, { status });
}

export async function POST(request) {
  let principal;
  try { principal = authenticateBearer(request.headers.get("authorization") || ""); }
  catch (error) { return jsonError(503, error.message, "Kimlik doğrulama servisi yapılandırılmadı."); }
  if (!principal) return jsonError(401, "ERR_UNAUTHORIZED", "Geçerli Bearer erişim belirteci zorunludur.");
  if (principal.role !== "GALLERY") return jsonError(403, "ERR_FORBIDDEN", "Muhasebeci erişimiyle tahsilat oluşturulamaz.");

  const formData = await request.formData();
  const document = formData.get("document");
  const input = {
    vehiclePlate: formData.get("vehicle_plate"),
    chassisNumber: formData.get("chassis_number"),
    motorNumber: formData.get("motor_number"),
    brandModel: formData.get("brand_model"),
    netAmount: formData.get("net_amount"),
    customerPhone: formData.get("customer_phone"),
    document,
    galleryId: principal.galleryId,
  };
  const validationError = validatePaymentInput(input);
  if (validationError) return jsonError(400, ...validationError);

  try {
    const transaction = await createTransaction(input);
    return Response.json({ success: true, data: {
      transaction_id: transaction.id,
      vehicle_plate: transaction.plate,
      chassis_number: transaction.chassis_no,
      brand_model: transaction.brand_model,
      customer_phone_masked: `*** *** ${transaction.customer_phone.slice(-4)}`,
      net_amount: transaction.net_amount,
      gross_amount: transaction.gross_amount,
      commission_rate: transaction.commission_rate,
      epk_rate: transaction.epk_rate,
      platform_rate: transaction.platform_rate,
      calculation_mode: transaction.calculation_mode,
      payment_url: transaction.epk_link,
      status: transaction.status,
      sms_status: transaction.sms_status,
      integration_mode: transaction.epk_provider === "MOCK_EPK" ? "DEMO" : "LIVE",
      created_at: transaction.created_at,
    } }, { status: 201 });
  } catch (error) {
    console.error("create-link failed", error.message);
    const knownCode = String(error.message || "").startsWith("ERR_") ? error.message : "ERR_TRANSACTION_FAILED";
    if (knownCode === "ERR_DOCUMENT_CONTENT") {
      return jsonError(400, knownCode, "Dosyanın içeriği bildirilen PDF, JPG veya PNG formatıyla eşleşmiyor.");
    }
    return jsonError(502, knownCode, "Tahsilat bağlantısı oluşturulamadı. Entegrasyon ayarlarını kontrol edin.");
  }
}
