import { CTA, PageIntro, ProcessList, SectionHeader, ServiceGrid, SiteFrame } from "../components";

export const metadata = {
  title: "Hizmetlerimiz",
  description:
    "Sanal POS, 12 aya kadar taksit yönetimi, online tahsilat ve destek. Oto galeriniz için dijital ödeme çözümleri.",
};

export default function ServicesPage() {
  return (
    <SiteFrame>
      <PageIntro
        eyebrow="Hizmetlerimiz"
        title="Sanal POS ve taksit çözümleri."
        text="Oto galerinizdeki ödeme süreçlerini dijitalleştirin. Taksitli satış, online tahsilat ve güvenli ödeme linki tek akışta."
      />

      <section className="section">
        <div className="container">
          <ServiceGrid detailed />
        </div>
      </section>

      <section className="section soft compact-section">
        <div className="container">
          <SectionHeader
            eyebrow="Ödeme Akışı"
            title="Bayinize özel dijital çözümler."
          />
          <div className="module-grid">
            <article>
              <strong>Kart Taksit</strong>
              <h3>Müşterine taksit seçeneği sun</h3>
              <p>Araç satışında karar aldıran en net ödeme kolaylığı.</p>
            </article>
            <article>
              <strong>Ödeme Linki</strong>
              <h3>Uzaktan ödeme al</h3>
              <p>Kapora, peşinat veya kalan ödeme için güvenli link gönder.</p>
            </article>
            <article>
              <strong>Hızlı Başvuru</strong>
              <h3>Sanal POS sürecini başlat</h3>
              <p>POS anlaşması için gerekli başvuru adımları hızlı ilerler.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container dark-grid">
          <SectionHeader
            align="left"
            eyebrow="Nasıl Çalışır?"
            title="Başvurun, kurulum tamamlansın, tahsilata başlayın."
            text="Sanal POS başvurunuz alınır, ödeme altyapınız hazırlanır ve müşterinize kredi kartıyla ödeme alternatifi sunulur."
          />
          <ProcessList />
        </div>
      </section>

      <section className="section">
        <div className="container split-layout">
          <div className="copy-stack">
            <SectionHeader
              align="left"
              eyebrow="Sanal POS"
              title="Fiziksel POS cihazına gerek kalmadan tahsilat alın."
            />
            <p>
              Tek link ile müşterinize ödeme gönderin, 12 aya kadar taksit
              seçeneği sunun ve araç satış tahsilatını güvenle tamamlayın.
            </p>
            <ul className="check-list">
              <li>Kredi kartına taksitli ödeme alma</li>
              <li>Kapora ve araç bedeli için ödeme linki</li>
              <li>Vade farkını müşteriye yansıtma imkanı</li>
            </ul>
          </div>
          <img
            src="/assets/images/tasitpos/platform-dashboard.png"
            alt="TaşıtPOS ödeme paneli"
            className="feature-image"
          />
        </div>
      </section>

      <CTA title="Bugün başvurun, yarın tahsilat alın." />
    </SiteFrame>
  );
}
