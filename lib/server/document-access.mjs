import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { authenticateRequest } from "./auth.mjs";
import { readPrivateDocument } from "./document-storage.mjs";
import { getTransaction } from "./transaction-repository.mjs";

const runtimeSecret = randomBytes(32);
const consumedNonces = new Map();

function key() {
  return process.env.DOCUMENT_ACCESS_SECRET || process.env.JWT_SECRET || runtimeSecret;
}

function sign(payload) {
  return createHmac("sha256", key()).update(payload).digest("base64url");
}

function issueToken(transactionId) {
  const payload = Buffer.from(JSON.stringify({ transactionId, exp: Date.now() + 30000, nonce: randomBytes(12).toString("hex") })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function consumeToken(token, transactionId) {
  const [payload, supplied] = String(token || "").split(".");
  if (!payload || !supplied) return false;
  const expected = sign(payload);
  if (supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return false;
  let parsed;
  try { parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")); } catch { return false; }
  if (parsed.transactionId !== transactionId || parsed.exp < Date.now() || consumedNonces.has(parsed.nonce)) return false;
  consumedNonces.set(parsed.nonce, parsed.exp);
  for (const [nonce, expiry] of consumedNonces) if (expiry < Date.now()) consumedNonces.delete(nonce);
  return true;
}

export async function documentAccessHandler(request, context) {
  const principal = authenticateRequest(request);
  if (!principal) return Response.json({ success: false, error_code: "ERR_UNAUTHORIZED", message: "Geçerli Bearer erişim belirteci zorunludur." }, { status: 401 });
  const { transactionId } = await context.params;
  const transaction = await getTransaction(transactionId);
  if (!transaction) return Response.json({ success: false, error_code: "ERR_TRANSACTION_NOT_FOUND", message: "İşlem bulunamadı." }, { status: 404 });
  if (transaction.galeri_id !== principal.galleryId) return Response.json({ success: false, error_code: "ERR_FORBIDDEN", message: "Bu evraka erişim yetkiniz yok." }, { status: 403 });
  const token = issueToken(transaction.id);
  return Response.json({ success: true, data: { url: `/api/documents/${encodeURIComponent(transaction.id)}/download?token=${encodeURIComponent(token)}`, expires_in_seconds: 30, single_use: true } }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function documentDownloadHandler(request, context) {
  const { transactionId } = await context.params;
  const url = new URL(request.url);
  if (!consumeToken(url.searchParams.get("token"), transactionId)) return Response.json({ success: false, error_code: "ERR_DOCUMENT_LINK_INVALID", message: "Evrak bağlantısının süresi dolmuş veya daha önce kullanılmış." }, { status: 401 });
  const transaction = await getTransaction(transactionId);
  if (!transaction) return Response.json({ success: false, error_code: "ERR_TRANSACTION_NOT_FOUND", message: "İşlem bulunamadı." }, { status: 404 });
  const document = await readPrivateDocument(transaction);
  return new Response(document.body, { headers: { "Content-Type": document.contentType, "Content-Disposition": `inline; filename="${transaction.id}-evrak"`, "Cache-Control": "private, no-store, max-age=0" } });
}
