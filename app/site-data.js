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
  loginUrl: "/giris",
  registerUrl: "/basvuru",
};

export const regulatedInfrastructureText =
  "TaşıtPOS, TCMB lisanslı elektronik para ve ödeme kuruluşlarının güvenli ödeme altyapısıyla çalışmaktadır.";

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
  { value: "TCMB", label: "Lisanslı kuruluş altyapısı" },
];

export const services = [
  {
    title: "Sanal POS Entegrasyonu",
    text: `Müşterinize WhatsApp veya e-posta üzerinden ödeme linki gönderin. Kredi kartı ile güvenli bir şekilde ödeme yapsın. ${regulatedInfrastructureText}`,
    image: "/assets/images/tasitpos/service-pos.png",
    icon: "card",
    features: [
      "Fiziksel cihaz gerektirmez",
      "Tek link ile ödeme talebi",
      "Tüm banka kartları geçerli",
      "3D Secure ile güvenli işlem",
      "Anlık ödeme bildirimi",
    ],
  },
  {
    title: "Taksitli Satış Altyapısı",
    text: "12 aya kadar eşit taksit imkânıyla müşteri portföyünüzü genişletin. Taksit seçeneklerini kolayca yönetin ve araç satışlarınızı artırın.",
    image: "/assets/images/tasitpos/service-installments.png",
    icon: "bolt",
    features: [
      "3-12 ay esnek taksit",
      "Eşit taksit planları",
      "Otomatik hesaplama",
      "Kampanya yönetimi",
      "Vade farkı takibi",
    ],
  },
  {
    title: "Raporlama & Analitik",
    text: "Tüm işlemlerinizi tek ekrandan takip edin. Otomatik ödeme hatırlatmaları ile gecikmeleri minimize edin. Detaylı raporları indirip muhasebenize aktarın.",
    image: "/assets/images/tasitpos/service-analytics.png",
    icon: "chart",
    features: [
      "Gerçek zamanlı dashboard",
      "İşlem geçmişi",
      "Ödeme hatırlatma sistemi",
      "Excel/PDF export",
      "Aylık mali özet",
    ],
  },
  {
    title: "Sistem Entegrasyonu",
    text: "Mevcut galeri yönetim yazılımınıza entegre olun. Kapsamlı API dokümantasyonu ve test ortamı ile entegrasyonu kolayca tamamlayın.",
    image: "/assets/images/tasitpos/service-pos.png",
    icon: "link",
    features: [
      "Galeri yazılımlarıyla uyumlu",
      "API erişimi",
      "Webhook desteği",
      "Özelleştirilebilir akış",
      "Test ortamı",
    ],
  },
  {
    title: "Güvenlik & Uyumluluk",
    text: `PCI DSS uyumlu güvenli veri işleme. ${regulatedInfrastructureText}`,
    image: "/assets/images/tasitpos/service-support.png",
    icon: "shield",
    features: [
      "TCMB lisanslı kuruluş altyapısı",
      "PCI DSS uyumlu",
      "SSL şifreleme",
      "KVKK uyumlu veri işleme",
      "Fraud koruma sistemi",
    ],
  },
  {
    title: "7/24 Teknik Destek",
    text: "Uzman teknik ekibimiz her an yanınızda. Kurulumdan başlayarak tüm süreçte destek alın. Ortalama 2 saat içinde sorun çözüm garantisi.",
    image: "/assets/images/tasitpos/service-support.png",
    icon: "support",
    features: [
      "Telefon desteği",
      "E-posta desteği",
      "Uzaktan bağlantı",
      "Hızlı yanıt süresi",
      "Eğitim ve onboarding",
    ],
  },
];

export const processSteps = [
  {
    title: "Başvuru",
    text: "İletişim formunu doldurun veya arayın",
  },
  {
    title: "Kurulum",
    text: "Aynı gün sistem aktivasyonu",
  },
  {
    title: "Entegrasyon",
    text: "Galerinize özel yapılandırma",
  },
  {
    title: "Kullanım",
    text: "Hemen ödeme almaya başlayın",
  },
];

export const testimonials = [
  {
    quote:
      "TaşıtPOS ile tahsilat süreçlerimiz tamamen değişti. Artık müşterilerimize telefon ile ödeme linki gönderip anında tahsilat alabiliyoruz. Kurulum gerçekten tek günde tamamlandı.",
    name: "Mehmet Yılmaz",
    role: "Sahibi · Ankara Premium Otomotiv",
    initials: "MY",
  },
  {
    quote:
      "Güvenli ödeme altyapısı sayesinde taksitli satışlarımız arttı. Panel üzerinden anlık işlem durumunu görebilmek günlük akışımızı çok daha verimli hale getirdi.",
    name: "Ahmet Kaya",
    role: "Genel Müdür · İzmir Araç Merkezi",
    initials: "AK",
  },
  {
    quote:
      "Yıllardır fiziksel POS ile uğraşıyorduk. TaşıtPOS sayesinde her yerden, her cihazdan ödeme alıyor; müşteri memnuniyetimizi de artırıyoruz.",
    name: "Fatma Demir",
    role: "İşletme Ortağı · İstanbul Galerisi",
    initials: "FD",
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
