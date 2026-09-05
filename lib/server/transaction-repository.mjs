import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const { Pool } = pg;
let fileQueue = Promise.resolve();

async function saveToPostgres(transaction) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS tasitpos_galleries (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS tasitpos_transactions (
      record_id UUID PRIMARY KEY,
      id TEXT UNIQUE NOT NULL,
      galeri_id TEXT NOT NULL REFERENCES tasitpos_galleries(id),
      plate VARCHAR(20) NOT NULL,
      chassis_no VARCHAR(17) NOT NULL,
      document_url VARCHAR(1024) NOT NULL,
      net_amount DECIMAL(15,2) NOT NULL,
      gross_amount DECIMAL(15,2) NOT NULL,
      platform_fee DECIMAL(15,2) NOT NULL,
      customer_phone VARCHAR(20) NOT NULL,
      epk_link TEXT,
      status TEXT NOT NULL,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await pool.query("INSERT INTO tasitpos_galleries (id) VALUES ($1) ON CONFLICT (id) DO NOTHING", [transaction.galeri_id]);
    await pool.query(
      `INSERT INTO tasitpos_transactions
       (record_id, id, galeri_id, plate, chassis_no, document_url, net_amount, gross_amount, platform_fee, customer_phone, epk_link, status, payload, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, $14)
       ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, payload = EXCLUDED.payload,
       net_amount = EXCLUDED.net_amount, gross_amount = EXCLUDED.gross_amount,
       platform_fee = EXCLUDED.platform_fee, epk_link = EXCLUDED.epk_link, updated_at = NOW()`,
      [transaction.record_id, transaction.id, transaction.galeri_id, transaction.plate,
        transaction.chassis_no, transaction.document_url, transaction.net_amount,
        transaction.gross_amount, transaction.platform_fee, transaction.customer_phone,
        transaction.epk_link, transaction.status, JSON.stringify(transaction), transaction.created_at]
    );
  } finally {
    await pool.end();
  }
}

async function ensureRefundTable(pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS tasitpos_refund_logs (
    id UUID PRIMARY KEY,
    refund_id TEXT UNIQUE NOT NULL,
    transaction_id TEXT NOT NULL REFERENCES tasitpos_transactions(id),
    galeri_id TEXT NOT NULL REFERENCES tasitpos_galleries(id),
    epk_refund_id VARCHAR(255),
    refund_amount DECIMAL(15,2) NOT NULL,
    refund_type VARCHAR(16) NOT NULL CHECK (refund_type IN ('FULL', 'PARTIAL')),
    operation_type VARCHAR(16) NOT NULL CHECK (operation_type IN ('VOID', 'REFUND')),
    reason TEXT NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
  )`);
}

async function saveRefundToPostgres(refund) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  try {
    await ensureRefundTable(pool);
    await pool.query(
      `INSERT INTO tasitpos_refund_logs
       (id, refund_id, transaction_id, galeri_id, epk_refund_id, refund_amount, refund_type, operation_type, reason, idempotency_key, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (idempotency_key) DO NOTHING`,
      [refund.id, refund.refund_id, refund.transaction_id, refund.galeri_id,
        refund.epk_refund_id, refund.refund_amount, refund.refund_type,
        refund.operation_type, refund.reason, refund.idempotency_key, refund.created_at]
    );
  } finally { await pool.end(); }
}

async function getRefundFromPostgres(idempotencyKey) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  try {
    await ensureRefundTable(pool);
    const result = await pool.query("SELECT * FROM tasitpos_refund_logs WHERE idempotency_key = $1", [idempotencyKey]);
    return result.rows[0] || null;
  } finally { await pool.end(); }
}

async function getFromPostgres(id) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  try {
    const result = await pool.query("SELECT payload FROM tasitpos_transactions WHERE id = $1", [id]);
    return result.rows[0]?.payload || null;
  } finally {
    await pool.end();
  }
}

async function listFromPostgres(galleryId) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  try {
    const result = await pool.query(
      "SELECT payload FROM tasitpos_transactions WHERE galeri_id = $1 ORDER BY created_at DESC",
      [galleryId]
    );
    return result.rows.map((row) => row.payload);
  } finally {
    await pool.end();
  }
}

async function saveToPrivateFile(transaction) {
  const directory = path.join(process.cwd(), ".data");
  const filePath = path.join(directory, "transactions.json");
  const tempPath = path.join(directory, "transactions.tmp.json");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  let rows = [];
  try { rows = JSON.parse(await readFile(filePath, "utf8")); } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const index = rows.findIndex((row) => row.id === transaction.id);
  if (index >= 0) rows[index] = transaction;
  else rows.push(transaction);
  await writeFile(tempPath, JSON.stringify(rows, null, 2), { mode: 0o600 });
  await rename(tempPath, filePath);
}

async function getFromPrivateFile(id) {
  await fileQueue;
  const filePath = path.join(process.cwd(), ".data", "transactions.json");
  try {
    const rows = JSON.parse(await readFile(filePath, "utf8"));
    return rows.find((row) => row.id === id) || null;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function listFromPrivateFile(galleryId) {
  await fileQueue;
  const rows = await readPrivateRows("transactions.json");
  return rows
    .filter((row) => row.galeri_id === galleryId)
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
}

async function readPrivateRows(name) {
  const filePath = path.join(process.cwd(), ".data", name);
  try { return JSON.parse(await readFile(filePath, "utf8")); }
  catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveRefundToPrivateFile(refund) {
  const directory = path.join(process.cwd(), ".data");
  const filePath = path.join(directory, "refund-logs.json");
  const tempPath = path.join(directory, "refund-logs.tmp.json");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const rows = await readPrivateRows("refund-logs.json");
  if (!rows.some((row) => row.idempotency_key === refund.idempotency_key)) rows.push(refund);
  await writeFile(tempPath, JSON.stringify(rows, null, 2), { mode: 0o600 });
  await rename(tempPath, filePath);
}

async function getRefundFromPrivateFile(idempotencyKey) {
  await fileQueue;
  const rows = await readPrivateRows("refund-logs.json");
  return rows.find((row) => row.idempotency_key === idempotencyKey) || null;
}

export function saveTransaction(transaction) {
  if (process.env.DATABASE_URL) return saveToPostgres(transaction);
  fileQueue = fileQueue.then(() => saveToPrivateFile(transaction));
  return fileQueue;
}

export function getTransaction(id) {
  if (process.env.DATABASE_URL) return getFromPostgres(id);
  return getFromPrivateFile(id);
}

export function listTransactionsByGallery(galleryId) {
  if (process.env.DATABASE_URL) return listFromPostgres(galleryId);
  return listFromPrivateFile(galleryId);
}

export function saveRefundLog(refund) {
  if (process.env.DATABASE_URL) return saveRefundToPostgres(refund);
  fileQueue = fileQueue.then(() => saveRefundToPrivateFile(refund));
  return fileQueue;
}

export function getRefundByIdempotencyKey(idempotencyKey) {
  if (process.env.DATABASE_URL) return getRefundFromPostgres(idempotencyKey);
  return getRefundFromPrivateFile(idempotencyKey);
}
