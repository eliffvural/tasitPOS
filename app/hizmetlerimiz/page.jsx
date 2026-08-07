import { CTA, PageIntro, ProcessList, SectionHeader, ServiceGrid, SiteFrame } from "../components";

export const metadata = {
  title: "Hizmetlerimiz",
  description:
    "Oto galeriler için sanal POS, karta taksit, ödeme linki ve hızlı başvuru hizmetleri.",
};

export default function ServicesPage() {
  return (
    <SiteFrame>
      <PageIntro
        eyebrow="Hizmetlerimiz"
        title="Sanal POS, kredi kartına taksit ve güvenli ödeme linki."
        text="Müşterine taksit sun, kapora veya araç bedelini online al, satışını pratik tamamla."
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
            title="Satış anında ihtiyacın olan POS imkanları."
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
            eyebrow="Nasıl işler?"
            title="Başvur, aktive ol, ödeme al."
            text="Galeriniz başvurur, sanal POS altyapısı hazırlanır, müşteriye kartla ödeme alternatifi sunulur."
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
              title="Öncelik hızlı ve güvenli kartlı tahsilattır."
            />
            <p>
              TaşıtPOS, araç satışında kartla tahsilat almayı kolaylaştıran
              sanal POS çözümüdür. Müşterine taksit sunar, ödeme linkiyle
              tahsilatı güvenle tamamlarsın.
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

      <CTA />
    </SiteFrame>
  );
}
