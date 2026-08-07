import { CTA, PageIntro, ProcessList, SectionHeader, ServiceGrid, SiteFrame } from "../components";

export const metadata = {
  title: "Hizmetlerimiz",
  description:
    "Sanal POS, taksitli satış, ödeme linki, raporlama ve bayi destek hizmetleri.",
};

export default function ServicesPage() {
  return (
    <SiteFrame>
      <PageIntro
        eyebrow="Hizmetlerimiz"
        title="Sanal POS'tan mutabakata kadar galeri ödeme operasyonu."
        text="Araç satışında ödeme almayı, ödeme durumunu takip etmeyi ve tahsilat performansını raporlamayı tek çatı altında toplar."
      />

      <section className="section">
        <div className="container">
          <ServiceGrid detailed />
        </div>
      </section>

      <section className="section soft compact-section">
        <div className="container">
          <SectionHeader
            eyebrow="Modüller"
            title="Satıştan muhasebeye uzanan ödeme operasyonu."
          />
          <div className="module-grid">
            <article>
              <strong>Satış Ekibi</strong>
              <h3>Ödeme linki ve taksit seçeneği</h3>
              <p>Müşteri görüşmesi sırasında anlaşılır seçenekler sunulur ve işlem başlatılır.</p>
            </article>
            <article>
              <strong>Muhasebe</strong>
              <h3>Mutabakat ve işlem geçmişi</h3>
              <p>Başarılı, bekleyen veya iptal edilen tahsilatlar düzenli biçimde takip edilir.</p>
            </article>
            <article>
              <strong>Yönetim</strong>
              <h3>Şube ve kullanıcı kontrolü</h3>
              <p>Yetkiler, limitler ve işlem görünürlüğü daha yönetilebilir hale gelir.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container dark-grid">
          <SectionHeader
            align="left"
            eyebrow="Nasıl işler?"
            title="Bayi ekibiniz için öğrenmesi kolay bir ödeme akışı."
            text="İşlem adımları, satış anındaki hız ve işlem sonrası takip ihtiyacına göre tasarlandı."
          />
          <ProcessList />
        </div>
      </section>

      <section className="section">
        <div className="container split-layout">
          <div className="copy-stack">
            <SectionHeader
              align="left"
              eyebrow="Panel"
              title="Tahsilat performansı ve bekleyen işlemler tek ekranda."
            />
            <p>
              Günlük işlem adetleri, başarılı tahsilatlar, bekleyen ödemeler ve
              mutabakat bilgileri ekiplerin hızlı karar alabileceği biçimde
              sunulur.
            </p>
            <ul className="check-list">
              <li>İşlem bazlı durum takibi</li>
              <li>Taksit ve kalan bakiye görünürlüğü</li>
              <li>Şube ve kullanıcı bazlı operasyon kontrolü</li>
            </ul>
          </div>
          <img
            src="/assets/images/tasitpos/platform-dashboard.png"
            alt="TaşıtPOS ödeme paneli"
            className="feature-image"
          />
        </div>
      </section>

      <CTA />
    </SiteFrame>
  );
}
