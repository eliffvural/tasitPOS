import { scryptSync, timingSafeEqual } from "node:crypto";
import pg from "pg";

const { Pool } = pg;

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function verifyPassword(password, encoded) {
  const [algorithm, salt, expectedHex] = String(encoded || "").split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = scryptSync(String(password), salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function databaseUser(email) {
  if (!process.env.DATABASE_URL) return null;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS tasitpos_users (
      id UUID PRIMARY KEY,
      galeri_id TEXT NOT NULL REFERENCES tasitpos_galleries(id),
      email VARCHAR(254) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(24) NOT NULL CHECK (role IN ('GALLERY', 'ACCOUNTANT')),
      status VARCHAR(16) NOT NULL CHECK (status IN ('ACTIVE', 'LOCKED', 'REVOKED')),
      sub_merchant_id VARCHAR(255),
      permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    const result = await pool.query("SELECT * FROM tasitpos_users WHERE lower(email)=lower($1) LIMIT 1", [email]);
    return result.rows[0] || null;
  } finally { await pool.end(); }
}

export async function verifyLoginCredentials(emailInput, password) {
  const email = normalizeEmail(emailInput);
  if (!email || !password) return null;

  const user = await databaseUser(email);
  if (user) {
    if (user.status !== "ACTIVE" || !verifyPassword(password, user.password_hash)) return null;
    return { galleryId: user.galeri_id, email: user.email, role: user.role, status: user.status, subMerchantId: user.sub_merchant_id, permissions: user.permissions || [] };
  }

  const configuredEmail = normalizeEmail(process.env.AUTH_LOGIN_EMAIL);
  const configuredHash = process.env.AUTH_LOGIN_PASSWORD_HASH;
  if (configuredEmail && configuredHash && email === configuredEmail && verifyPassword(password, configuredHash)) {
    return { galleryId: process.env.AUTH_LOGIN_GALLERY_ID || "gal_demo", email, role: "GALLERY", status: "ACTIVE", subMerchantId: process.env.EPK_SUB_MERCHANT_ID || "sub_demo" };
  }

  if ((process.env.AUTH_MODE || "mock") === "mock" && email === "demo@tasitpos.com" && password === "TasitPOSDemo!2026") {
    return { galleryId: "gal_demo", email, role: "GALLERY", status: "ACTIVE", subMerchantId: "sub_demo" };
  }
  return null;
}
