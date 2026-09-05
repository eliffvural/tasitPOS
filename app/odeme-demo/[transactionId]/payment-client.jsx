"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const labels = {
  PENDING_CUSTOMER_PAYMENT: "Ödeme bekleniyor",
  PENDING_3DS: "3D Secure doğrulaması bekleniyor",
  FAILED: "Ödeme başarısız",
  EXPIRED: "Doğrulama süresi doldu",
  SUCCESS: "Ödeme başarılı",
};

export function DemoPaymentClient({ transactionId }) {
  const [payment, setPayment] = useState(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const response = await fetch(`/api/demo-payments/${encodeURIComponent(transactionId)}`, { cache: "no-store" });
    const result = await response.json();
    if (result.success) setPayment(result.data);
  }

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function runScenario(scenario) {
    setBusy(true);
    const response = await fetch(`/api/demo-payments/${encodeURIComponent(transactionId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario }),
    });
    const result = await response.json();
    if (result.success) setPayment(result.data);
    setBusy(false);
  }

  const seconds = payment?.expires_at ? Math.max(0, Math.ceil((new Date(payment.expires_at).getTime() - Date.now()) / 1000)) : null;
  const isFinal = ["FAILED", "EXPIRED", "SUCCESS"].includes(payment?.status);
  return <main className="demo-payment-page"><section><span>TAŞITPOS · DEMO EPK</span><h1>{labels[payment?.status] || "Ödeme bağlantısı"}</h1><p>İşlem: <strong>{transactionId}</strong></p><div className="help-warning"><strong>Gerçek ödeme alınmaz.</strong> Kart numarası, son kullanma tarihi veya CVV TaşıtPOS’a gönderilmez ve kaydedilmez.</div>{payment?.failure ? <div className="demo-payment-error"><strong>{payment.failure.message}</strong><small>EPK hata kodu: {payment.failure.provider_code}</small></div> : null}{payment?.status === "PENDING_3DS" ? <div className="demo-payment-pending"><strong>3D Secure sonucu bekleniyor</strong><span>{seconds} saniye sonra işlem otomatik olarak zaman aşımına uğrar.</span></div> : null}{!isFinal && payment?.status !== "PENDING_3DS" ? <div className="demo-payment-actions"><button disabled={busy} onClick={() => runScenario("INSUFFICIENT_FUNDS")}>Yetersiz bakiye senaryosu</button><button disabled={busy} onClick={() => runScenario("THREEDS_CANCELLED")}>3D Secure ekranını kapat</button><button disabled={busy} onClick={() => runScenario("THREEDS_TIMEOUT")}>3D Secure zaman aşımı</button></div> : null}<Link className="btn btn-primary" href="/panel">Galeri paneline dön</Link></section></main>;
}
