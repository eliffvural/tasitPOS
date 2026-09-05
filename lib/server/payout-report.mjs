import { roundMoney } from "../tasitpos.mjs";
import { listTransactionsByGallery } from "./transaction-repository.mjs";
import { persistResolvedPaymentState } from "./payment-status.mjs";

const TIME_ZONE = "Europe/Istanbul";

function dateKey(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function monthKey(value) {
  return dateKey(value)?.slice(0, 7) || null;
}

function formatDate(value) {
  if (!value) return null;
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatTry(value) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);
}

function maskIban(value) {
  const iban = String(value || "").replace(/\s/g, "").toUpperCase();
  if (!iban) return null;
  if (iban.length < 8) return "••••";
  return `${iban.slice(0, 4)} ${"•".repeat(Math.min(12, iban.length - 8))} ${iban.slice(-4)}`;
}

function destinationBank() {
  const bankName = process.env.PAYOUT_BANK_NAME?.trim() || null;
  const ibanMasked = maskIban(process.env.PAYOUT_IBAN);
  return { bank_name: bankName, iban_masked: ibanMasked, configured: Boolean(bankName && ibanMasked) };
}

function payoutStatus(transaction) {
  if (transaction.settlement?.status === "PAID") return "PAID";
  if (transaction.status === "SUCCESS" && transaction.settlement?.status === "PENDING") return "PENDING";
  if (transaction.status === "PARTIALLY_REFUNDED") return "ADJUSTMENT_REQUIRED";
  if (["VOIDED", "REFUNDED"].includes(transaction.status)) return transaction.status;
  if (transaction.status === "PENDING_CUSTOMER_PAYMENT") return "PAYMENT_PENDING";
  if (transaction.status === "PENDING_3DS") return "THREEDS_PENDING";
  return transaction.status || "UNKNOWN";
}

function invoiceStatus(transaction) {
  if (transaction.invoice_status) return transaction.invoice_status;
  if (["SUCCESS", "PARTIALLY_REFUNDED"].includes(transaction.status)) return "PENDING_GALLERY_ACTION";
  return "NOT_REQUIRED";
}

function accountingAlert(transaction, status) {
  if (status === "PENDING_GALLERY_ACTION") {
    return `${formatTry(Number(transaction.gross_amount || 0))} tutarında müşteri satış faturası bekleniyor.`;
  }
  if (status === "VERIFIED") return "Müşteri satış faturası doğrulandı.";
  return "Bu işlem için şu anda fatura aksiyonu gerekmiyor.";
}

function mapTransaction(transaction) {
  const invoice = invoiceStatus(transaction);
  return {
    transaction_id: transaction.id,
    payment_status: transaction.status,
    payout_status: payoutStatus(transaction),
    payout_date: transaction.settlement?.payout_date || null,
    vehicle_details: {
      plate: transaction.plate,
      chassis_no: transaction.chassis_no,
      model: transaction.brand_model || null,
    },
    financial_breakdown: {
      gross_amount: roundMoney(transaction.gross_amount || 0),
      commission_rate: Number(transaction.commission_rate || 0),
      epk_commission_fee: roundMoney(transaction.epk_commission_fee || 0),
      tasitpos_platform_fee: roundMoney(transaction.platform_fee || 0),
      total_commission_fee: roundMoney(transaction.total_commission_fee || 0),
      net_payout_amount: roundMoney(transaction.net_amount || 0),
      refunded_amount: roundMoney(transaction.refunded_amount || 0),
    },
    accounting_guide: {
      customer_invoice_amount: roundMoney(transaction.gross_amount || 0),
      invoice_status: invoice,
      alert_message: accountingAlert(transaction, invoice),
    },
    destination_bank: destinationBank(),
    receipt_url: transaction.settlement?.status === "PAID" ? `/api/payouts/transactions/${encodeURIComponent(transaction.id)}/receipt` : null,
    failure: transaction.failure || null,
    expires_at: transaction.expires_at || null,
    refundable: ["SUCCESS", "PARTIALLY_REFUNDED"].includes(transaction.status),
    created_at: transaction.created_at,
  };
}

export async function getPayoutSummary(galleryId) {
  const transactions = await Promise.all((await listTransactionsByGallery(galleryId)).map((item) => persistResolvedPaymentState(item)));
  const today = dateKey(Date.now());
  const currentMonth = monthKey(Date.now());
  const successful = transactions.filter((item) => item.status === "SUCCESS");
  const paidToday = successful.filter((item) => item.settlement?.status === "PAID" && dateKey(item.settlement?.payout_date) === today);
  const pending = successful.filter((item) => item.settlement?.status === "PENDING");
  const monthly = successful.filter((item) => monthKey(item.payment_date || item.created_at) === currentMonth);

  const payoutToday = roundMoney(paidToday.reduce((sum, item) => sum + Number(item.net_amount || 0), 0));
  const payoutPending = roundMoney(pending.reduce((sum, item) => sum + Number(item.net_amount || 0), 0));
  const grossSales = roundMoney(monthly.reduce((sum, item) => sum + Number(item.gross_amount || 0), 0));
  const netPayout = roundMoney(monthly.reduce((sum, item) => sum + Number(item.net_amount || 0), 0));
  const totalCommission = roundMoney(monthly.reduce((sum, item) => sum + Number(item.total_commission_fee || 0), 0));
  const nextPayoutDate = pending.map((item) => item.settlement?.payout_date).filter(Boolean).sort()[0] || null;

  return {
    currency: "TRY",
    payout_today: {
      amount: payoutToday,
      description: payoutToday > 0 ? `Bugün (${formatDate(Date.now())}) banka hesabınıza aktarılan net tutar` : "Bugün banka hesabına aktarılmış hakediş bulunmuyor",
    },
    payout_pending_tomorrow: {
      amount: payoutPending,
      description: payoutPending > 0 && nextPayoutDate ? `${formatDate(nextPayoutDate)} tarihinde aktarılması planlanan net tutar` : "Bekleyen hakediş bulunmuyor",
    },
    total_monthly_turnover: {
      gross_sales: grossSales,
      net_payout: netPayout,
      total_commission_paid: totalCommission,
      transaction_count: monthly.length,
      period: currentMonth,
    },
  };
}

export async function getPayoutTransactions(galleryId, pageInput, limitInput) {
  const page = Math.max(1, Number.parseInt(pageInput, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(limitInput, 10) || 10));
  const transactions = await Promise.all((await listTransactionsByGallery(galleryId)).map((item) => persistResolvedPaymentState(item)));
  const totalRecords = transactions.length;
  const totalPages = totalRecords === 0 ? 0 : Math.ceil(totalRecords / limit);
  const offset = (page - 1) * limit;
  return {
    meta: { current_page: page, total_pages: totalPages, total_records: totalRecords, per_page: limit },
    data: transactions.slice(offset, offset + limit).map(mapTransaction),
  };
}
