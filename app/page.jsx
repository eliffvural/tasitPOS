import {
  CTA,
  HeroSlider,
  Metrics,
  ProcessList,
  SectionHeader,
  ServiceGrid,
  SiteFrame,
} from "./components";
import { brand, testimonials } from "./site-data";

export default function Home() {
  return (
    <SiteFrame>
      <HeroSlider />

      <section className="stats-band">
        <div className="container">
          <Metrics />
        </div>
      </section>

      <section className="section platform-section">
        <div className="container">
          <div className="platform-grid">
            <div className="copy-stack platform-copy">
              <p className="eyebrow">Neden TaşıtPOS?</p>
              <h2>
                Galerinizin İhtiyacını Bilen <span>Fintech Ortağı</span>
              </h2>
              <p>
                Oto galericiliğin dinamiklerini bizzat deneyimleyen ekibimiz,
                sahada test edilmiş çözümler sunar. Platformumuz galerinize
                uyum sağlar; siz platforma değil.
              </p>
              <div className="platform-points">
                <span>Aynı gün kurulum, sıfır teknik yük</span>
                <span>TCMB lisanslı güvenli ödeme altyapısı</span>
                <span>12 aya kadar esnek taksit yönetimi</span>
                <span>Gerçek zamanlı ödeme takibi</span>
              </div>
              <p className="platform-alert">
                Taksit imkanı sunmayan galeriler araç satışlarının ortalama
                <strong> %35'ini </strong>
                kaybediyor.
              </p>
              <a className="btn btn-primary platform-cta" href="/iletisim">
                Ücretsiz Danışmanlık Al
              </a>
            </div>

            <div className="platform-visual">
              <img
                src="/assets/images/tasitpos/platform-dashboard.png"
                alt="Oto galeride sanal POS ve kart taksit ekranları"
                className="feature-image"
              />
              <div className="visual-note visual-note-top">
                <span>Ödeme Al</span>
                <strong>Kartla tahsilat</strong>
              </div>
              <div className="visual-note visual-note-bottom">
                <span>Taksit</span>
                <strong>Satışı kolaylaştır</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft services-showcase-section">
        <div className="container">
          <div className="services-showcase-head">
            <div>
              <p className="eyebrow">Hizmetlerimiz</p>
              <h2>
                Bayinize Özel Dijital <span>Çözümler</span>
              </h2>
              <p>
                Oto galerinizdeki ödeme süreçlerini uçtan uca dijitalleştiriyoruz.
                Aynı gün kurulum, kesintisiz destek.
              </p>
            </div>
            <figure>
              <img
                src="/assets/images/tasitpos/dealer-consultation.png"
                alt="Oto galeride satış ve ödeme görüşmesi"
              />
            </figure>
          </div>
          <ServiceGrid />
          <div className="services-showcase-action">
            <a className="btn btn-primary" href="/iletisim">
              Size Özel Teklif Al
            </a>
          </div>
        </div>
      </section>

      <section className="testimonial-band">
        <div className="container">
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <figure key={item.name}>
                <div className="quote-mark" aria-hidden="true">
                  ”
                </div>
                <div className="testimonial-meta">
                  <span className="stars" aria-label="5 yıldız">
                    ★★★★★
                  </span>
                  <span className="verified">Doğrulanmış Müşteri</span>
                </div>
                <blockquote>“{item.quote}”</blockquote>
                <figcaption>
                  <span className="avatar">{item.initials}</span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.role}</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="setup-trust-section">
        <div className="trust-marquee" aria-label="Güven ve uyumluluk">
          <div className="trust-title">
            <span />
            <strong>Güven & Uyumluluk</strong>
            <span />
          </div>
          <div className="trust-slider">
            {[0, 1].map((group) => (
              <div className="trust-track" key={group} aria-hidden={group === 1}>
                {[
                  "3D Secure",
                  "Visa",
                  "Mastercard",
                  "Troy",
                  "TCMB Lisanslı",
                  "PCI DSS",
                  "SSL Güvenli",
                  "Aynı Gün Kurulum",
                ].map((item) => (
                  <span key={`${item}-${group}`}>{item}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="container setup-cta-wrap">
          <div className="setup-cta-card">
            <img
              src="/assets/images/tasitpos/setup-cta.png"
              alt="Oto galeride aynı gün sanal POS kurulum görüşmesi"
            />
            <div className="setup-cta-content">
              <p className="setup-pill">Aynı gün kurulum garantisi</p>
              <h2>
                Bugün Başvurun, Yarın <span>Tahsilat Alın</span>
              </h2>
              <p>
                Başvurunuzu tamamlayın, ekibimiz aynı gün sisteminizi kurar.
                Türkiye genelinde oto galeriler için güvenli sanal POS altyapısı.
              </p>
              <div className="setup-badges">
                <span>Kurulum ücretsiz</span>
                <span>Bağlayıcı sözleşme yok</span>
                <span>24 saatte devreye al</span>
              </div>
              <div className="setup-actions">
                <a className="btn btn-primary" href="/iletisim">
                  Ücretsiz Kurulum Teklifi Al
                </a>
                <a className="setup-phone" href={brand.phoneHref}>
                  {brand.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container">
          <div className="dark-grid">
            <SectionHeader
              align="left"
              eyebrow="Nasıl Çalışır?"
              title="Başvurudan tahsilata kadar sade bir süreç."
              text="Galeriniz başvurusunu tamamlar, sanal POS altyapısı hazırlanır ve müşterinize kredi kartıyla ödeme alternatifi sunulur."
            />
            <ProcessList />
          </div>
        </div>
      </section>

      <CTA />
    </SiteFrame>
  );
}
