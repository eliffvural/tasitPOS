import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://tasitpos.com"),
  title: {
    default: "TaşıtPOS | Oto galerilere özel sanal POS",
    template: "%s | TaşıtPOS",
  },
  description:
    "Oto galerileri için güvenli sanal POS, taksitli tahsilat, ödeme linki ve bayi raporlama altyapısı.",
  keywords: [
    "sanal pos",
    "oto galeri ödeme sistemi",
    "taksitli araç satış",
    "online tahsilat",
    "galeri pos",
  ],
  openGraph: {
    title: "TaşıtPOS | Oto galerilere özel sanal POS",
    description:
      "Galeriniz için güvenli tahsilat, hızlı ödeme linki ve taksitli satış altyapısı.",
    url: "/",
    siteName: "TaşıtPOS",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/assets/images/tasitpos/hero-payment.png",
        width: 1600,
        height: 900,
        alt: "Oto galeride dijital ödeme onayı",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaşıtPOS | Oto galerilere özel sanal POS",
    description:
      "Oto galerileri için güvenli sanal POS ve dijital tahsilat deneyimi.",
    images: ["/assets/images/tasitpos/hero-payment.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
