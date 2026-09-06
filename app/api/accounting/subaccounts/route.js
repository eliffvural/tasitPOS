import { authenticateBearer } from "../../../../lib/server/auth.mjs";
import { createAccountantSubaccount, listAccountantSubaccounts, revokeAccountantSubaccount } from "../../../../lib/server/accountant-subaccounts.mjs";
import { writeSecurityAudit } from "../../../../lib/server/security-audit.mjs";

export const runtime = "nodejs";

function fail(status, errorCode, message) {
  return Response.json({ success: false, error_code: errorCode, message }, { status });
}

function galleryPrincipal(request) {
  const principal = authenticateBearer(request.headers.get("authorization") || "");
  return principal?.role === "GALLERY" ? principal : null;
}

export async function GET(request) {
  const principal = galleryPrincipal(request);
  if (!principal) return fail(403, "ERR_FORBIDDEN", "Alt hesap yönetimi yalnızca galeri yöneticisine açıktır.");
  return Response.json({ success: true, data: await listAccountantSubaccounts(principal.galleryId) });
}

export async function POST(request) {
  const principal = galleryPrincipal(request);
  if (!principal) return fail(403, "ERR_FORBIDDEN", "Alt hesap yönetimi yalnızca galeri yöneticisine açıktır.");
  let body;
  try { body = await request.json(); } catch { return fail(400, "ERR_INVALID_JSON", "JSON içeriği okunamadı."); }
  try {
    const account = await createAccountantSubaccount(principal.galleryId, body);
    writeSecurityAudit("ACCOUNTANT_SUBACCOUNT_CREATED", { gallery_id: principal.galleryId, subaccount_id: account.id });
    return Response.json({ success: true, data: account }, { status: 201 });
  } catch (error) {
    const messages = { ERR_INVALID_EMAIL: "Geçerli bir e-posta adresi girilmelidir.", ERR_INVALID_TCKN: "Geçerli bir T.C. kimlik numarası girilmelidir." };
    return fail(400, error.message, messages[error.message] || "Alt hesap oluşturulamadı.");
  }
}

export async function DELETE(request) {
  const principal = galleryPrincipal(request);
  if (!principal) return fail(403, "ERR_FORBIDDEN", "Alt hesap yönetimi yalnızca galeri yöneticisine açıktır.");
  const id = new URL(request.url).searchParams.get("id");
  const account = id ? await revokeAccountantSubaccount(principal.galleryId, id) : null;
  if (!account) return fail(404, "ERR_SUBACCOUNT_NOT_FOUND", "Muhasebeci alt hesabı bulunamadı.");
  writeSecurityAudit("ACCOUNTANT_SUBACCOUNT_REVOKED", { gallery_id: principal.galleryId, subaccount_id: id });
  return Response.json({ success: true, data: account });
}
