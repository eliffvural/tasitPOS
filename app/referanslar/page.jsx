import { CTA, PageIntro, SectionHeader, SiteFrame } from "../components";
import { caseStudies, testimonials } from "../site-data";

export const metadata = {
  title: "Referanslar",
  description:
    "TaşıtPOS ile çalışan oto galerilerin tahsilat, taksit ve raporlama deneyimleri.",
};

export default function ReferencesPage() {
  return (
    <SiteFrame>
      <PageIntro
        eyebrow="Referanslar"
        title="Oto galerilerin tahsilat sürecinde güven ve hız beklentisi aynı."
        text="TaşıtPOS, bayi ekiplerinin satış masasından muhasebeye kadar ödeme görünürlüğünü artıran bir deneyim sunar."
      />

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Deneyimler"
            title="Bayi ekiplerinden öne çıkan geri bildirimler."
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

      <section className="section compact-section">
        <div className="container">
          <div className="reference-strip">
            <div>
              <strong>3 ana kazanım</strong>
              <span>Hızlı tahsilat, net takip, kolay mutabakat.</span>
            </div>
            <div>
              <strong>Satış masasına uygun</strong>
              <span>Uzaktan ödeme ve galeri içi işlem akışları aynı panelde.</span>
            </div>
            <div>
              <strong>Operasyon görünürlüğü</strong>
              <span>Şube, kullanıcı ve işlem bazında sade raporlama.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <SectionHeader
            eyebrow="Kullanım Senaryoları"
            title="Galerilerin en çok ihtiyaç duyduğu ödeme akışları."
          />
          <div className="case-grid">
            {caseStudies.map((item) => (
              <article key={item.title}>
                <span>{item.metric}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section image-band">
        <img
          src="/assets/images/tasitpos/dealer-consultation.png"
          alt="Galeri danışmanının müşteriye ödeme onay ekranı göstermesi"
        />
      </section>

      <CTA title="Sizin galeri akışınız için de aynı güvenli ödeme deneyimini kuralım." />
    </SiteFrame>
  );
}
