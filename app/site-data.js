export const brand = {
  name: "TaşıtPOS",
  phone: "+90 534 213 71 16",
  phoneHref: "tel:+905342137116",
  email: "info@gemutechnology.com",
  emailHref: "mailto:info@gemutechnology.com",
  address:
    "Muradiye Mah. Celal Bayar Üniversitesi Kampüsü Küme Evler Tekno Kent No: 22 Yunusemre/Manisa",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Muradiye%20Mah.%20Celal%20Bayar%20%C3%9Cniversitesi%20Kamp%C3%BCs%C3%BC%20K%C3%BCme%20Evler%20Tekno%20Kent%20No%3A%2022%20Yunusemre%2FManisa",
  mapEmbedUrl:
    "https://maps.google.com/maps?width=100%25&height=600&hl=tr&q=Muradiye%20Mah.%20Celal%20Bayar%20%C3%9Cniversitesi%20Kamp%C3%BCs%C3%BC%20K%C3%BCme%20Evler%20Tekno%20Kent%20No%3A%2022%20Yunusemre%2FManisa&t=&z=15&ie=UTF8&iwloc=B&output=embed",
  loginUrl: "https://escrow.tasital.com/web/login",
  registerUrl: "https://escrow.tasital.com/escrow/broker/register",
};

export const navigation = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/hizmetlerimiz", label: "Hizmetlerimiz" },
  { href: "/referanslar", label: "Referanslar" },
  { href: "/iletisim", label: "İletişim" },
];

export const stats = [
  { value: "1000+", label: "Aktif galeri hedefi" },
  { value: "12 aya", label: "Esnek taksit imkanı" },
  { value: "Aynı gün", label: "Kurulum ve başvuru desteği" },
  { value: "TCMB", label: "Lisanslı güvenli altyapı" },
];

export const services = [
  {
    title: "Sanal POS Entegrasyonu",
    text: "Fiziksel POS cihazına gerek kalmadan kredi kartı ile güvenli tahsilat. Tek link ile müşterinize ödeme gönderin.",
    image: "/assets/images/tasitpos/service-pos.png",
    icon: "card",
  },
  {
    title: "Taksitli Satış Altyapısı",
    text: "12 aya kadar eşit taksit imkanı ile araç satışlarınızı artırın. Tüm bankaların kartları geçerlidir.",
    image: "/assets/images/tasitpos/service-installments.png",
    icon: "bolt",
  },
  {
    title: "Raporlama & Analitik",
    text: "Gerçek zamanlı işlem takibi, ödeme hatırlatma sistemi ve kapsamlı mali raporlar ile işinizi kontrol altında tutun.",
    image: "/assets/images/tasitpos/service-analytics.png",
    icon: "chart",
  },
  {
    title: "7/24 Teknik Destek",
    text: "Uzman ekibimiz her an yanınızda. Telefon, e-posta ve uzaktan destek ile sorunlarınızı anında çözüyoruz.",
    image: "/assets/images/tasitpos/service-support.png",
    icon: "support",
  },
];

export const processSteps = [
  {
    title: "Başvurunuzu alın",
    text: "Galeri bilgilerinizi paylaşın, sanal POS başvuru sürecinizi başlatalım.",
  },
  {
    title: "Kurulumu tamamlayın",
    text: "Ödeme altyapınız hazırlanır, taksit ve ödeme linki seçenekleri açılır.",
  },
  {
    title: "Tahsilata başlayın",
    text: "Müşterinize taksit sunun, ödeme linki gönderin ve güvenli tahsilat alın.",
  },
];

export const testimonials = [
  {
    quote:
      "Müşteriye taksit seçeneğini net sununca satış konuşması daha hızlı kapanıyor.",
    name: "Mehmet Yılmaz",
    role: "Ankara Premium Otomotiv",
  },
  {
    quote:
      "Kapora ve araç bedeli için ödeme linki göndermek günlük satış akışımızı rahatlattı.",
    name: "Ahmet Kaya",
    role: "İzmir Araç Merkezi",
  },
  {
    quote:
      "Sanal POS anlaşmasıyla müşteriye kartla ödeme alternatifi sunmak elimizi güçlendirdi.",
    name: "Fatma Demir",
    role: "İstanbul Galerisi",
  },
];

export const caseStudies = [
  {
    title: "Müşterine taksit sun",
    metric: "12 aya kadar",
    text: "Araç satışında kredi kartına taksit alternatifiyle müşteri kararını kolaylaştır.",
  },
  {
    title: "Tahsilatı online al",
    metric: "Ödeme linki",
    text: "Kapora, peşinat veya kalan araç bedeli için müşteriye güvenli ödeme linki gönder.",
  },
  {
    title: "Vade farkını yansıt",
    metric: "Net satış",
    text: "Taksitli ödemede oluşan vade farkını müşteriye yansıtarak satışını koru.",
  },
];
