import { SiteFrame } from "../components";
import { ContactForm } from "../contact-form";
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
      .leaflet-control-attribution { font-size: 10px; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const map = L.map('map', { scrollWheelZoom: false, zoomControl: false }).setView([38.67643, 27.30518], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
      L.marker([38.67643, 27.30518]).addTo(map);
    </script>
  </body>
</html>`;

export const metadata = {
  title: "İletişim",
  description:
    "Sanal POS kurulumu, teknik destek veya iş birliği için uzman ekibimizle iletişime geçin.",
};

export default function ContactPage() {
  return (
    <SiteFrame>
      <section className="contact-hero">
        <div className="container">
          <h1>Bizimle İletişime Geçin</h1>
          <p>
            Sanal POS kurulumu, teknik destek veya iş birliği için uzman
            ekibimizle iletişime geçin.
          </p>
        </div>
      </section>

      <section className="section contact-main">
        <div className="container contact-layout">
          <div className="contact-info">
            <h2>İletişim Bilgileri</h2>

            <div className="contact-item">
              <span className="contact-icon contact-icon-pin" aria-hidden="true" />
              <div>
                <span>Adres</span>
                <p>{brand.address}</p>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon contact-icon-phone" aria-hidden="true" />
              <div>
                <span>Telefon</span>
                <a href={brand.phoneHref}>{brand.phone}</a>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon contact-icon-mail" aria-hidden="true" />
              <div>
                <span>E-posta</span>
                <a href={brand.emailHref}>{brand.email}</a>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon contact-icon-clock" aria-hidden="true" />
              <div>
                <span>Çalışma Saatleri</span>
                <p>Pzt-Cum: 09:00-18:00</p>
              </div>
            </div>

            <div className="contact-map">
              <a
                className="contact-map-open"
                href={brand.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                Haritalarda aç
              </a>
              <iframe
                title="TaşıtPOS konum haritası"
                srcDoc={mapSrcDoc}
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </SiteFrame>
  );
}
