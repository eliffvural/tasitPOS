import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { get as getBlob, put as putBlob } from "@vercel/blob";
import pg from "pg";

const { Pool } = pg;
const USERS_BLOB_PATH = "tasitpos-users.json";
const FILE_NAME = "users.json";
let storeQueue = Promise.resolve();

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const digest = scryptSync(String(password), salt, 32).toString("hex");
  return `scrypt$${salt}$${digest}`;
}

function verifyPassword(password, encoded) {
  const [algorithm, salt, expectedHex] = String(encoded || "").split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = scryptSync(String(password), salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function toPrincipal(user) {
  if (!user) return null;
  return {
    galleryId: user.galeri_id,
    email: user.email,
    role: user.role || "GALLERY",
    status: user.status || "ACTIVE",
    subMerchantId: user.sub_merchant_id || null,
    permissions: user.permissions || [],
  };
}

function storageMode() {
  if (process.env.DATABASE_URL) return "postgres";
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return "file";
}

function filePath() {
  return path.join(process.cwd(), ".data", FILE_NAME);
}

async function readFileUsers() {
  try {
    return JSON.parse(await readFile(filePath(), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeFileUsers(rows) {
  const directory = path.join(process.cwd(), ".data");
  const destination = filePath();
  const temporary = path.join(directory, "users.tmp.json");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(temporary, JSON.stringify(rows, null, 2), { mode: 0o600 });
  await rename(temporary, destination);
}

async function streamToString(stream) {
  return Buffer.from(await new Response(stream).arrayBuffer()).toString("utf8");
}

async function readBlobUsers() {
  try {
    const result = await getBlob(USERS_BLOB_PATH, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return [];
    const parsed = JSON.parse(await streamToString(result.stream));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeBlobUsers(rows) {
  await putBlob(USERS_BLOB_PATH, JSON.stringify(rows), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

async function withStoreLock(task) {
  const run = storeQueue.then(task, task);
  storeQueue = run.catch(() => {});
  return run;
}

async function readUsers() {
  if (storageMode() === "blob") return readBlobUsers();
  return readFileUsers();
}

async function writeUsers(rows) {
  if (storageMode() === "blob") return writeBlobUsers(rows);
  return writeFileUsers(rows);
}

async function ensureGalleriesTable(pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS tasitpos_galleries (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
}

async function ensureGallery(pool, galleryId) {
  await ensureGalleriesTable(pool);
  await pool.query("INSERT INTO tasitpos_galleries (id) VALUES ($1) ON CONFLICT (id) DO NOTHING", [galleryId]);
}

async function ensureUsersTable(pool) {
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
}

async function postgresUser(email) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  try {
    await ensureGalleriesTable(pool);
    await ensureUsersTable(pool);
    const result = await pool.query("SELECT * FROM tasitpos_users WHERE lower(email)=lower($1) LIMIT 1", [email]);
    return result.rows[0] || null;
  } finally {
    await pool.end();
  }
}

async function findStoredUser(email) {
  if (storageMode() === "postgres") return postgresUser(email);
  const rows = await readUsers();
  return rows.find((row) => normalizeEmail(row.email) === email) || null;
}

export async function registerAccount({ email: emailInput, password, displayName = "" }) {
  const email = normalizeEmail(emailInput);
  const name = String(displayName || "").trim().slice(0, 160);
  if (!isValidEmail(email)) {
    const error = new Error("ERR_INVALID_EMAIL");
    throw error;
  }
  if (!password || String(password).length < 8 || String(password).length > 128) {
    const error = new Error("ERR_WEAK_PASSWORD");
    throw error;
  }

  if (storageMode() === "postgres") {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
    try {
      await ensureGalleriesTable(pool);
      await ensureUsersTable(pool);
      const existing = await pool.query("SELECT id FROM tasitpos_users WHERE lower(email)=lower($1) LIMIT 1", [email]);
      if (existing.rows[0]) throw new Error("ERR_EMAIL_TAKEN");
      const galleryId = `gal_${randomUUID()}`;
      await ensureGallery(pool, galleryId);
      const user = {
        id: randomUUID(),
        galeri_id: galleryId,
        email,
        password_hash: hashPassword(password),
        role: "GALLERY",
        status: "ACTIVE",
        sub_merchant_id: process.env.EPK_SUB_MERCHANT_ID || null,
        permissions: [],
      };
      await pool.query(
        `INSERT INTO tasitpos_users (id, galeri_id, email, password_hash, role, status, sub_merchant_id, permissions)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)`,
        [user.id, user.galeri_id, user.email, user.password_hash, user.role, user.status, user.sub_merchant_id, JSON.stringify(user.permissions)]
      );
      return toPrincipal(user);
    } catch (error) {
      if (error.code === "23505") throw new Error("ERR_EMAIL_TAKEN");
      throw error;
    } finally {
      await pool.end();
    }
  }

  return withStoreLock(async () => {
    const rows = await readUsers();
    if (rows.some((row) => normalizeEmail(row.email) === email)) throw new Error("ERR_EMAIL_TAKEN");
    const user = {
      id: randomUUID(),
      galeri_id: `gal_${randomUUID()}`,
      email,
      password_hash: hashPassword(password),
      role: "GALLERY",
      status: "ACTIVE",
      display_name: name || null,
      sub_merchant_id: process.env.EPK_SUB_MERCHANT_ID || null,
      permissions: [],
      created_at: new Date().toISOString(),
    };
    rows.push(user);
    await writeUsers(rows);
    return toPrincipal(user);
  });
}

export async function verifyLoginCredentials(emailInput, password) {
  const email = normalizeEmail(emailInput);
  if (!email || !password) return null;

  const user = await findStoredUser(email);
  if (user) {
    if (user.status !== "ACTIVE" || !verifyPassword(password, user.password_hash)) return null;
    return toPrincipal(user);
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
