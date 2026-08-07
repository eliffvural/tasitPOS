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
          <p className="eyebrow light">Oto galerilere özel ödeme altyapısı</p>
          <h1>TaşıtPOS</h1>
          <p>
            Sanal POS, taksitli tahsilat ve güvenli ödeme linklerini galerinizin
            satış akışına bağlayan kurumsal platform.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={brand.registerUrl} target="_blank" rel="noreferrer">
              Hızlı Sanal POS Başvurusu
            </a>
            <Link className="btn btn-ghost" href="/hizmetlerimiz">
              Hizmetleri İncele
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-band">
        <div className="container">
          <Metrics />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Platform"
            title="Galeri satışında ödeme, takip ve mutabakat aynı akışta."
            text="Referans aldığımız modern fintech çizgisini otomotiv galerilerinin günlük operasyonuna uygun, sade ve güven veren bir deneyime taşıdık."
          />
          <div className="split-layout">
            <div className="copy-stack">
              <h3>Satış masasında, telefonda veya uzaktan görüşmede aynı güven.</h3>
              <p>
                Bayi ekibiniz ödeme linki oluşturabilir, taksit seçeneklerini
                gösterebilir, işlem durumunu izleyebilir ve gün sonu raporlarını
                tek panelden kontrol edebilir.
              </p>
              <ul className="check-list">
                <li>Güvenli kartlı ödeme ve işlem doğrulama</li>
                <li>Taksit, kapora ve kalan bakiye takibi</li>
                <li>Muhasebe için anlaşılır rapor ekranları</li>
              </ul>
            </div>
            <img
              src="/assets/images/tasitpos/platform-dashboard.png"
              alt="Oto galeri ödeme paneli ve raporlama ekranları"
              className="feature-image"
            />
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <SectionHeader
            eyebrow="Hizmetler"
            title="Galerinizin ödeme operasyonu için gerekli ana modüller."
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
              title="Başvuru sonrası satışa hazır bir ödeme akışı."
              text="Teknik karmaşayı azaltan, bayi ekibinin hızlı adapte olacağı net bir başlangıç süreci."
            />
            <ProcessList />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Bayi Deneyimleri"
            title="Tahsilat hızını ve takip şeffaflığını artıran deneyim."
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
