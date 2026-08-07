import { ServiceGrid, SiteFrame } from "../components";
import { brand, processSteps } from "../site-data";

export const metadata = {
  title: "Hizmetlerimiz",
  description:
    "Bayinize özel dijital ödeme altyapısı. Sanal POS, taksitli satış, raporlama, entegrasyon, güvenlik ve 7/24 teknik destek.",
};

export default function ServicesPage() {
  return (
    <SiteFrame>
      <section className="services-hero">
        <div className="container">
          <h1>Hizmetlerimiz</h1>
          <p>Bayinize özel dijital ödeme altyapısı</p>
        </div>
      </section>

      <section className="section services-catalog">
        <div className="container">
          <ServiceGrid detailed />
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <div className="how-it-works-head">
            <h2>Nasıl Çalışır?</h2>
            <p>4 adımda başlayın</p>
          </div>
          <div className="process-flow">
            {processSteps.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-cta-section">
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
                Türkiye genelinde 1000+ aktif galerinin güvendiği altyapı.
              </p>
              <div className="setup-checks">
                <span>Kurulum ücretsiz</span>
                <span>Bağlayıcı sözleşme yok</span>
                <span>24 saatte devreye al</span>
              </div>
              <div className="setup-actions">
                <a className="btn btn-primary" href="/iletisim">
                  Ücretsiz Kurulum Teklifi Alın →
                </a>
                <a className="setup-phone" href={brand.phoneHref}>
                  {brand.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
