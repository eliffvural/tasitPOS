import Link from "next/link";
import {
  CTA,
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
      <section className="home-hero">
        <img
          src="/assets/images/tasitpos/hero-payment.png"
          alt="Oto galeride dijital ödeme onayı gösteren danışman"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="eyebrow light">Galericiler için güvenli sanal POS çözümleri</p>
          <h1>TaşıtPOS</h1>
          <p>
            Müşterine taksit sun, satışını büyüt. Sen sat, kartlı tahsilatı ve
            sanal POS anlaşmasını kolayca çözelim.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={brand.registerUrl} target="_blank" rel="noreferrer">
              Hemen Sanal POS Başvurusu
            </a>
            <Link className="btn btn-ghost" href="/hizmetlerimiz">
              Kart Taksit İmkanlarını İncele
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-band">
        <div className="container">
          <Metrics />
        </div>
      </section>

      <section className="section platform-section">
        <div className="container">
          <div className="platform-grid">
            <div className="copy-stack platform-copy">
              <p className="eyebrow">Platform</p>
              <h2>Oto galeriniz için pratik sanal POS ve kart taksit altyapısı.</h2>
              <p>
                Araç satışında müşteriniz kredi kartıyla ödeme yapmak
                istediğinde süreci uzatmadan, güvenli ve anlaşılır bir ödeme
                akışı sunarsınız.
              </p>
              <h3>Müşterine taksit sun, tahsilatı güvenle tamamla.</h3>
              <p>
                Galeriniz sanal POS başvurusunu tamamladıktan sonra kapora,
                peşinat veya araç bedeli için ödeme linki oluşturabilir; vade
                farkını müşteriye yansıtarak satışını daha rahat kapatabilir.
              </p>
              <div className="platform-points">
                <span>Tüm kredi kartlarına taksit imkanı</span>
                <span>Güvenli online ödeme ve ödeme linki</span>
                <span>Vade farkı müşteriye yansıtılır</span>
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
            eyebrow="Hizmetler"
            title="Galerinizin sanal POS anlaşması için gereken ana imkanlar."
          />
          <ServiceGrid />
        </div>
      </section>

      <section className="section dark">
        <div className="container">
          <div className="dark-grid">
            <SectionHeader
              align="left"
              eyebrow="Kurulum"
              title="Başvurudan ödeme almaya kadar kolay ilerleyen süreç."
              text="Amaç karmaşık program satmak değil; galerinizin hızlıca sanal POS kullanıp müşterisinden kartla tahsilat almasını sağlamak."
            />
            <ProcessList />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Bayi Deneyimleri"
            title="Kart taksit sunan galeriler satış görüşmesini daha rahat kapatır."
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
