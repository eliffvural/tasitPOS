import { authenticateBearer } from "./auth.mjs";
import { getTransaction } from "./transaction-repository.mjs";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

export async function payoutReceiptHandler(request, context) {
  const principal = authenticateBearer(request.headers.get("authorization") || "");
  if (!principal) return Response.json({ success: false, error_code: "ERR_UNAUTHORIZED", message: "Geçerli bir Bearer token gereklidir." }, { status: 401 });
  const { transactionId } = await context.params;
  const transaction = await getTransaction(transactionId);
  if (!transaction) return Response.json({ success: false, error_code: "ERR_TRANSACTION_NOT_FOUND", message: "İşlem bulunamadı." }, { status: 404 });
  if (transaction.galeri_id !== principal.galleryId) return Response.json({ success: false, error_code: "ERR_FORBIDDEN", message: "Bu dekonta erişim yetkiniz yok." }, { status: 403 });
  if (transaction.settlement?.status !== "PAID") return Response.json({ success: false, error_code: "ERR_RECEIPT_NOT_READY", message: "Banka transfer dekontu henüz oluşmadı." }, { status: 409 });

  const amount = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(transaction.net_amount);
  const date = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "long", timeStyle: "short" }).format(new Date(transaction.settlement.payout_date));
  const bank = process.env.PAYOUT_BANK_NAME || "Banka bilgisi yapılandırılmadı";
  const html = `<!doctype html><html lang="tr"><meta charset="utf-8"><title>TaşıtPOS Transfer Dekontu</title><style>body{font:16px Arial;max-width:720px;margin:48px auto;color:#10213d}header{border-bottom:3px solid #12a6a6;padding-bottom:20px}dl{display:grid;grid-template-columns:220px 1fr;gap:12px;margin-top:32px}dt{font-weight:700}footer{margin-top:40px;color:#667085;font-size:12px}</style><header><h1>TaşıtPOS Transfer Dekontu</h1><p>Hakediş banka transfer kaydı</p></header><dl><dt>Transfer No</dt><dd>${escapeHtml(transaction.settlement.payout_id)}</dd><dt>İşlem No</dt><dd>${escapeHtml(transaction.id)}</dd><dt>Galeri</dt><dd>${escapeHtml(transaction.galeri_id)}</dd><dt>Plaka</dt><dd>${escapeHtml(transaction.plate)}</dd><dt>Net aktarılan tutar</dt><dd>${escapeHtml(amount)}</dd><dt>Transfer tarihi</dt><dd>${escapeHtml(date)}</dd><dt>Banka</dt><dd>${escapeHtml(bank)}</dd></dl><footer>Bu belge doğrulanmış EPK hakediş kaydından dinamik olarak oluşturulmuştur.</footer></html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${transaction.id}-transfer-dekontu.html"`,
      "Cache-Control": "private, no-store",
    },
  });
}
