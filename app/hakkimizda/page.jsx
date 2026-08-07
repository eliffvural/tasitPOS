import { SiteFrame } from "../components";

export const metadata = {
  title: "Hakkımızda",
  description:
    "TaşıtPOS, oto galeriler için TCMB lisanslı güvenli ödeme altyapısıyla sanal POS ve taksit çözümleri sunar.",
};

const values = [
  {
    title: "Şeffaflık",
    text: "Her işlemde, her raporlamada ve her müşteri ilişkisinde tam şeffaflık. Gizli maliyet yok, belirsiz süreç yok.",
    image: "/assets/images/tasitpos/about-value-transparency.png",
    icon: "✓",
  },
  {
    title: "Hız",
    text: "Aynı gün kurulum garantisi ve 2 saat içinde destek yanıt süresi. Galeriniz tek bir günü bile kaybetmez.",
    image: "/assets/images/tasitpos/about-value-speed.png",
    icon: "↗",
  },
  {
    title: "Güvenilirlik",
    text: "%99.9 uptime ve TCMB lisanslı altyapıyla işlemleriniz her koşulda güvende. PCI DSS uyumlu veri işleme.",
    image: "/assets/images/tasitpos/about-value-trust.png",
    icon: "◎",
  },
  {
    title: "Ortaklık",
    text: "Müşteri değil, iş ortağı. Galerinizin büyümesini kendi büyümemiz olarak görüyor, birlikte ilerleriz.",
    image: "/assets/images/tasitpos/about-value-partnership.png",
    icon: "↔",
  },
];

const reasons = [
  "TCMB lisanslı güvenli ödeme altyapısıyla %99.9 uptime",
  "Fiziksel cihaz gerektirmeden sanal POS ve link ile ödeme",
  "12 aya kadar esnek taksit yönetimi",
  "Aynı gün kurulum — sıfır teknik yük",
  "Türkiye geneli 7/24 uzman teknik destek",
];

const aboutStats = [
  { value: "1000+", label: "Aktif galeri", note: "Türkiye genelinde", icon: "01" },
  { value: "50.000+", label: "İşlem hacmi", note: "Aylık ortalama", icon: "02" },
  { value: "%99.9", label: "Kesintisiz çalışma", note: "Yıllık uptime", icon: "03" },
  { value: "12+", label: "Yıllık deneyim", note: "Sektörde", icon: "04" },
];

export default function AboutPage() {
  return (
    <SiteFrame>
      <section className="about-hero">
        <div className="container">
          <h1>Hakkımızda</h1>
          <p>
            Türkiye'ye uzanan fintech vizyonuyla oto galerilerin ödeme süreçlerini
            kökten dönüştürüyoruz.
          </p>
        </div>
      </section>

      <section className="section about-story-section">
        <div className="container about-story-grid">
          <div>
            <img
              className="about-story-image"
              src="/assets/images/tasitpos/about-team.png"
              alt="TaşıtPOS ekibinin oto galeri ödeme çözümleri toplantısı"
            />
            <p className="eyebrow">Hikayemiz</p>
            <h2>Sektörün Sesini Dinledik, Çözümü İnşa Ettik</h2>
            <p>
              TaşıtPOS, 2025 yılında Türkiye genelinde oto galerilere özel sanal
              POS ve taksitli tahsilat çözümleri sunmak için kuruldu. Galerilerin
              satış masasında yaşadığı ödeme, kapora ve taksit süreçlerini
              sadeleştirmek için yola çıktık.
            </p>
            <p>
              Amacımız yalnızca bir yazılım ürünü sunmak değil; oto galericiliğin
              ritmini bilen, sahada test edilmiş ve hızlı devreye alınan güvenli
              bir ödeme altyapısı sağlamaktır.
            </p>
          </div>

          <div className="about-mission-stack">
            <article>
              <span>◎</span>
              <h3>Misyonumuz</h3>
              <p>
                Türkiye'nin otomotiv galerileri için en güvenilir sanal POS
                çözümünü sunmak.
              </p>
            </article>
            <article className="is-dark">
              <span>◉</span>
              <h3>Vizyonumuz</h3>
              <p>Otomotiv fintech alanının öncü markası olmak.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="container">
          <div className="about-section-heading">
            <p className="eyebrow">İlkelerimiz</p>
            <h2>Değerlerimiz</h2>
            <p>Her kararımızın ve her ilişkimizin arkasındaki temel ilkeler.</p>
          </div>
          <div className="about-value-grid">
            {values.map((item) => (
              <article key={item.title}>
                <img src={item.image} alt={`${item.title} değeri`} />
                <span>{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-reasons-section">
        <div className="container about-reasons-grid">
          <div>
            <p className="eyebrow">Neden TaşıtPOS?</p>
            <h2>Sektörü Bilen Bir Ortağın Farkını Yaşayın</h2>
            <p>
              TaşıtPOS, yalnızca bir yazılım ürünü değil; oto galericiliğin
              dinamiklerini bilen, sahada test edilmiş bir iş ortağıdır.
              Platformumuz galeri süreçlerine uyum sağlar; galericiler platforma
              uyum sağlamak zorunda kalmaz.
            </p>
            <ul>
              {reasons.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <figure className="about-quote-card">
            <img
              src="/assets/images/tasitpos/about-quote.png"
              alt="Oto galeride TaşıtPOS ödeme altyapısı"
            />
            <figcaption>
              <blockquote>
                “Oto galericiliğin kendine özgü ritmi ve talepleri vardır.
                TaşıtPOS, bu ritmi anlayan ve ona göre tasarlanmış fintech
                altyapısıdır. Her özelliğimiz, gerçek galericilerin gerçek
                ihtiyaçlarından doğdu.”
              </blockquote>
              <div>
                <span>TP</span>
                <strong>TaşıtPOS Kurucu Ekibi</strong>
                <small>Türkiye, 2025</small>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="about-stats-section">
        <div className="container about-stat-grid">
          {aboutStats.map((item) => (
            <article key={item.label}>
              <span>{item.icon}</span>
              <strong>{item.value}</strong>
              <h3>{item.label}</h3>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}
