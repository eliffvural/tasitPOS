import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "tasitpos_session";

function secret() {
  const configured = process.env.AUTH_SESSION_SECRET || process.env.JWT_SECRET;
  if (configured) return configured;
  if ((process.env.AUTH_MODE || "mock") === "mock") return "tasitpos-local-demo-session-v1";
  throw new Error("ERR_AUTH_NOT_CONFIGURED");
}

function signature(payload) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(principal, remember = false) {
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: principal.galleryId,
    email: principal.email,
    role: principal.role,
    merchant_status: principal.status,
    sub_merchant_id: principal.subMerchantId || null,
    permissions: principal.permissions || [],
    iat: now,
    exp: now + (remember ? 30 * 24 * 60 * 60 : 8 * 60 * 60),
  })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifySessionToken(token) {
  const [payload, supplied] = String(token || "").split(".");
  if (!payload || !supplied) return null;
  const expected = signature(payload);
  if (supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return null;
  let claims;
  try { claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")); } catch { return null; }
  if (!claims.exp || claims.exp <= Math.floor(Date.now() / 1000) || !claims.sub) return null;
  return {
    galleryId: claims.sub,
    email: claims.email,
    role: claims.role || "GALLERY",
    status: claims.merchant_status || "ACTIVE",
    subMerchantId: claims.sub_merchant_id || null,
    permissions: Array.isArray(claims.permissions) ? claims.permissions : [],
  };
}

export function readSessionCookie(header = "") {
  const cookies = Object.fromEntries(String(header).split(";").map((entry) => {
    const index = entry.indexOf("=");
    return index < 0 ? [entry.trim(), ""] : [entry.slice(0, index).trim(), decodeURIComponent(entry.slice(index + 1))];
  }));
  return cookies[SESSION_COOKIE_NAME] || "";
}

export function sessionCookie(token, remember = false) {
  const maxAge = remember ? 30 * 24 * 60 * 60 : 8 * 60 * 60;
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export function expiredSessionCookie() {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}
