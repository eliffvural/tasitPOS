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
            Müşterine taksit sun, satışını büyüt. Sen sat, güvenli kartlı
            tahsilatı TaşıtPOS ile kolayca çöz.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={brand.registerUrl} target="_blank" rel="noreferrer">
              Hemen Sanal POS Başvurusu
            </a>
            <Link className="btn btn-ghost" href="/hizmetlerimiz">
              Taksit İmkanlarını İncele
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
              <h2>Müşterine taksit sun, araç satışını daha kolay kapat.</h2>
              <p>
                Araç almak isteyen müşteri için ödeme kolaylığı satışın en
                kritik anıdır. TaşıtPOS ile kredi kartına taksit sunar, güvenli
                sanal POS altyapısıyla tahsilat alırsın.
              </p>
              <h3>Sen sat, tahsilatı pratik şekilde tamamla.</h3>
              <p>
                Kapora, peşinat veya araç bedeli için ödeme linki gönder.
                Taksitli ödemede oluşan vade farkını müşteriye yansıt, satışını
                büyüt.
              </p>
              <div className="platform-points">
                <span>Tüm kredi kartlarına 12 aya kadar taksit</span>
                <span>Güvenli ödeme linkiyle hızlı tahsilat</span>
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
            title="Daha çok müşteri, daha çok satış için pratik POS imkanları."
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
              title="Hemen başla, kısa sürede tahsilat almaya başla."
              text="Başvuru süreci sade ilerler. Sanal POS altyapın hazırlanır, müşterine taksit sunar ve güvenli ödeme alırsın."
            />
            <ProcessList />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Bayi Deneyimleri"
            title="Taksit imkanı satış konuşmasını güçlendirir."
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
