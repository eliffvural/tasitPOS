export const COMMISSION_RATE = 0.261;
export const EPK_RATE = 0.249;
export const PLATFORM_RATE = 0.012;
export const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;
export const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

export function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

// Belgelerdeki örneklerle uyumlu model: komisyon net araç bedeline eklenir.
export function calculateFinancialBreakdown(netAmount, mode = "DIRECT_MARKUP", rates = {}) {
  const net = roundMoney(netAmount);
  const epkRate = Number.isFinite(Number(rates.epkRate)) ? Number(rates.epkRate) : EPK_RATE;
  const platformRate = Number.isFinite(Number(rates.platformRate)) ? Number(rates.platformRate) : PLATFORM_RATE;
  // Oranı para gibi iki ondalığa yuvarlamak NET_SETTLEMENT hesabında
  // %26,10'u %26'ya düşürür. Hesaplamada tam oranı, çıktıda yüzdeyi kullan.
  const commissionRate = epkRate + platformRate;
  const calculationBase = mode === "NET_SETTLEMENT"
    ? roundMoney(net / (1 - commissionRate))
    : net;
  const epkFee = roundMoney(calculationBase * epkRate);
  const platformFee = roundMoney(calculationBase * platformRate);
  const totalCommission = roundMoney(epkFee + platformFee);

  return {
    net_amount: net,
    gross_amount: mode === "NET_SETTLEMENT" ? calculationBase : roundMoney(net + totalCommission),
    commission_rate: roundMoney(commissionRate * 100),
    epk_rate: epkRate * 100,
    platform_rate: platformRate * 100,
    calculation_mode: mode,
    epk_commission_fee: epkFee,
    platform_fee: platformFee,
    total_commission_fee: totalCommission,
  };
}

export function normalizePlate(value = "") {
  return String(value).toLocaleUpperCase("tr-TR").replace(/[^0-9A-ZÇĞİÖŞÜ]/g, "");
}

export function normalizeChassis(value = "") {
  return String(value).toUpperCase().replace(/\s/g, "");
}

export function isValidChassis(value) {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(normalizeChassis(value));
}

export function isValidPhone(value = "") {
  const digits = String(value).replace(/\D/g, "");
  return /^(?:(?:90|0)?5)\d{9}$/.test(digits);
}

export function validatePaymentInput({
  vehiclePlate,
  chassisNumber,
  motorNumber,
  brandModel,
  netAmount,
  customerPhone,
  document,
}) {
  if (!normalizePlate(vehiclePlate)) return ["ERR_VALIDATION_FAILED", "Araç plakası zorunludur."];
  if (!isValidChassis(chassisNumber)) return ["ERR_INVALID_CHASSIS", "Şasi numarası 17 haneli ve geçerli formatta olmalıdır."];
  if (!String(motorNumber || "").trim()) return ["ERR_VALIDATION_FAILED", "Motor numarası zorunludur."];
  if (!String(brandModel || "").trim()) return ["ERR_VALIDATION_FAILED", "Marka ve model zorunludur."];
  if (!Number.isFinite(Number(netAmount)) || Number(netAmount) <= 0) return ["ERR_VALIDATION_FAILED", "Net araç bedeli sıfırdan büyük olmalıdır."];
  if (!isValidPhone(customerPhone)) return ["ERR_VALIDATION_FAILED", "Geçerli bir müşteri cep telefonu girilmelidir."];
  if (!document || !document.size) return ["ERR_DOCUMENT_REQUIRED", "Araç tescil belgesi veya noter satış taslağı yüklenmesi zorunludur."];
  if (document.size > MAX_DOCUMENT_SIZE) return ["ERR_DOCUMENT_TOO_LARGE", "Evrak boyutu en fazla 5 MB olabilir."];
  if (!ALLOWED_DOCUMENT_TYPES.has(document.type)) return ["ERR_DOCUMENT_TYPE", "Evrak PDF, JPG veya PNG formatında olmalıdır."];
  return null;
}
