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
        title="Galericiler için güvenli sanal POS çözümü sunuyoruz."
        text="TaşıtPOS, oto galerilerin müşterilerine kredi kartına taksit sunması ve araç satış tahsilatını online alması için tasarlanmıştır."
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
              title="Kurgumuz basit: müşteri aracı seçer, galeri taksit sunar, ödeme güvenle alınır."
            />
            <p>
              Müşteri uzakta olabilir, kapora ödemesi gerekebilir veya araç
              bedelini kredi kartıyla taksitlendirmek isteyebilir. TaşıtPOS bu
              satış anları için pratik sanal POS altyapısı sağlar.
            </p>
            <p>
              Öncelik galerinin hızlı başvuru yapması, POS altyapısını
              kullanması ve müşterisine kartla taksitli ödeme alternatifi
              sunmasıdır.
            </p>
          </div>
        </div>
      </section>

      <section className="section soft compact-section">
        <div className="container">
          <SectionHeader
            eyebrow="Çalışma Prensibi"
            title="Sanal POS anlaşmasını galeri satış ritmine uygun sadeleştiriyoruz."
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
            text="TaşıtPOS, galerinize müşteriye güven veren sanal POS deneyimi, kredi kartına taksit ve online ödeme alma imkanı sunar."
          />
          <Metrics compact />
        </div>
      </section>

      <CTA title="Galeriniz için sanal POS başvurusunu birlikte başlatalım." />
    </SiteFrame>
  );
}
