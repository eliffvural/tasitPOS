"use client";

import Link from "next/link";
import { useState } from "react";
import { sendToBrandMail } from "./mail";
import { brand } from "./site-data";

export function LoginForm() {
  const [status, setStatus] = useState("idle");

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();

    sendToBrandMail("TaşıtPOS Müşteri Girişi / Destek Talebi", [
      `E-posta: ${email}`,
      "",
      "Kullanıcı panel girişi veya hesap desteği talep ediyor.",
      `Telefon destek: ${brand.phone}`,
    ]);
    setStatus("sent");
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form-head">
        <h1>Müşteri Girişi</h1>
        <p>TaşıtPOS paneline giriş yaparak tahsilat ve işlemlerinizi yönetin.</p>
      </div>

      {status === "sent" ? (
        <div className="auth-feedback" role="status">
          <strong>Mailiniz hazırlandı.</strong>
          <p>
            Talep <strong>{brand.email}</strong> adresine yönlendirildi. E-posta
            uygulamanızdan göndermeniz yeterli.
          </p>
        </div>
      ) : (
        <>
          <label>
            E-posta <em>*</em>
            <input
              type="email"
              name="email"
              placeholder="ornek@galeri.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Parola <em>*</em>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>
          <div className="auth-row">
            <label className="auth-check">
              <input type="checkbox" name="remember" />
              Beni hatırla
            </label>
            <a
              href={`${brand.emailHref}?subject=${encodeURIComponent("TaşıtPOS Parola Sıfırlama")}`}
            >
              Parolamı unuttum
            </a>
          </div>
          <button className="btn btn-primary auth-submit" type="submit">
            Giriş Yap
          </button>
        </>
      )}

      <p className="auth-switch">
        Henüz üye değil misiniz?{" "}
        <Link href="/basvuru">Hızlı başvuru yapın</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [status, setStatus] = useState("idle");

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    sendToBrandMail("TaşıtPOS Hızlı Başvuru", [
      `Ad Soyad: ${String(data.get("name") || "").trim()}`,
      `Şirket / Galeri: ${String(data.get("company") || "").trim()}`,
      `Vergi No: ${String(data.get("taxId") || "").trim() || "-"}`,
      `Şehir: ${String(data.get("city") || "").trim()}`,
      `Telefon: ${String(data.get("phone") || "").trim()}`,
      `E-posta: ${String(data.get("email") || "").trim()}`,
      "",
      "Not:",
      String(data.get("note") || "").trim() || "-",
    ]);
    setStatus("sent");
    form.reset();
  }

  return (
    <form className="auth-form auth-form-wide" onSubmit={handleSubmit}>
      <div className="auth-form-head">
        <h1>Hızlı Başvuru</h1>
        <p>
          Galeri bilgilerinizi bırakın, aynı gün kurulum için ekibimiz sizinle
          iletişime geçsin.
        </p>
      </div>

      {status === "sent" ? (
        <div className="auth-feedback" role="status">
          <strong>Başvurunuz hazırlandı.</strong>
          <p>
            Mail <strong>{brand.email}</strong> adresine yönlendirildi. E-posta
            uygulamanızdan göndermeniz yeterli.
          </p>
        </div>
      ) : (
        <>
          <div className="auth-grid">
            <label>
              Ad Soyad <em>*</em>
              <input type="text" name="name" placeholder="Ahmet Yılmaz" required />
            </label>
            <label>
              Telefon <em>*</em>
              <input type="tel" name="phone" placeholder="+90 532 000 00 00" required />
            </label>
            <label>
              E-posta <em>*</em>
              <input type="email" name="email" placeholder="ornek@galeri.com" required />
            </label>
            <label>
              Şehir <em>*</em>
              <input type="text" name="city" placeholder="Manisa" required />
            </label>
            <label>
              Galeri / Şirket Adı <em>*</em>
              <input type="text" name="company" placeholder="Galeri Adı" required />
            </label>
            <label>
              Vergi Kimlik No
              <input type="text" name="taxId" placeholder="1234567890" />
            </label>
          </div>
          <label>
            Ek Not
            <textarea
              name="note"
              rows="4"
              placeholder="örn. Aylık işlem hacmim yaklaşık 50 araç, aynı gün kurulum istiyorum."
            />
          </label>
          <button className="btn btn-primary auth-submit" type="submit">
            Başvuruyu Gönder
          </button>
        </>
      )}

      <p className="auth-switch">
        Zaten hesabınız var mı? <Link href="/giris">Müşteri girişi</Link>
      </p>
    </form>
  );
}
