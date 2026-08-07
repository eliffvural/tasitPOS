import { PageIntro, SiteFrame } from "../components";
import { brand } from "../site-data";

const mapSrcDoc = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; margin: 0; }
      .leaflet-container { font-family: Arial, sans-serif; }
      .leaflet-popup-content { color: #17345f; font-weight: 700; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const map = L.map('map', { scrollWheelZoom: false }).setView([38.67643, 27.30518], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
      L.marker([38.67643, 27.30518]).addTo(map)
        .bindPopup('TaşıtPOS - Manisa Teknokent')
        .openPopup();
    </script>
  </body>
</html>`;

export const metadata = {
  title: "İletişim",
  description:
    "TaşıtPOS sanal POS başvurusu, kart taksit ve galeri ödeme çözümleri iletişim bilgileri.",
};

export default function ContactPage() {
  return (
    <SiteFrame>
      <PageIntro
        eyebrow="İletişim"
        title="Hemen başla, müşterine taksit sun."
        text="Sanal POS, kredi kartına taksit ve ödeme linki için ekibimizle hemen görüş."
      />

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-info">
            <h2>İletişim Bilgileri</h2>
            <div className="contact-line">
              <span>Telefon</span>
              <a href={brand.phoneHref}>{brand.phone}</a>
            </div>
            <div className="contact-line">
              <span>E-posta</span>
              <a href={brand.emailHref}>{brand.email}</a>
            </div>
            <div className="contact-line">
              <span>Adres</span>
              <p>{brand.address}</p>
              <a className="text-link" href={brand.mapUrl} target="_blank" rel="noreferrer">
                Haritada Gör
              </a>
            </div>
            <div className="contact-note">
              <strong>Çalışma Saatleri</strong>
              <span>Hafta içi 09:00 - 18:00</span>
            </div>
          </div>

          <form className="contact-form" action={brand.emailHref} method="post" encType="text/plain">
            <label>
              Ad Soyad
              <input type="text" name="name" placeholder="Adınız ve soyadınız" />
            </label>
            <label>
              Galeri Adı
              <input type="text" name="company" placeholder="Galeri veya şirket adı" />
            </label>
            <label>
              Telefon
              <input type="tel" name="phone" placeholder="05xx xxx xx xx" />
            </label>
            <label>
              Mesajınız
              <textarea name="message" rows="5" placeholder="Sanal POS ve kart taksit ihtiyacınızı kısaca yazın" />
            </label>
            <button className="btn btn-primary" type="submit">
              Sanal POS Talebi Gönder
            </button>
          </form>
        </div>
      </section>

      <section className="section soft compact-section">
        <div className="container">
          <div className="contact-actions-grid">
            <a href={brand.phoneHref}>
              <span>Telefon</span>
              <strong>{brand.phone}</strong>
            </a>
            <a href={brand.emailHref}>
              <span>E-posta</span>
              <strong>{brand.email}</strong>
            </a>
            <a href={brand.mapUrl} target="_blank" rel="noreferrer">
              <span>Konum</span>
              <strong>Haritada Gör</strong>
            </a>
          </div>
        </div>
      </section>

      <section className="map-section" aria-label="TaşıtPOS konum haritası">
        <div className="container">
          <div className="map-shell">
            <div className="map-copy">
              <p className="eyebrow">Konum</p>
              <h2>Manisa Teknokent ofisimize ulaşın.</h2>
              <p>{brand.address}</p>
            </div>
            <div className="map-frame">
              <div className="map-fallback" aria-hidden="true">
                <span className="map-pin" />
                <span className="map-road road-1" />
                <span className="map-road road-2" />
                <span className="map-road road-3" />
              </div>
              <iframe
                title="TaşıtPOS Manisa Teknokent konumu"
                srcDoc={mapSrcDoc}
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-popups"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
