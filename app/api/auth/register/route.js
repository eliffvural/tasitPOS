import { createSessionToken, sessionCookie } from "../../../../lib/server/session.mjs";
import { registerAccount } from "../../../../lib/server/login-credentials.mjs";
import { writeSecurityAudit } from "../../../../lib/server/security-audit.mjs";

export const runtime = "nodejs";

const attempts = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function clientKey(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function blocked(key) {
  const current = attempts.get(key);
  if (!current || Date.now() - current.startedAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return current.count >= MAX_ATTEMPTS;
}

function recorded(key) {
  const current = attempts.get(key);
  attempts.set(key, !current || Date.now() - current.startedAt > WINDOW_MS
    ? { count: 1, startedAt: Date.now() }
    : { ...current, count: current.count + 1 });
}

export async function POST(request) {
  const key = clientKey(request);
  if (blocked(key)) {
    return Response.json({ success: false, error_code: "ERR_REGISTER_RATE_LIMIT", message: "Çok fazla kayıt denemesi yapıldı. Lütfen daha sonra tekrar deneyin." }, { status: 429 });
  }

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ success: false, error_code: "ERR_INVALID_JSON", message: "Kayıt bilgileri okunamadı." }, { status: 400 });
  }

  const password = String(body.password || "");
  const confirm = String(body.password_confirm ?? body.confirmPassword ?? "");
  if (confirm && password !== confirm) {
    return Response.json({ success: false, error_code: "ERR_PASSWORD_MISMATCH", message: "Parola ile tekrarı aynı olmalıdır." }, { status: 400 });
  }

  recorded(key);
  try {
    const principal = await registerAccount({
      email: body.email,
      password,
      displayName: body.display_name || body.gallery_name || "",
    });
    const token = createSessionToken(principal, false);
    writeSecurityAudit("REGISTER_SUCCEEDED", { gallery_id: principal.galleryId });
    return Response.json(
      { success: true, data: { email: principal.email, role: principal.role } },
      { headers: { "Set-Cookie": sessionCookie(token, false), "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const messages = {
      ERR_INVALID_EMAIL: ["Geçerli bir e-posta adresi girin.", 400],
      ERR_WEAK_PASSWORD: ["Parola en az 8 karakter olmalıdır.", 400],
      ERR_EMAIL_TAKEN: ["Bu e-posta ile zaten bir hesap var. Giriş yapın.", 409],
    };
    const mapped = messages[error.message];
    if (mapped) return Response.json({ success: false, error_code: error.message, message: mapped[0] }, { status: mapped[1] });
    console.error("register_failed", error);
    return Response.json({ success: false, error_code: "ERR_REGISTER_FAILED", message: "Hesap şu anda oluşturulamadı. Lütfen tekrar deneyin." }, { status: 500 });
  }
}
