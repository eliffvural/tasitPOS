import { CTA, PageIntro, SectionHeader, SiteFrame } from "../components";
import { caseStudies, testimonials } from "../site-data";

export const metadata = {
  title: "Referanslar",
  description:
    "TaşıtPOS ile çalışan oto galerilerin sanal POS, kart taksit ve online tahsilat deneyimleri.",
};

export default function ReferencesPage() {
  return (
    <SiteFrame>
      <PageIntro
        eyebrow="Referanslar"
        title="Galerilerin ortak hedefi: müşteriye taksit sunup satışı büyütmek."
        text="Kredi kartına taksit ve güvenli sanal POS ile tahsilat süreci daha pratik ilerler."
      />

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Deneyimler"
            title="Taksit sunan galeri satışta daha güçlü konuşur."
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
            title="Galerilerin en çok kullandığı POS akışları."
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

      <CTA title="Müşterine taksit sunmak için hemen başla." />
    </SiteFrame>
  );
}
