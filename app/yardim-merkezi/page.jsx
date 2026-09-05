import Link from "next/link";
import { SiteFrame } from "../components";
import "./help.css";

const guideSteps = [
  {
    number: "1", eyebrow: "İŞLEMİ BAŞLATIN", title: "Araç ve müşteri bilgilerini girin",
    text: "Müşterinizle satış şartlarında anlaştıktan sonra galeri panelindeki “Yeni Tahsilat” ekranını açın.",
    items: ["Araç plakasını girin.", "17 haneli şasi ve motor numarasını eksiksiz yazın.", "Marka / model ile müşteri GSM bilgisini ekleyin."],
    note: "Tüm araç bilgileri satış evrakı ve düzenlenecek faturayla birebir uyuşmalıdır.",
  },
  {
    number: "2", eyebrow: "SATIŞI BELGELEYİN", title: "Ruhsat veya noter belgesini yükleyin",
    text: "İşlemin gerçek bir araç satışına ait olduğunu doğrulamak için okunabilir bir satış evrakı yükleyin.",
    items: ["Araç ruhsatı veya noter satış sözleşmesi / satış taslağı kullanılabilir.", "Belge PDF, JPG ya da PNG formatında ve en fazla 5 MB olmalıdır.", "Yüklemeden önce plaka, şasi ve taraf bilgilerinin okunabildiğini kontrol edin."],
    note: "Belge kontrolü, yetkisiz POS kullanımı riskinin azaltılmasına yardımcı olur.",
  },
  {
    number: "3", eyebrow: "TUTARI DOĞRULAYIN", title: "Komisyon ve brüt tutarı kontrol edin",
    text: "Panel, net araç bedeline güncel EPK maliyetini ve platform payını ekleyerek karttan çekilecek brüt tutarı gösterir.",
    items: ["Net araç bedelini girin ve komisyon kırılımını inceleyin.", "Müşteriye gönderilecek güvenli ödeme bağlantısını oluşturun.", "Müşteri kart ve 3D Secure adımlarını ödeme kuruluşunun güvenli alanında tamamlar."],
    note: "Müşteri satış faturası, karttan çekilen brüt tutarla kuruşu kuruşuna eşleşmelidir.",
  },
  {
    number: "4", eyebrow: "HAKEDİŞİ TAKİP EDİN", title: "Net araç bedelini hesabınıza alın",
    text: "Başarılı işlemden sonra ödeme durumu, beklenen transfer tarihi ve net hakediş panelde takip edilir.",
    items: ["Komisyon sonrası net araç bedeli kayıtlı banka hesabınıza aktarılır.", "Planlanan akış ertesi iş günü transferidir; valör banka takvimine bağlıdır.", "Transfer dekontunu ve aylık muhasebe raporunu panelden indirebilirsiniz."],
    note: "Platform payı raporda ayrı gösterilir; işlem özeti brüt, komisyon ve net hakediş ayrımını korur.",
  },
];

const faqs = [
  ["Her işlemde ruhsat veya noter belgesi gerekli mi?", "Evet. Araç tescil belgesi veya noter satış belgesi yüklenmeden ödeme bağlantısı oluşturulamaz."],
  ["Kart bilgileri TaşıtPOS'ta saklanır mı?", "Hayır. Kart verileri TaşıtPOS sunucularına alınmamalı; ödeme kuruluşunun PCI DSS uyumlu güvenli alanında işlenmelidir."],
  ["Komisyon nasıl hesaplanır?", "Mevcut ürün kurgusunda %24,90 EPK maliyeti ve %1,20 platform payı olmak üzere toplam %26,10 net araç bedeline eklenir. Canlı oran sözleşme ve EPK tarifesiyle doğrulanmalıdır."],
  ["Hakediş ne zaman aktarılır?", "Planlanan akış ertesi iş günü transferidir. Kesin saat ve valör, anlaşmalı ödeme kuruluşu ve banka çalışma takvimine bağlıdır."],
  ["Fatura hangi tutardan kesilir?", "Belge kurgusuna göre müşteri faturası karttan çekilen brüt tutarla eşleşmelidir. Vergisel uygulamayı mali müşavirinizle ve güncel mevzuatla doğrulayın."],
  ["İptal ve iade arasındaki fark nedir?", "Gün sonu öncesi işlem iptal (void), sonrasında iade olarak işlenir. Canlı sonuç ve karta yansıma süresi EPK/banka kurallarına bağlıdır."],
  ["Yetersiz bakiye veya banka reddi olursa ne olur?", "İşlem başarısız olarak kaydedilir, hakediş oluşmaz ve panelde bankanın güvenli hata açıklaması gösterilir. Kart bilgileri TaşıtPOS'a gelmez."],
  ["3D Secure ekranı kapatılırsa ne olur?", "İşlem geçici olarak 3D Secure bekleniyor durumunda kalır. Yapılandırılmış süre dolduğunda otomatik EXPIRED olur ve galeri için hakediş oluşturulmaz."],
  ["Belgeler nasıl korunur?", "Canlı AWS kurulumunda evrak bucket'ı dış dünyaya kapalı ve KMS ile şifrelidir. Yetkili kullanıcıya 30 saniyelik, tek kullanımlık imzalı erişim bağlantısı verilir."],
];

export const metadata = { title: "12 Taksitli Araç Satış Rehberi", description: "TaşıtPOS ile güvenli araç tahsilatı, evrak, komisyon, fatura ve hakediş adımları." };

export default function HelpPage() {
  return (
    <SiteFrame>
      <section className="help-hero"><div className="narrow">
        <p className="eyebrow">TAŞITPOS KULLANIM REHBERİ</p>
        <h1>12 taksitli araç satışını 4 adımda tamamlayın</h1>
        <p>Müşterinize taksit sunun, güvenli tahsilat alın ve net hakedişinizi panelden takip edin.</p>
        <div className="help-hero-actions"><Link className="btn btn-primary" href="/giris">Panele giriş yap</Link><a className="help-text-link" href="#rehber">Adımları incele <span aria-hidden="true">↓</span></a></div>
      </div></section>

      <section className="help-content narrow" id="rehber">
        <div className="help-warning"><strong>Başlamadan önce:</strong> Araç bilgilerinizi, satış evrakınızı ve müşterinizin cep telefonu numarasını hazır bulundurun. Kart bilgilerini siz almayın; müşteri bu bilgileri yalnızca ödeme kuruluşunun güvenli sayfasına girmelidir.</div>

        <div className="help-guide">{guideSteps.map((step) => (
          <article className="help-step" key={step.number}>
            <div className="help-step-number" aria-hidden="true">{step.number}</div>
            <div className="help-step-body"><p className="help-step-eyebrow">{step.eyebrow}</p><h2>{step.title}</h2><p>{step.text}</p><ul>{step.items.map((item) => <li key={item}>{item}</li>)}</ul><div className="help-note"><span aria-hidden="true">✓</span><p>{step.note}</p></div></div>
          </article>
        ))}</div>

        <section className="help-example" aria-labelledby="example-title">
          <div><p className="help-step-eyebrow">ÖRNEK HESAPLAMA</p><h2 id="example-title">1.000.000 TL net araç bedeli</h2><p>Mevcut demo oranlarıyla toplam %26,10 hizmet maliyeti net bedele eklenir.</p></div>
          <div className="help-calculation"><p><span>Net araç bedeli</span><strong>1.000.000 TL</strong></p><p><span>EPK payı · %24,90</span><strong>249.000 TL</strong></p><p><span>Platform payı · %1,20</span><strong>12.000 TL</strong></p><p className="help-calculation-total"><span>Karttan çekilecek brüt</span><strong>1.261.000 TL</strong></p></div>
          <small>Oranlar örnek niteliğindedir. İşlem öncesinde panelde gösterilen güncel oranı ve sözleşme koşullarını esas alın.</small>
        </section>

        <section className="help-prohibited" aria-labelledby="prohibited-title">
          <div className="help-prohibited-heading"><span aria-hidden="true">!</span><div><p className="help-step-eyebrow">KIRMIZI ÇİZGİLER</p><h2 id="prohibited-title">Yapılmaması gerekenler</h2></div></div>
          <ul><li><strong>Araç satışı dışında kullanmayın.</strong> Nakit ihtiyacı, borç kapatma veya başka bir mal ve hizmet satışı için tahsilat oluşturmayın.</li><li><strong>Panelinizi üçüncü kişilere kullandırmayın.</strong> Başka galeriler veya yetkisiz kişiler adına işlem yapmayın.</li><li><strong>Eksik ya da tutarsız belge yüklemeyin.</strong> Araç, tahsilat ve fatura bilgilerinin tamamı birbiriyle eşleşmelidir.</li><li><strong>Brüt tutardan düşük fatura kesmeyin.</strong> İşlemin fatura ve vergi uygulamasını mali müşavirinizle doğrulayın.</li></ul>
        </section>

        <section className="help-faq" aria-labelledby="faq-title"><p className="help-step-eyebrow">SIK SORULAN SORULAR</p><h2 id="faq-title">Aklınıza takılanlar</h2><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
        <div className="help-legal"><strong>Bilgilendirme:</strong> Bu rehber ürün akışını açıklar; hukuki, vergisel veya mali müşavirlik görüşü değildir. Canlı koşullar EPK sözleşmesi, banka kuralları ve güncel mevzuatla doğrulanmalıdır.</div>
      </section>
    </SiteFrame>
  );
}
