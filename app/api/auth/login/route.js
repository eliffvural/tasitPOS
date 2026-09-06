import { createSessionToken, sessionCookie } from "../../../../lib/server/session.mjs";
import { verifyLoginCredentials } from "../../../../lib/server/login-credentials.mjs";
import { writeSecurityAudit } from "../../../../lib/server/security-audit.mjs";

export const runtime = "nodejs";

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function clientKey(request, email) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return `${ip}:${String(email || "").trim().toLowerCase()}`;
}

function blocked(key) {
  const current = attempts.get(key);
  if (!current || Date.now() - current.startedAt > WINDOW_MS) { attempts.delete(key); return false; }
  return current.count >= MAX_ATTEMPTS;
}

function failed(key) {
  const current = attempts.get(key);
  attempts.set(key, !current || Date.now() - current.startedAt > WINDOW_MS ? { count: 1, startedAt: Date.now() } : { ...current, count: current.count + 1 });
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ success: false, error_code: "ERR_INVALID_JSON", message: "Giriş bilgileri okunamadı." }, { status: 400 }); }
  const key = clientKey(request, body.email);
  if (blocked(key)) return Response.json({ success: false, error_code: "ERR_LOGIN_RATE_LIMIT", message: "Çok fazla hatalı deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin." }, { status: 429 });
  const principal = await verifyLoginCredentials(body.email, body.password);
  if (!principal) {
    failed(key);
    writeSecurityAudit("LOGIN_FAILED", { email_hash_hint: String(body.email || "").trim().toLowerCase().slice(0, 3) });
    return Response.json({ success: false, error_code: "ERR_INVALID_CREDENTIALS", message: "E-posta veya parola hatalı. Hesabınız yoksa kayıt olun." }, { status: 401 });
  }
  attempts.delete(key);
  const remember = Boolean(body.remember);
  const token = createSessionToken(principal, remember);
  writeSecurityAudit("LOGIN_SUCCEEDED", { gallery_id: principal.galleryId, role: principal.role });
  return Response.json({ success: true, data: { email: principal.email, role: principal.role } }, { headers: { "Set-Cookie": sessionCookie(token, remember), "Cache-Control": "no-store" } });
}
