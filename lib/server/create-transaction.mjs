import { randomUUID } from "node:crypto";
import { calculateFinancialBreakdown, normalizeChassis, normalizePlate } from "../tasitpos.mjs";
import { storePrivateDocument } from "./document-storage.mjs";
import { createEpkPaymentLink } from "./epk-client.mjs";
import { sendPaymentSms } from "./sms-client.mjs";
import { saveTransaction } from "./transaction-repository.mjs";
import { writeSecurityAudit } from "./security-audit.mjs";

export async function createTransaction(input) {
  const transactionId = `tx_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
  const createdAt = new Date().toISOString();
  const calculationMode = process.env.GROSS_CALCULATION_MODE || "DIRECT_MARKUP";
  const financial = calculateFinancialBreakdown(input.netAmount, calculationMode, {
    epkRate: Number(process.env.EPK_COMMISSION_RATE || 0.249),
    platformRate: Number(process.env.PLATFORM_COMMISSION_RATE || 0.012),
  });
  const document = await storePrivateDocument(input.document, transactionId);
  const epk = await createEpkPaymentLink({
    transactionId,
    grossAmount: financial.gross_amount,
    subMerchantId: input.subMerchantId,
  });

  const transaction = {
    record_id: randomUUID(),
    id: transactionId,
    galeri_id: input.galleryId || "gal_demo",
    plate: normalizePlate(input.vehiclePlate),
    chassis_no: normalizeChassis(input.chassisNumber),
    motor_no: String(input.motorNumber).trim(),
    brand_model: String(input.brandModel).trim(),
    document_url: document.url,
    document_provider: document.provider,
    customer_phone: String(input.customerPhone).replace(/\D/g, ""),
    epk_transaction_id: epk.epkTransactionId,
    epk_link: epk.paymentUrl,
    epk_provider: epk.provider,
    ...financial,
    status: "PENDING_CUSTOMER_PAYMENT",
    sms_status: "PENDING",
    created_at: createdAt,
  };
  await saveTransaction(transaction);

  try {
    const sms = await sendPaymentSms({ phone: transaction.customer_phone, paymentUrl: transaction.epk_link, transactionId });
    transaction.sms_status = "SENT";
    transaction.sms_provider = sms.provider;
    transaction.sms_message_id = sms.messageId;
  } catch (error) {
    transaction.sms_status = "FAILED";
    transaction.sms_error = error.message;
  }
  await saveTransaction(transaction);
  writeSecurityAudit("PAYMENT_LINK_CREATED", { gallery_id: transaction.galeri_id, transaction_id: transaction.id, status: transaction.status, document_provider: transaction.document_provider });
  return transaction;
}
