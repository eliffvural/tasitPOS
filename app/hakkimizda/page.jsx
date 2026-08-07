import { CTA, Metrics, PageIntro, SectionHeader, SiteFrame } from "../components";

export const metadata = {
  title: "Hakkımızda",
  description:
    "TaşıtPOS, oto galeriler için TCMB lisanslı güvenli ödeme altyapısıyla sanal POS ve taksit çözümleri sunar.",
};

export default function AboutPage() {
  return (
    <SiteFrame>
      <PageIntro
        eyebrow="Hakkımızda"
        title="Sektörün sesini dinledik, çözümü inşa ettik."
        text="TaşıtPOS, oto galerilerin kredi kartına taksit sunması ve güvenli sanal POS ile tahsilat alması için geliştirildi."
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
              title="Sektörü bilen bir ortağın farkını yaşayın."
            />
            <p>
              Oto galericiliğin dinamiklerini bilen ekibimiz, satış anında
              ihtiyaç duyulan ödeme kolaylığını pratik bir sanal POS akışına
              dönüştürür.
            </p>
            <p>
              Müşteri aracı seçer, galeri taksit sunar, ödeme güvenle alınır.
              TaşıtPOS bu süreci hızlı, sade ve güvenli hale getirir.
            </p>
          </div>
        </div>
      </section>

      <section className="section soft compact-section">
        <div className="container">
          <SectionHeader
            eyebrow="Çalışma Prensibi"
            title="Bugün başvurun, yarın tahsilat alın."
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

      <CTA title="Bugün başvurun, yarın tahsilat almaya başlayın." />
    </SiteFrame>
  );
}
