import {
  CTA,
  HeroSlider,
  Metrics,
  ProcessList,
  SectionHeader,
  ServiceGrid,
  SiteFrame,
} from "./components";
import { testimonials } from "./site-data";

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
              <h2>Galerinizin ihtiyacını bilen ödeme ortağı.</h2>
              <p>
                Oto galericiliğin dinamiklerini bilen ekibimiz, satış anında
                ihtiyaç duyulan hızlı ve güvenli ödeme çözümlerini sade bir
                akışta sunar.
              </p>
              <h3>Müşterine taksit sun, satış fırsatını kaçırma.</h3>
              <p>
                Aynı gün kurulum desteği, TCMB lisanslı güvenli ödeme altyapısı
                ve 12 aya kadar taksit seçenekleriyle galerinize uygun sanal
                POS akışı kurulur.
              </p>
              <div className="platform-points">
                <span>Aynı gün kurulum, sıfır teknik yük</span>
                <span>TCMB lisanslı güvenli ödeme altyapısı</span>
                <span>12 aya kadar esnek taksit yönetimi</span>
              </div>
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

      <section className="section soft">
        <div className="container">
          <SectionHeader
            eyebrow="Hizmetlerimiz"
            title="Bayinize özel dijital ödeme çözümleri."
            text="Oto galerinizdeki ödeme süreçlerini uçtan uca dijitalleştiriyoruz. Hızlı kurulum, güvenli tahsilat ve kesintisiz destek."
          />
          <ServiceGrid />
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

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Müşteri Yorumları"
            title="Galeriler TaşıtPOS ile tahsilat süreçlerini kolaylaştırıyor."
          />
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <figure key={item.name}>
                <blockquote>“{item.quote}”</blockquote>
                <figcaption>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </SiteFrame>
  );
}
