"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { brand, navigation, processSteps, services, stats } from "./site-data";

const heroSlides = [
  {
    kicker: "Tüm kartlar · şeffaf fiyatlandırma",
    title: "Tüm Kartlar, Tüm Bankalar — Sıfır Sürpriz.",
    text: "Visa, Mastercard ve Troy dahil tüm kartlarla ödeme alın. Şeffaf fiyatlandırma, gizli maliyet yok.",
    image: "/assets/images/tasitpos/hero-payment.png",
    alt: "Oto galeride kartlı ödeme alan danışman",
  },
  {
    kicker: "TCMB lisanslı · güvenli ödeme altyapısı",
    title: "Otomotiv Sektörünün Güvenilir Ödeme Çözümü",
    text: "Bayiniz için özel tasarlanmış sanal POS altyapısı ile tahsilat süreçlerinizi tamamen dijitalleştirin.",
    image: "/assets/images/tasitpos/dealer-consultation.png",
    alt: "Modern oto galeride müşteri görüşmesi",
  },
  {
    kicker: "Hızlı entegrasyon · 7/24 destek",
    title: "Aynı Gün Kurulum, Anında Tahsilat",
    text: "Başvurunuzu tamamlayın, sisteminiz aynı gün devreye girsin. Teknik destek her adımda yanınızda.",
    image: "/assets/images/tasitpos/platform-dashboard.png",
    alt: "Sanal POS ve ödeme paneli ekranları",
  },
];

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
            Müşterine taksit sun, satışını büyüt. Oto galerileri için güvenli
            sanal POS ve hızlı online tahsilat çözümü.
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
          <span>12 Aya Taksit</span>
          <span>Hemen Başla</span>
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

export function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = heroSlides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="home-hero slider-hero">
      {heroSlides.map((item, index) => (
        <img
          key={item.title}
          src={item.image}
          alt=""
          aria-hidden="true"
          className={index === activeSlide ? "hero-image hero-image-active" : "hero-image"}
        />
      ))}
      <div className="hero-overlay" />
      <div className="container hero-slider-shell">
        <div className="hero-slider-copy">
          <div className="hero-badges">
            <span className="hero-live">1000+ aktif galeri</span>
            <span>{slide.kicker}</span>
          </div>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={brand.registerUrl} target="_blank" rel="noreferrer">
              Ücretsiz Kurulum Teklifi Al
            </a>
            <Link className="btn btn-ghost" href="/hizmetlerimiz">
              Nasıl Çalışır?
            </Link>
          </div>
          <p className="hero-phone">
            veya hemen arayın: <a href={brand.phoneHref}>{brand.phone}</a>
            <span>Pzt-Cum 09:00-18:00</span>
          </p>
          <div className="hero-trust">
            <span>SSL Güvenli</span>
            <span>Aynı Gün Kurulum</span>
            <span>Tüm Kartlar Geçerli</span>
          </div>
          <div className="hero-dots" aria-label="Slider kontrolü">
            {heroSlides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`${index + 1}. slaytı göster`}
                aria-current={index === activeSlide}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
        <div className="hero-slide-visual">
          <img src={slide.image} alt={slide.alt} />
        </div>
      </div>
    </section>
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
            <span>12 aya taksit</span>
            <span>Güvenli ödeme linki</span>
          </div>
        </div>
        <aside className="intro-visual" aria-label="Oto galeri ödeme deneyimi">
          <img
            src="/assets/images/tasitpos/dealer-consultation.png"
            alt="Oto galeride ödeme danışmanlığı görüşmesi"
          />
          <div className="intro-proof">
            <span>Galerilere özel sanal POS</span>
            <strong>Müşterine taksit sun</strong>
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

export function CTA({ title = "Müşterine taksit sun, satışını büyüt." }) {
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">Hemen Başla</p>
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
