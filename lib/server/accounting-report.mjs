import { roundMoney } from "../tasitpos.mjs";
import { getTransaction, listTransactionsByGallery, saveTransaction } from "./transaction-repository.mjs";

const REPORTABLE_STATUSES = new Set(["SUCCESS", "PARTIALLY_REFUNDED", "REFUNDED"]);

function turkeyDate(value) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function normalizePeriod(yearInput, monthInput) {
  const year = Number.parseInt(yearInput, 10);
  const month = Number.parseInt(monthInput, 10);
  if (!Number.isInteger(year) || year < 2000 || year > 2100 || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("ERR_INVALID_PERIOD");
  }
  return `${year}-${String(month).padStart(2, "0")}`;
}

function reconciliationRow(transaction) {
  const epkRate = Number(transaction.epk_rate ?? process.env.EPK_COMMISSION_RATE ?? 0.249) * (Number(transaction.epk_rate) > 1 ? 1 : 100);
  const platformRate = Number(transaction.platform_rate ?? process.env.PLATFORM_COMMISSION_RATE ?? 0.012) * (Number(transaction.platform_rate) > 1 ? 1 : 100);
  const vatRate = Number(process.env.PLATFORM_VAT_RATE || 0.20);
  const platformFee = roundMoney(transaction.platform_fee || 0);
  return {
    transaction_id: transaction.id,
    vehicle_plate: transaction.plate,
    sale_date: turkeyDate(transaction.payment_date || transaction.created_at),
    pos_swipe_gross: roundMoney(transaction.gross_amount || 0),
    galeri_net_hakedis: roundMoney(transaction.net_amount || 0),
    total_commission_deducted: roundMoney(transaction.total_commission_fee || 0),
    epk_invoice_share: roundMoney(transaction.epk_commission_fee || 0),
    epk_commission_rate: roundMoney(epkRate),
    tasitpos_invoice_share: platformFee,
    tasitpos_platform_rate: roundMoney(platformRate),
    tasitpos_invoice_vat: roundMoney(platformFee * vatRate),
    galeri_customer_invoice_status: transaction.invoice_status || "PENDING_GALLERY_ACTION",
    galeri_customer_invoice_no: transaction.invoice_no || null,
    documents: {
      customer_sales_invoice: {
        responsible_party: "GALLERY",
        status: transaction.invoice_status || "PENDING_GALLERY_ACTION",
        reference_no: transaction.invoice_no || null,
      },
      epk_commission_document: {
        responsible_party: "EPK",
        status: transaction.epk_invoice_status || "PENDING_PROVIDER",
        reference_no: transaction.epk_invoice_no || null,
      },
      tasitpos_service_invoice: {
        responsible_party: "TASITPOS",
        status: transaction.platform_invoice_status || "PENDING_PLATFORM",
        reference_no: transaction.platform_invoice_no || null,
      },
      bank_transfer_receipt: {
        status: transaction.settlement?.status === "PAID" ? "AVAILABLE" : "NOT_AVAILABLE",
        download_url: transaction.settlement?.status === "PAID" ? `/payouts/transactions/${encodeURIComponent(transaction.id)}/receipt` : null,
      },
    },
  };
}

export async function getMonthlyAccountingReport(galleryId, year, month) {
  const period = normalizePeriod(year, month);
  const transactions = (await listTransactionsByGallery(galleryId))
    .filter((item) => REPORTABLE_STATUSES.has(item.status))
    .filter((item) => turkeyDate(item.payment_date || item.created_at).startsWith(period));
  const rows = transactions.map(reconciliationRow);
  return {
    galeri_id: galleryId,
    period,
    summary: {
      total_successful_sales: transactions.filter((item) => item.status === "SUCCESS").length,
      total_gross_pos_volume: roundMoney(rows.reduce((sum, row) => sum + row.pos_swipe_gross, 0)),
      total_net_payout_received: roundMoney(rows.reduce((sum, row) => sum + row.galeri_net_hakedis, 0)),
      total_deducted_commission: roundMoney(rows.reduce((sum, row) => sum + row.total_commission_deducted, 0)),
      pending_customer_invoices: rows.filter((row) => row.galeri_customer_invoice_status !== "VERIFIED").length,
    },
    invoice_reconciliation_list: rows,
  };
}

export async function reconcileCustomerInvoice(galleryId, input) {
  const transaction = await getTransaction(String(input.transaction_id || ""));
  if (!transaction) throw new Error("ERR_TRANSACTION_NOT_FOUND");
  if (transaction.galeri_id !== galleryId) throw new Error("ERR_FORBIDDEN");
  if (!REPORTABLE_STATUSES.has(transaction.status)) throw new Error("ERR_TRANSACTION_NOT_REPORTABLE");
  const invoiceNo = String(input.invoice_no || "").trim().toUpperCase();
  if (invoiceNo.length < 5 || invoiceNo.length > 64 || !/^[A-ZÇĞİÖŞÜ0-9._/-]+$/u.test(invoiceNo)) throw new Error("ERR_INVALID_INVOICE_NO");
  transaction.invoice_status = "VERIFIED";
  transaction.invoice_no = invoiceNo;
  transaction.invoice_verified_at = new Date().toISOString();
  await saveTransaction(transaction);
  return { transaction_id: transaction.id, invoice_status: transaction.invoice_status, invoice_no: transaction.invoice_no, verified_at: transaction.invoice_verified_at };
}
