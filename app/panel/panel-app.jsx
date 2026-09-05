"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { calculateFinancialBreakdown } from "../../lib/tasitpos.mjs";

const money = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });
const emptySummary = {
  payout_today: { amount: 0, description: "Bugün banka hesabına aktarılmış hakediş bulunmuyor" },
  payout_pending_tomorrow: { amount: 0, description: "Bekleyen hakediş bulunmuyor" },
  total_monthly_turnover: { gross_sales: 0, net_payout: 0, total_commission_paid: 0, transaction_count: 0, period: "" },
};
const emptyAccounting = { summary: { total_successful_sales: 0, total_gross_pos_volume: 0, total_net_payout_received: 0, total_deducted_commission: 0, pending_customer_invoices: 0 }, invoice_reconciliation_list: [] };

function panelRow(item) {
  const invoice = item.accounting_guide.invoice_status;
  return {
    transaction_id: item.transaction_id,
    plate: item.vehicle_details.plate,
    chassis: item.vehicle_details.chassis_no,
    model: item.vehicle_details.model || "Model bilgisi yok",
    gross: item.financial_breakdown.gross_amount,
    net: item.financial_breakdown.net_payout_amount,
    commission: item.financial_breakdown.total_commission_fee,
    status: item.payout_status,
    paymentStatus: item.payment_status,
    refundable: item.refundable,
    payoutDate: item.payout_date,
    payout: item.payout_date ? new Date(item.payout_date).toLocaleString("tr-TR") : "Transfer tarihi henüz oluşmadı",
    invoice: invoice === "VERIFIED" ? "VERIFIED" : invoice,
    receiptUrl: item.receipt_url,
    failure: item.failure,
    expiresAt: item.expires_at,
  };
}

function payoutCountdown(date, now) {
  if (!date) return "Transfer tarihi henüz oluşmadı";
  const remaining = new Date(date).getTime() - now;
  if (remaining <= 0) return "Transfer zamanı geldi; banka teyidi bekleniyor";
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const clock = new Date(date).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  return `${new Date(date).toLocaleDateString("tr-TR")} ${clock} · ${days ? `${days} gün ` : ""}${hours} sa ${minutes} dk kaldı`;
}

function downloadCsv(rows) {
  const header = ["Tarih", "Açıklama", "Borç", "Alacak", "Vergi No", "İşlem No", "Plaka", "Brüt", "Komisyon", "Net Hakediş", "Durum"];
  const lines = rows.map((row) => [row.payout, `${row.plate} ${row.model}`, row.commission, row.net, "", row.transaction_id, row.plate, row.gross, row.commission, row.net, row.status]);
  const csv = [header, ...lines].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";")).join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "tasitpos-muhasebe-raporu.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function PanelApp() {
  const [view, setView] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);
  const [netAmount, setNetAmount] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [refundTarget, setRefundTarget] = useState(null);
  const [pricing, setPricing] = useState({ epkRate: 0.249, platformRate: 0.012, mode: "DIRECT_MARKUP" });
  const [summary, setSummary] = useState(emptySummary);
  const [accounting, setAccounting] = useState(emptyAccounting);
  const [invoiceTarget, setInvoiceTarget] = useState(null);
  const [now, setNow] = useState(Date.now());
  const breakdown = useMemo(() => calculateFinancialBreakdown(netAmount || 0, pricing.mode, pricing), [netAmount, pricing]);
  const accountingRows = useMemo(() => {
    const reportIds = new Set(accounting.invoice_reconciliation_list.map((row) => row.transaction_id));
    return transactions.filter((row) => reportIds.has(row.transaction_id));
  }, [accounting, transactions]);

  async function refreshPayoutData() {
    const headers = { Authorization: "Bearer demo-token" };
    const today = new Date();
    const accountingUrl = `/api/accounting/monthly-report?year=${today.getFullYear()}&month=${today.getMonth() + 1}`;
    const [summaryResponse, transactionsResponse, accountingResponse] = await Promise.all([
      fetch("/api/payouts/summary", { headers, cache: "no-store" }),
      fetch("/api/payouts/transactions?page=1&limit=100", { headers, cache: "no-store" }),
      fetch(accountingUrl, { headers, cache: "no-store" }),
    ]);
    const [summaryResult, transactionsResult, accountingResult] = await Promise.all([summaryResponse.json(), transactionsResponse.json(), accountingResponse.json()]);
    if (summaryResponse.ok && summaryResult.success) setSummary(summaryResult.data);
    if (transactionsResponse.ok && transactionsResult.success) setTransactions(transactionsResult.data.map(panelRow));
    if (accountingResponse.ok && accountingResult.success) setAccounting(accountingResult.data);
  }

  useEffect(() => {
    refreshPayoutData().catch(() => setFeedback({ type: "error", text: "Hakediş verileri alınamadı." }));
    fetch("/api/config/pricing").then((response) => response.json()).then((result) => {
      if (result.success) setPricing({ epkRate: result.data.epk_rate, platformRate: result.data.platform_rate, mode: result.data.calculation_mode });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function connectPaymentEvents() {
      const response = await fetch("/api/events", {
        headers: { Authorization: "Bearer demo-token" },
        signal: controller.signal,
      });
      if (!response.ok || !response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";
        for (const block of blocks) {
          if (!block.startsWith("event: payment")) continue;
          const dataLine = block.split("\n").find((line) => line.startsWith("data: "));
          if (!dataLine) continue;
          const event = JSON.parse(dataLine.slice(6));
          await refreshPayoutData();
          const isWaiting3ds = event.status === "PENDING_3DS";
          setFeedback({
            type: event.status === "SUCCESS" ? "success" : isWaiting3ds ? "loading" : "error",
            text: event.status === "SUCCESS" ? "ÖDEME BAŞARIYLA ALINDI" : isWaiting3ds ? "Müşteri 3D Secure doğrulamasını tamamlamadı; zaman aşımı bekleniyor." : event.failure?.message || "Ödeme başarısız oldu.",
          });
        }
      }
    }
    connectPaymentEvents().catch((error) => {
      if (error.name !== "AbortError") console.error("payment event connection failed");
    });
    return () => controller.abort();
  }, []);

  async function createPayment(event) {
    event.preventDefault();
    setFeedback({ type: "loading", text: "İşlem doğrulanıyor…" });
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/transactions/create-link", { method: "POST", headers: { Authorization: "Bearer demo-token" }, body: formData });
    const result = await response.json();
    if (!response.ok) {
      setFeedback({ type: "error", text: result.message });
      return;
    }
    const item = result.data;
    await refreshPayoutData();
    setFeedback({ type: "success", text: `${item.transaction_id} oluşturuldu; bağlantı müşteriye iletim kuyruğuna alındı.` });
    event.currentTarget.reset();
    setNetAmount("");
  }

  async function requestRefund(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const refundType = String(data.get("refund_type"));
    const amount = Number(data.get("amount"));
    const reason = String(data.get("reason") || "").trim();
    const response = await fetch("/api/transactions/refund", { method: "POST", headers: { Authorization: "Bearer demo-token", "Content-Type": "application/json", "X-Refund-Confirmation": "CONFIRM", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ transaction_id: refundTarget.transaction_id, refund_type: refundType, amount, reason }) });
    const result = await response.json();
    if (response.ok) {
      await refreshPayoutData();
      setFeedback({ type: "success", text: result.data.message });
      setRefundTarget(null);
    } else {
      setFeedback({ type: "error", text: result.message });
    }
  }

  async function reconcileInvoice(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/accounting/monthly-report", {
      method: "POST",
      headers: { Authorization: "Bearer demo-token", "Content-Type": "application/json" },
      body: JSON.stringify({ action: "RECONCILE_CUSTOMER_INVOICE", transaction_id: invoiceTarget.transaction_id, invoice_no: formData.get("invoice_no") }),
    });
    const result = await response.json();
    if (!response.ok) return setFeedback({ type: "error", text: result.message });
    await refreshPayoutData();
    setInvoiceTarget(null);
    setFeedback({ type: "success", text: `${result.data.invoice_no} numaralı satış faturası işlemle eşleştirildi.` });
  }

  return (
    <div className="panel-shell">
      <aside className="panel-sidebar">
        <Link href="/" className="panel-logo">Taşıt<span>POS</span></Link>
        <p className="panel-account"><strong>Demo Galeri A.Ş.</strong><span>Aktif üye işyeri · Demo ortamı</span></p>
        <nav>
          <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>Genel Bakış</button>
          <button className={view === "new" ? "active" : ""} onClick={() => setView("new")}>Yeni Tahsilat</button>
          <button className={view === "transactions" ? "active" : ""} onClick={() => setView("transactions")}>İşlemler & İadeler</button>
          <button className={view === "accounting" ? "active" : ""} onClick={() => setView("accounting")}>Muhasebe</button>
          <Link href="/yardim-merkezi">Yardım Merkezi</Link>
        </nav>
        <div className="panel-security-note">Kart verisi TaşıtPOS sistemine girilmez veya kaydedilmez. Ödeme, EPK güvenli alanında tamamlanır.</div>
      </aside>

      <main className="panel-main">
        <header className="panel-topbar"><div><small>GALERİ PANELİ</small><h1>{view === "new" ? "Yeni tahsilat oluştur" : view === "transactions" ? "İşlem geçmişi" : view === "accounting" ? "Muhasebe ve mutabakat" : "Finansal özet"}</h1></div><span className="demo-badge">DEMO · EPK BAĞLI DEĞİL</span></header>
        {feedback ? <div className={`panel-feedback ${feedback.type}`} role="status">{feedback.text}<button onClick={() => setFeedback(null)}>×</button></div> : null}

        {view === "dashboard" ? <>
          <section className="kpi-grid">
            <article><span>Bugün aktarılan</span><strong>{money.format(summary.payout_today.amount)}</strong><small>{summary.payout_today.description}</small></article>
            <article className="pending"><span>Bekleyen hakediş</span><strong>{money.format(summary.payout_pending_tomorrow.amount)}</strong><small>{summary.payout_pending_tomorrow.description}</small></article>
            <article><span>Aylık brüt hacim</span><strong>{money.format(summary.total_monthly_turnover.gross_sales)}</strong><small>{summary.total_monthly_turnover.transaction_count} başarılı işlem</small></article>
          </section>
          <section className="panel-card panel-onboarding"><div><small>GÜVENLİ ARAÇ TAHSİLATI</small><h2>4 adımda ödeme bağlantısı</h2><p>Araç bilgisi → ruhsat/noter evrakı → otomatik komisyon → EPK güvenli ödeme sayfası.</p></div><button className="btn btn-primary" onClick={() => setView("new")}>Tahsilat oluştur</button></section>
          <TransactionTable rows={transactions.slice(0, 5)} onRefund={setRefundTarget} onInvoice={setInvoiceTarget} now={now} />
        </> : null}

        {view === "new" ? <form className="panel-card collection-form" onSubmit={createPayment}>
          <div className="panel-section-head"><div><span>1</span><h2>Araç ve müşteri bilgileri</h2></div><p>Tüm alanlar satış belgesiyle birebir uyuşmalıdır.</p></div>
          <div className="panel-form-grid">
            <label>Plaka<input name="vehicle_plate" placeholder="34ABC123" required /></label>
            <label>Şasi numarası<input name="chassis_number" minLength="17" maxLength="17" placeholder="17 hane" required /></label>
            <label>Motor numarası<input name="motor_number" placeholder="Motor numarası" required /></label>
            <label>Marka / model<input name="brand_model" placeholder="BMW 320i 2021" required /></label>
            <label>Müşteri GSM<input name="customer_phone" type="tel" placeholder="0532 000 00 00" required /></label>
            <label>Net araç bedeli<input name="net_amount" type="number" min="1" step="0.01" placeholder="Net tutarı girin" value={netAmount} onChange={(e) => setNetAmount(e.target.value)} required /></label>
          </div>
          <div className="commission-preview"><div><span>Net hakediş</span><strong>{money.format(breakdown.net_amount)}</strong></div><div><span>EPK payı (%{breakdown.epk_rate.toLocaleString("tr-TR")})</span><strong>{money.format(breakdown.epk_commission_fee)}</strong></div><div><span>Platform payı (%{breakdown.platform_rate.toLocaleString("tr-TR")})</span><strong>{money.format(breakdown.platform_fee)}</strong></div><div className="total"><span>Karttan çekilecek brüt</span><strong>{money.format(breakdown.gross_amount)}</strong></div></div>
          <div className="panel-section-head"><div><span>2</span><h2>Zorunlu satış evrakı</h2></div><p>PDF, JPG veya PNG · en fazla 5 MB</p></div>
          <label className="panel-dropzone">Ruhsat veya noter satış belgesini seçin<input name="document" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required /></label>
          <label className="compliance-check"><input type="checkbox" required /><span>Bu tahsilatın gerçek bir motorlu araç satışına ait olduğunu, bilgilerin ve belgenin doğru olduğunu onaylıyorum.</span></label>
          <button className="btn btn-primary" type="submit">Güvenli ödeme bağlantısı oluştur</button>
          <p className="form-disclaimer">Demo sürüm gerçek kart bilgisi toplamaz, SMS göndermez ve para hareketi başlatmaz.</p>
        </form> : null}

        {view === "transactions" ? <TransactionTable rows={transactions} onRefund={setRefundTarget} onInvoice={setInvoiceTarget} now={now} /> : null}
        {view === "accounting" ? <>
          <section className="panel-card accounting-head"><div><small>{accounting.period || "CARİ DÖNEM"}</small><h2>Ay sonu mutabakatı</h2><p>Brüt POS hacmi, kesilen komisyon ve net hakediş tek görünümde.</p></div><button className="btn btn-primary" onClick={() => downloadCsv(accountingRows)}>Muhasebe CSV indir</button></section>
          <section className="kpi-grid compact"><article><span>Başarılı işlem</span><strong>{accounting.summary.total_successful_sales}</strong></article><article><span>Toplam komisyon</span><strong>{money.format(accounting.summary.total_deducted_commission)}</strong></article><article><span>Fatura bekleyen</span><strong>{accounting.summary.pending_customer_invoices}</strong></article></section>
          {accounting.summary.pending_customer_invoices ? <div className="invoice-warning"><strong>Eksik fatura uyarısı</strong><span>{accounting.summary.pending_customer_invoices} satış için müşteri satış faturası numarası bekleniyor.</span></div> : null}
          <section className="panel-card accounting-flow"><h2>Ay sonu belge akışı</h2><div><article><strong>1 · Müşteri satış faturası</strong><span>Galerinin sorumluluğunda; karttan çekilen brüt tutar üzerinden eşleştirilir.</span></article><article><strong>2 · EPK komisyon belgesi</strong><span>EPK payı ve yasal kesintiler sağlayıcı belgesiyle takip edilir.</span></article><article><strong>3 · TaşıtPOS hizmet faturası</strong><span>Platform payı ve yapılandırılmış KDV oranı ayrı belge kalemi olarak raporlanır.</span></article></div><small>Muhasebeci erişimi rapor ve belge indirme için salt okunur olarak desteklenir.</small></section>
          <TransactionTable rows={accountingRows} onRefund={setRefundTarget} onInvoice={setInvoiceTarget} now={now} accounting />
        </> : null}
        {refundTarget ? <div className="refund-modal-backdrop" role="presentation"><form className="refund-modal" onSubmit={requestRefund}><div className="refund-modal-head"><div><small>YÜKSEK RİSKLİ İŞLEM</small><h2>İptal / iade talebi</h2></div><button type="button" onClick={() => setRefundTarget(null)}>×</button></div><p><strong>{refundTarget.plate}</strong> · {refundTarget.transaction_id}</p><label>İşlem tipi<select name="refund_type" defaultValue="FULL"><option value="FULL">Tam iade</option><option value="PARTIAL">Kısmi iade</option></select></label><label>İade edilecek brüt tutar<input name="amount" type="number" min="0.01" max={refundTarget.gross} step="0.01" defaultValue={refundTarget.gross} required /></label><label>İade nedeni<textarea name="reason" minLength="5" rows="3" placeholder="İade nedenini yazın" required /></label><label className="compliance-check"><input type="checkbox" required /><span>Tutarı ve işlemi kontrol ettim; EPK’ya iptal/iade talebi gönderilmesini onaylıyorum.</span></label><div className="auth-actions"><button className="btn btn-light" type="button" onClick={() => setRefundTarget(null)}>Vazgeç</button><button className="btn btn-primary" type="submit">Talebi onayla</button></div></form></div> : null}
        {invoiceTarget ? <div className="refund-modal-backdrop" role="presentation"><form className="refund-modal" onSubmit={reconcileInvoice}><div className="refund-modal-head"><div><small>FATURA EŞLEŞTİRME</small><h2>Müşteri satış faturası</h2></div><button type="button" onClick={() => setInvoiceTarget(null)}>×</button></div><p><strong>{invoiceTarget.plate}</strong> · {money.format(invoiceTarget.gross)}</p><label>e-Fatura / e-Arşiv numarası<input name="invoice_no" minLength="5" maxLength="64" placeholder="Fatura numarasını girin" required /></label><div className="auth-actions"><button className="btn btn-light" type="button" onClick={() => setInvoiceTarget(null)}>Vazgeç</button><button className="btn btn-primary" type="submit">Eşleştir ve doğrula</button></div></form></div> : null}
      </main>
    </div>
  );
}

function TransactionTable({ rows, onRefund, onInvoice, now, accounting = false }) {
  async function copy(value) {
    await navigator.clipboard.writeText(value);
  }
  async function downloadReceipt(row) {
    const response = await fetch(row.receiptUrl, { headers: { Authorization: "Bearer demo-token" } });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${row.transaction_id}-transfer-dekontu.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  const payoutLabel = (row) => row.status === "PAID" ? "Hesaba aktarıldı" : row.status === "PENDING" ? "Hakediş bekliyor" : row.status === "PAYMENT_PENDING" ? "Müşteri ödemesi bekleniyor" : row.status === "THREEDS_PENDING" ? "3D Secure bekleniyor" : row.status === "EXPIRED" ? "Süresi doldu" : row.status === "ADJUSTMENT_REQUIRED" ? "Kısmi iade mutabakatı" : row.status === "VOIDED" ? "İptal edildi" : row.status === "REFUNDED" ? "İade edildi" : "Ödeme başarısız";
  return <section className="panel-card transaction-card"><div className="panel-card-title"><div><h2>{accounting ? "Fatura eşleştirmeleri" : "Son işlemler"}</h2><p>Brüt, komisyon ve net hakediş kırılımı</p></div><button className="table-export" onClick={() => downloadCsv(rows)} disabled={!rows.length}>CSV / Excel’e aktar</button></div><div className="table-scroll"><table><thead><tr><th>Araç / işlem</th><th>Brüt</th><th>Komisyon</th><th>Net hakediş</th><th>Transfer</th><th>Fatura</th><th>İşlem</th></tr></thead><tbody>{rows.length ? rows.map((row) => <tr key={row.transaction_id} className={row.status === "PAID" ? "row-paid" : ["PENDING", "PAYMENT_PENDING", "THREEDS_PENDING"].includes(row.status) ? "row-pending" : ["FAILED", "EXPIRED"].includes(row.status) ? "row-failed" : row.invoice === "PENDING_GALLERY_ACTION" ? "row-invoice-missing" : ""}><td><strong>{row.plate} · {row.model}</strong><button className="copy-link" onClick={() => copy(row.plate)}>⧉ Plakayı kopyala</button><button className="copy-link" onClick={() => copy(row.transaction_id)}>⧉ Transfer ID: {row.transaction_id}</button><button className="copy-link" onClick={() => copy(row.chassis)}>⧉ Şasi: {row.chassis}</button></td><td>{money.format(row.gross)}</td><td>{money.format(row.commission)}</td><td><strong>{money.format(row.net)}</strong></td><td><span className={`status status-${row.status.toLowerCase()}`}>{payoutLabel(row)}</span><small>{row.status === "PENDING" ? payoutCountdown(row.payoutDate, now) : row.status === "THREEDS_PENDING" ? payoutCountdown(row.expiresAt, now) : row.failure?.message || row.payout}</small>{row.receiptUrl ? <button className="receipt-button" onClick={() => downloadReceipt(row)}>Transfer dekontunu indir</button> : null}</td><td><span className={`status status-${row.invoice.toLowerCase()}`}>{row.invoice === "VERIFIED" ? "Doğrulandı" : row.invoice === "PENDING_GALLERY_ACTION" ? "Fatura bekliyor" : "Aksiyon yok"}</span>{row.invoice === "PENDING_GALLERY_ACTION" ? <button className="invoice-button" onClick={() => onInvoice(row)}>Fatura no eşleştir</button> : null}</td><td>{row.refundable ? <button className="refund-button" onClick={() => onRefund(row)}>İptal / iade</button> : "—"}</td></tr>) : <tr><td colSpan="7" className="empty-table">Henüz işlem yok. Yeni tahsilat oluşturarak başlayın.</td></tr>}</tbody></table></div></section>;
}
