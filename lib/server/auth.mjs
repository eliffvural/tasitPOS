import { createHmac, timingSafeEqual } from "node:crypto";

function decodeJson(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

export function authenticateBearer(header = "") {
  if (!header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  const mode = process.env.AUTH_MODE || "mock";
  if (mode === "mock") {
    if (token === "demo-token") return { galleryId: "gal_demo", role: "GALLERY", status: "ACTIVE", subMerchantId: "sub_demo" };
    if (token === "demo-accountant-token") return { galleryId: "gal_demo", role: "ACCOUNTANT", status: "ACTIVE", permissions: ["REPORT_VIEW", "DOCUMENT_DOWNLOAD"] };
    return null;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("ERR_AUTH_NOT_CONFIGURED");
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, suppliedSignature] = parts;
  const jwtHeader = decodeJson(encodedHeader);
  if (jwtHeader.alg !== "HS256") return null;
  const expectedSignature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");
  if (suppliedSignature.length !== expectedSignature.length) return null;
  if (!timingSafeEqual(Buffer.from(suppliedSignature), Buffer.from(expectedSignature))) return null;
  const payload = decodeJson(encodedPayload);
  if (!payload.exp || payload.exp * 1000 <= Date.now()) return null;
  const galleryId = payload.galeri_id || payload.sub;
  return galleryId ? {
    galleryId,
    role: payload.role || "GALLERY",
    status: payload.merchant_status || payload.status || "ACTIVE",
    subMerchantId: payload.sub_merchant_id || null,
    permissions: Array.isArray(payload.permissions) ? payload.permissions : [],
  } : null;
}
