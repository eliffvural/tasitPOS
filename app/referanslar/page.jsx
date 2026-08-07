import { CTA, PageIntro, SectionHeader, SiteFrame } from "../components";
import { caseStudies, testimonials } from "../site-data";

export const metadata = {
  title: "Referanslar",
  description:
    "TaşıtPOS'a güvenen oto galerilerle büyüyoruz. Sanal POS ve ödeme dijitalleşme deneyimlerini keşfedin.",
};

export default function ReferencesPage() {
  return (
    <SiteFrame>
      <PageIntro
        eyebrow="Referanslar"
        title="Güvenle büyüdüğümüz iş ortaklarımız."
        text="TaşıtPOS ile kredi kartına taksit sunan ve tahsilat sürecini dijitalleştiren oto galerilerle büyüyoruz."
      />

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Deneyimler"
            title="Müşterilerimiz ne diyor?"
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
              <span>Karta taksit, online tahsilat, hızlı POS başvurusu.</span>
            </div>
            <div>
              <strong>Satış masasına uygun</strong>
              <span>Taksit sunulur, ödeme linkiyle tahsilat alınır.</span>
            </div>
            <div>
              <strong>Vade farkı netliği</strong>
              <span>Taksit farkı müşteriye yansır, satış korunur.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <SectionHeader
            eyebrow="Kullanım Senaryoları"
            title="Başarı hikayelerinin ortak noktası: güvenli tahsilat."
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

      <CTA title="Siz de güvenle büyüyen galeriler arasına katılın." />
    </SiteFrame>
  );
}
