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
        title="Oto galeri satışını dijital ödeme güveniyle buluşturuyoruz."
        text="TaşıtPOS, araç satışında tahsilatın daha hızlı, izlenebilir ve güvenli ilerlemesi için tasarlanmış bir sanal POS ve ödeme operasyonu platformudur."
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
              title="Galerilerin gerçek satış akışına göre sadeleştirilmiş finans teknolojisi."
            />
            <p>
              Müşteri uzakta olabilir, ödeme kapora ile başlayabilir veya satış
              taksit seçenekleriyle tamamlanabilir. Platform bu senaryoların
              her birinde bayi ekibine anlaşılır bir işlem akışı sunar.
            </p>
            <p>
              Öncelik güven, hız ve raporlanabilirliktir. Her işlem satış,
              muhasebe ve yönetim ekiplerinin aynı bilgiyi görmesini sağlayacak
              şekilde düzenlenir.
            </p>
          </div>
        </div>
      </section>

      <section className="section soft compact-section">
        <div className="container">
          <SectionHeader
            eyebrow="Çalışma Prensibi"
            title="Teknik altyapı kadar bayi ekibinin günlük ritmini de önemsiyoruz."
          />
          <div className="value-grid">
            <article>
              <span>01</span>
              <h3>Satış anına uygun</h3>
              <p>Kapora, peşinat, taksit ve kalan bakiye gibi araç satışına özgü adımlar netleştirilir.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Şeffaf takip</h3>
              <p>İşlem durumu, kullanıcı hareketleri ve mutabakat bilgisi yönetilebilir bir düzende sunulur.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Güvenli büyüme</h3>
              <p>Yeni şube, yeni kullanıcı ve farklı ödeme senaryoları için ölçeklenebilir bir temel kurulur.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Güven"
            title="Ödeme altyapısı kadar operasyon disiplini de önemlidir."
            text="Bu yüzden TaşıtPOS sadece ödeme almakla kalmaz; başvuru, kullanıcı rolleri, işlem takibi ve destek süreçlerini de galeriler için netleştirir."
          />
          <Metrics compact />
        </div>
      </section>

      <CTA title="Galerinizin tahsilat sürecini daha güvenli ve izlenebilir hale getirelim." />
    </SiteFrame>
  );
}
