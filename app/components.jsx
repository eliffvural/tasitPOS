"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand, navigation, processSteps, services, stats } from "./site-data";

export function SiteFrame({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <a className="quick-contact" href={brand.phoneHref} aria-label="Hızlı iletişim">
        Hızlı İletişim
      </a>
    </>
  );
}

function Logo() {
  return (
    <Link className="brand" href="/" aria-label={`${brand.name} ana sayfa`}>
      <img
        className="brand-mark"
        src="/assets/images/tasitpos/logo-mark.svg"
        alt=""
        aria-hidden="true"
      />
      <span className="brand-word">
        Taşıt<span>POS</span>
      </span>
    </Link>
  );
}

function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Logo />
        <nav className="desktop-nav" aria-label="Ana navigasyon">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "nav-link active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="portal-link" href={brand.loginUrl} target="_blank" rel="noreferrer">
            Müşteri Girişi
          </a>
          <a className="btn btn-primary btn-small" href={brand.registerUrl} target="_blank" rel="noreferrer">
            Hızlı Başvuru
          </a>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Menüyü aç">☰</summary>
          <div className="mobile-panel">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <a href={brand.loginUrl} target="_blank" rel="noreferrer">
              Müşteri Girişi
            </a>
            <a href={brand.registerUrl} target="_blank" rel="noreferrer">
              Hızlı Başvuru
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>
            Oto galerileri için güvenli sanal POS, taksitli tahsilat ve panel
            tabanlı ödeme operasyonu.
          </p>
        </div>
        <div>
          <h2>Sayfalar</h2>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          <h2>Hizmetler</h2>
          <span>Sanal POS</span>
          <span>Ödeme Linki</span>
          <span>Taksit Yönetimi</span>
          <span>Raporlama</span>
        </div>
        <div>
          <h2>İletişim</h2>
          <a href={brand.phoneHref}>{brand.phone}</a>
          <a href={brand.emailHref}>{brand.email}</a>
          <span>{brand.address}</span>
          <a href={brand.mapUrl} target="_blank" rel="noreferrer">
            Haritada Gör
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 {brand.name}. Tüm hakları saklıdır.</span>
        <span>TCMB lisanslı güvenli ödeme altyapısı</span>
      </div>
    </footer>
  );
}

export function SectionHeader({ eyebrow, title, text, align = "center" }) {
  return (
    <div className={`section-header ${align === "left" ? "left" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <p className="section-lead">{text}</p> : null}
    </div>
  );
}

export function PageIntro({ eyebrow, title, text }) {
  return (
    <section className="page-intro">
      <div className="container page-intro-shell">
        <div className="page-intro-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{text}</p>
          <div className="intro-badges" aria-label="Platform özellikleri">
            <span>TCMB lisanslı altyapı</span>
            <span>Online tahsilat</span>
            <span>Panel raporlama</span>
          </div>
        </div>
        <aside className="intro-visual" aria-label="Oto galeri ödeme deneyimi">
          <img
            src="/assets/images/tasitpos/dealer-consultation.png"
            alt="Oto galeride ödeme danışmanlığı görüşmesi"
          />
          <div className="intro-proof">
            <span>Galeri satış akışına uygun</span>
            <strong>Güvenli tahsilat ve takip</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function Metrics({ compact = false }) {
  return (
    <div className={compact ? "metrics compact" : "metrics"}>
      {stats.map((item, index) => (
        <div className="metric" key={item.label}>
          <small>{String(index + 1).padStart(2, "0")}</small>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ServiceGrid({ detailed = false }) {
  return (
    <div className={detailed ? "service-grid detailed" : "service-grid"}>
      {services.map((service, index) => (
        <article className="service-card" key={service.title}>
          <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
          <h3>{service.title}</h3>
          <p>{service.text}</p>
        </article>
      ))}
    </div>
  );
}

export function ProcessList() {
  return (
    <div className="process-list">
      {processSteps.map((step, index) => (
        <article key={step.title}>
          <span>{index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </article>
      ))}
    </div>
  );
}

export function CTA({ title = "Galeriniz için güvenli tahsilata bugün başlayın." }) {
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">Hızlı Başvuru</p>
          <h2>{title}</h2>
        </div>
        <div className="cta-actions">
          <a className="btn btn-light" href={brand.registerUrl} target="_blank" rel="noreferrer">
            Sanal POS Başvurusu
          </a>
          <Link className="btn btn-outline-light" href="/iletisim">
            İletişime Geç
          </Link>
        </div>
      </div>
    </section>
  );
}
