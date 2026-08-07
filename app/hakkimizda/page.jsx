import { CTA, Metrics, PageIntro, SectionHeader, SiteFrame } from "../components";

export const metadata = {
  title: "Hakkımızda",
  description:
    "TaşıtPOS'un oto galeriler için sunduğu güvenli ödeme ve sanal POS yaklaşımı.",
};

export default function AboutPage() {
  return (
    <SiteFrame>
      <PageIntro
        eyebrow="Hakkımızda"
        title="Galericiler için güvenli sanal POS çözümü."
        text="Müşterine taksit sun, araç satış tahsilatını online al, satışını daha rahat büyüt."
      />

      <section className="section">
        <div className="container split-layout">
          <img
            src="/assets/images/tasitpos/dealer-consultation.png"
            alt="Oto galeri ödeme danışmanlığı görüşmesi"
            className="feature-image"
          />
          <div className="copy-stack">
            <SectionHeader
              align="left"
              eyebrow="Yaklaşım"
              title="Kurgu basit: müşteri aracı seçer, galeri taksit sunar, ödeme alınır."
            />
            <p>
              Müşteri uzakta olabilir, kapora vermek isteyebilir veya araç
              bedelini kredi kartıyla ödemek isteyebilir. TaşıtPOS bu anlarda
              pratik sanal POS altyapısı sağlar.
            </p>
            <p>
              Öncelik net: hızlı başvuru, güvenli POS altyapısı ve müşteriye
              kartla taksitli ödeme alternatifi.
            </p>
          </div>
        </div>
      </section>

      <section className="section soft compact-section">
        <div className="container">
          <SectionHeader
            eyebrow="Çalışma Prensibi"
            title="Sanal POS anlaşmasını galeri satış ritmine uygun sadeleştiririz."
          />
          <div className="value-grid">
            <article>
              <span>01</span>
              <h3>Kart taksit odaklı</h3>
              <p>Müşteriye kredi kartıyla taksit seçeneği sunmak satış görüşmesini kolaylaştırır.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Online tahsilat</h3>
              <p>Kapora, peşinat veya kalan tutar için güvenli ödeme linki kullanılabilir.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Kolay başlangıç</h3>
              <p>Başvuru ve kurulum adımları galerinin hızlı ödeme almaya başlaması için planlanır.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Güven"
            title="Güvenli ödeme altyapısı satışın merkezindedir."
            text="TaşıtPOS ile müşterine güvenli ödeme, kredi kartına taksit ve online tahsilat imkanı sunarsın."
          />
          <Metrics compact />
        </div>
      </section>

      <CTA title="Sen sat, sanal POS başvurusunu birlikte başlatalım." />
    </SiteFrame>
  );
}
