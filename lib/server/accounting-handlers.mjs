import { authenticateBearer } from "./auth.mjs";
import { getMonthlyAccountingReport, reconcileCustomerInvoice } from "./accounting-report.mjs";

function error(status, code, message) {
  return Response.json({ success: false, error_code: code, message }, { status });
}

function principalFor(request) {
  return authenticateBearer(request.headers.get("authorization") || "");
}

export async function monthlyReportGetHandler(request) {
  const principal = principalFor(request);
  if (!principal) return error(401, "ERR_UNAUTHORIZED", "Geçerli bir Bearer token gereklidir.");
  const url = new URL(request.url);
  try {
    const report = await getMonthlyAccountingReport(principal.galleryId, url.searchParams.get("year"), url.searchParams.get("month"));
    return Response.json({ success: true, data: report });
  } catch (cause) {
    if (cause.message === "ERR_INVALID_PERIOD") return error(400, cause.message, "Geçerli yıl ve ay parametreleri zorunludur.");
    throw cause;
  }
}

export async function monthlyReportPostHandler(request) {
  const principal = principalFor(request);
  if (!principal) return error(401, "ERR_UNAUTHORIZED", "Geçerli bir Bearer token gereklidir.");
  if (principal.role !== "GALLERY") return error(403, "ERR_FORBIDDEN", "Muhasebeci erişimi salt okunurdur.");
  let body;
  try { body = await request.json(); } catch { return error(400, "ERR_INVALID_JSON", "JSON içeriği okunamadı."); }
  if (body.action !== "RECONCILE_CUSTOMER_INVOICE") return error(400, "ERR_INVALID_ACTION", "Desteklenmeyen muhasebe işlemi.");
  try {
    return Response.json({ success: true, data: await reconcileCustomerInvoice(principal.galleryId, body) });
  } catch (cause) {
    const statuses = { ERR_TRANSACTION_NOT_FOUND: 404, ERR_FORBIDDEN: 403, ERR_TRANSACTION_NOT_REPORTABLE: 409, ERR_INVALID_INVOICE_NO: 400 };
    return error(statuses[cause.message] || 500, cause.message || "ERR_ACCOUNTING_UPDATE", "Fatura eşleştirmesi kaydedilemedi.");
  }
}
