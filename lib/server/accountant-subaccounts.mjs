import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const { Pool } = pg;
let fileQueue = Promise.resolve();

export function isValidTckn(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!/^[1-9]\d{10}$/.test(digits)) return false;
  const numbers = [...digits].map(Number);
  const odd = numbers[0] + numbers[2] + numbers[4] + numbers[6] + numbers[8];
  const even = numbers[1] + numbers[3] + numbers[5] + numbers[7];
  return ((odd * 7 - even) % 10 + 10) % 10 === numbers[9]
    && numbers.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10 === numbers[10];
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function identityHash(tckn) {
  return createHash("sha256").update(`${process.env.SUBACCOUNT_IDENTITY_PEPPER || "development-only"}:${tckn}`).digest("hex");
}

function publicAccount(row) {
  return {
    id: row.id,
    email: row.email,
    identity_masked: `*******${row.identity_last4}`,
    role: "ACCOUNTANT",
    permissions: ["REPORT_VIEW", "DOCUMENT_DOWNLOAD"],
    status: row.status,
    created_at: row.created_at,
  };
}

async function ensureTable(pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS tasitpos_accountant_subaccounts (
    id UUID PRIMARY KEY,
    galeri_id TEXT NOT NULL REFERENCES tasitpos_galleries(id),
    email VARCHAR(254) NOT NULL,
    identity_hash CHAR(64) NOT NULL,
    identity_last4 CHAR(4) NOT NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('ACTIVE', 'REVOKED')),
    created_at TIMESTAMPTZ NOT NULL,
    UNIQUE (galeri_id, email)
  )`);
}

async function listPostgres(galleryId) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  try {
    await ensureTable(pool);
    const result = await pool.query("SELECT * FROM tasitpos_accountant_subaccounts WHERE galeri_id = $1 ORDER BY created_at DESC", [galleryId]);
    return result.rows.map(publicAccount);
  } finally { await pool.end(); }
}

async function savePostgres(account) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  try {
    await ensureTable(pool);
    const result = await pool.query(
      `INSERT INTO tasitpos_accountant_subaccounts (id, galeri_id, email, identity_hash, identity_last4, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (galeri_id, email) DO UPDATE SET identity_hash=EXCLUDED.identity_hash, identity_last4=EXCLUDED.identity_last4, status='ACTIVE'
       RETURNING *`,
      [account.id, account.galeri_id, account.email, account.identity_hash, account.identity_last4, account.status, account.created_at]
    );
    return publicAccount(result.rows[0]);
  } finally { await pool.end(); }
}

async function revokePostgres(galleryId, id) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  try {
    await ensureTable(pool);
    const result = await pool.query("UPDATE tasitpos_accountant_subaccounts SET status='REVOKED' WHERE galeri_id=$1 AND id=$2 RETURNING *", [galleryId, id]);
    return result.rows[0] ? publicAccount(result.rows[0]) : null;
  } finally { await pool.end(); }
}

async function readFileRows() {
  try { return JSON.parse(await readFile(path.join(process.cwd(), ".data", "accountant-subaccounts.json"), "utf8")); }
  catch (error) { if (error.code === "ENOENT") return []; throw error; }
}

async function writeFileRows(rows) {
  const directory = path.join(process.cwd(), ".data");
  const destination = path.join(directory, "accountant-subaccounts.json");
  const temporary = path.join(directory, "accountant-subaccounts.tmp.json");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(temporary, JSON.stringify(rows, null, 2), { mode: 0o600 });
  await rename(temporary, destination);
}

export async function listAccountantSubaccounts(galleryId) {
  if (process.env.DATABASE_URL) return listPostgres(galleryId);
  await fileQueue;
  return (await readFileRows()).filter((row) => row.galeri_id === galleryId).map(publicAccount);
}

export async function createAccountantSubaccount(galleryId, input) {
  const email = normalizeEmail(input.email);
  const tckn = String(input.tckn || "").replace(/\D/g, "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("ERR_INVALID_EMAIL");
  if (!isValidTckn(tckn)) throw new Error("ERR_INVALID_TCKN");
  const account = {
    id: randomUUID(), galeri_id: galleryId, email,
    identity_hash: identityHash(tckn), identity_last4: tckn.slice(-4),
    status: "ACTIVE", created_at: new Date().toISOString(),
  };
  if (process.env.DATABASE_URL) return savePostgres(account);
  let saved;
  fileQueue = fileQueue.then(async () => {
    const rows = await readFileRows();
    const index = rows.findIndex((row) => row.galeri_id === galleryId && row.email === email);
    if (index >= 0) rows[index] = { ...rows[index], ...account, id: rows[index].id };
    else rows.push(account);
    saved = publicAccount(index >= 0 ? rows[index] : account);
    await writeFileRows(rows);
  });
  await fileQueue;
  return saved;
}

export async function revokeAccountantSubaccount(galleryId, id) {
  if (process.env.DATABASE_URL) return revokePostgres(galleryId, id);
  let result = null;
  fileQueue = fileQueue.then(async () => {
    const rows = await readFileRows();
    const row = rows.find((item) => item.galeri_id === galleryId && item.id === id);
    if (row) { row.status = "REVOKED"; result = publicAccount(row); await writeFileRows(rows); }
  });
  await fileQueue;
  return result;
}
