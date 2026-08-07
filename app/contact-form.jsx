"use client";

import { useState } from "react";
import { sendToBrandMail } from "./mail";
import { brand } from "./site-data";

export function ContactForm() {
  const [status, setStatus] = useState("idle");

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    sendToBrandMail("Ücretsiz Danışmanlık Talebi", [
      `Ad Soyad: ${String(data.get("name") || "").trim()}`,
      `Telefon: ${String(data.get("phone") || "").trim()}`,
      `E-posta: ${String(data.get("email") || "").trim() || "-"}`,
      `Galeri / Şirket: ${String(data.get("company") || "").trim() || "-"}`,
      "",
      "Mesaj:",
      String(data.get("message") || "").trim(),
    ]);
    setStatus("sent");
    form.reset();
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form-head">
        <h2>Ücretsiz Danışmanlık Alın</h2>
        <p>Bilgilerinizi bırakın, uzmanımız aynı gün sizi arasın.</p>
      </div>

      <div className="contact-form-grid">
        <label>
          Ad Soyad <em>*</em>
          <input type="text" name="name" placeholder="Ahmet Yılmaz" required />
        </label>
        <label>
          <span className="label-row">
            Telefon <em>*</em>
            <small>Sizi bu numaradan arayacağız</small>
          </span>
          <input type="tel" name="phone" placeholder="+90 532 000 00 00" required />
        </label>
        <label>
          E-posta
          <input type="email" name="email" placeholder="ahmet@bayi.com" />
        </label>
        <label>
          Galeri / Şirket Adı
          <input type="text" name="company" placeholder="Galeri Adı" />
        </label>
      </div>

      <label>
        Mesajınız <em>*</em>
        <textarea
          name="message"
          rows="5"
          placeholder="örn. Sanal POS kurulumu hakkında bilgi almak istiyorum, aylık işlem hacmim yaklaşık 50 araç."
          required
        />
      </label>

      <button className="btn btn-primary contact-submit" type="submit">
        Ücretsiz Danışmanlık Talep Et
      </button>
      <p className="contact-disclaimer">
        {status === "sent"
          ? `Talebiniz ${brand.email} adresine yönlendirildi. E-posta uygulamanızdan göndermeniz yeterli.`
          : "Bilgileriniz yalnızca sizinle iletişim kurmak için kullanılır. Spam göndermeyiz."}
      </p>
    </form>
  );
}
