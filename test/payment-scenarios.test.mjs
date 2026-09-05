import test from "node:test";
import assert from "node:assert/strict";
import { isValidChassis, validatePaymentInput } from "../lib/tasitpos.mjs";
import { mapEpkFailure, resolvePaymentState } from "../lib/server/payment-status.mjs";

const validInput = {
  vehiclePlate: "34ABC123",
  chassisNumber: "WBA8A1107GK123456",
  motorNumber: "MTR-1",
  brandModel: "Test araç",
  netAmount: 100,
  customerPhone: "05320000000",
  document: { size: 1, type: "application/pdf" },
};

test("TS-003: zorunlu evrak olmadan istek reddedilir", () => {
  assert.deepEqual(validatePaymentInput({ ...validInput, document: null }), [
    "ERR_DOCUMENT_REQUIRED",
    "Araç tescil belgesi veya noter satış taslağı yüklenmesi zorunludur.",
  ]);
});

test("TS-004: EPK 51 kodu müşteriye güvenli yetersiz limit mesajı verir", () => {
  assert.deepEqual(mapEpkFailure("51"), {
    code: "INSUFFICIENT_FUNDS",
    message: "Kartınızın limiti bu işlem için yetersizdir. Lütfen başka bir kart deneyiniz.",
  });
});

test("TS-005: 3D Secure bekleyen işlem süresi dolunca EXPIRED olur ve hakediş üretmez", () => {
  const result = resolvePaymentState({ status: "PENDING_3DS", expires_at: "2026-01-01T00:00:00.000Z", settlement: { status: "PENDING" } }, Date.parse("2026-01-01T00:03:01.000Z"));
  assert.equal(result.status, "EXPIRED");
  assert.equal(result.settlement, undefined);
  assert.equal(result.failure.code, "THREEDS_TIMEOUT");
});

test("TS-006: 15 haneli veya yasak karakterli şasi reddedilir", () => {
  assert.equal(isValidChassis("WBA123456789012"), false);
  assert.equal(isValidChassis("WBA8A1107GK12345I"), false);
  assert.equal(isValidChassis("WBA8A1107GK123456"), true);
});
