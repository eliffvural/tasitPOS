# TaşıtPOS Website

Oto galerilere özel sanal POS, taksitli tahsilat ve ödeme operasyonu için hazırlanmış multipage Next.js sitesi.

## Sayfalar

- Ana Sayfa: `/`
- Hakkımızda: `/hakkimizda`
- Hizmetlerimiz: `/hizmetlerimiz`
- Referanslar: `/referanslar`
- İletişim: `/iletisim`
- Galeri paneli (demo): `/panel`
- Yardım merkezi: `/yardim-merkezi`

## Belge gereksinimlerinden uygulanan akışlar

- Plaka, 17 haneli şasi, motor, marka/model, telefon ve net tutar doğrulaması
- Her tahsilatta zorunlu ruhsat/noter belgesi (PDF/JPG/PNG, en fazla 5 MB)
- %24,90 EPK + %1,20 platform payı ile şeffaf brüt/net hesap özeti
- Hakediş KPI'ları, işlem tablosu, durum ve eksik fatura uyarıları
- Tam/kısmi iade API taslağı ve imza doğrulaması zorunlu EPK webhook'u
- Muhasebe CSV dışa aktarımı ve yardım merkezi

Panel geliştirme ortamında güvenli yerel adaptörlerle çalışır: evrakı özel
`.data` alanına ve işlemi kalıcı JSON kaydına yazar, demo EPK bağlantısı üretir
ve SMS gönderimini kaydeder. Kart bilgileri uygulama tarafından alınmaz veya
saklanmaz; gerçek para hareketi başlatılmaz.

## API taslakları

- `POST /api/transactions/create-link`
- `POST /api/transactions/refund`
- `POST /api/webhooks/epk-payment-callback`
- `POST /webhooks/epk-payment-callback` (EPK için dış callback adresi)
- `GET /payouts/summary` (dinamik hakediş KPI özeti)
- `GET /payouts/transactions?page=1&limit=10` (sayfalı hakediş/dağıtım kayıtları)
- `GET /api/payouts/summary` ve `GET /api/payouts/transactions` (panel karşılıkları)
- `GET /accounting/monthly-report?year=YYYY&month=MM` (aylık muhasebe ve fatura mutabakatı)
- `POST /accounting/monthly-report` (müşteri satış faturası eşleştirme)
- `GET /payouts/transactions/:transactionId/receipt` (yalnızca ödenmiş hakediş dekontu)
- `GET /api/events` (panel anlık ödeme bildirim akışı)
- `GET|POST /api/demo-payments/:transactionId` (yalnızca mock EPK hata/3DS senaryoları)
- `GET /api/documents/:transactionId/access` (30 saniyelik tek kullanımlık evrak erişimi)

Webhook, `EPK_WEBHOOK_SECRET` tanımlanmadan tüm çağrıları güvenli biçimde
reddeder. Canlıya geçişte demo Bearer belirteci gerçek JWT doğrulamasıyla,
tarayıcıdaki örnek veriler de PostgreSQL tabanlı yetkilendirilmiş kayıtlarla
değiştirilmelidir.

Geliştirme varsayımları `AUTH_MODE=mock`, `EPK_MODE=mock`, `SMS_MODE=mock`
ve `DOCUMENT_STORAGE_MODE=local` şeklindedir. Canlı kullanımda bunlar sırasıyla
`jwt`, `live`, `live` ve `s3` yapılmalı; ilgili gizli anahtarlar ile
`DATABASE_URL` tanımlanmalıdır. Yerel evraklar `0600` dosya izniyle tutulur ve
`.data` dizini Git'e alınmaz.

Tutarlar ve komisyonlar sabit örnek JSON'dan okunmaz. Net bedel kullanıcı
girdisinden; EPK ve platform oranları `EPK_COMMISSION_RATE` ile
`PLATFORM_COMMISSION_RATE` yapılandırmasından hesaplanır. Hakediş kartları,
sayfalı işlem tablosu, tarih/dönem ve fatura uyarıları yetkilendirilen galerinin
kalıcı işlem kayıtlarından her istekte yeniden üretilir. Banka adı ve IBAN,
isteğe bağlı `PAYOUT_BANK_NAME` ile `PAYOUT_IBAN` ayarlarından gelir; IBAN API
yanıtında maskelenir ve yapılandırma yoksa uydurma banka bilgisi gösterilmez.

Muhasebe ekranında başarılı dönem işlemleri raporlanır; müşteri satış faturası,
EPK komisyon belgesi, TaşıtPOS hizmet faturası ve banka dekontu birbirinden ayrı
durumlarla izlenir. Eksik müşteri faturaları kırmızı uyarıyla gösterilir. Galeri
fatura numarasını işlemle eşleştirebilir; `ACCOUNTANT` rolü aylık raporları ve
belgeleri okuyabilir ancak tahsilat, iade veya fatura değişikliği yapamaz. CSV
çıktısı UTF-8 BOM ve noktalı virgül ayracıyla Excel/Luca/Zirve aktarımına uygun
üretilir.

Webhook HMAC-SHA256 imzasını doğrular; kayıtlı EPK işlem numarası, brüt tutar,
12 taksit ve zaman damgası eşleşmeden işlemi başarılı saymaz. Başarılı bildirim
işlemi idempotent biçimde günceller, toplamı brüt tutara eşit split-payment
kaydını hazırlar ve panelin sunucu-gönderimli olay akışına anlık bildirim yollar.

İptal/iade servisi işlem sahipliğini, durumunu ve kalan iade edilebilir brüt
tutarı doğrular. Aynı gün cut-off öncesinde `VOID`, sonrasında `REFUND` çağrısı
yapar. İkinci kullanıcı onayı ile `Idempotency-Key` zorunludur. Her sonuç UUID,
EPK referansı, dinamik tutar, FULL/PARTIAL tipi, neden ve zaman damgasıyla ayrı
`tasitpos_refund_logs` kaydına yazılır.

Test senaryolarında eksik evrak `ERR_DOCUMENT_REQUIRED`, geçersiz şasi
`ERR_INVALID_CHASSIS`, EPK `51` cevabı `INSUFFICIENT_FUNDS` olarak ele alınır.
3D Secure iptal/zaman aşımı önce `PENDING_3DS`, yapılandırılmış süre sonunda
`EXPIRED` olur; bu iki durumda da hakediş üretilmez. Demo ödeme sayfası kart
alanı içermez ve yalnızca bu durum geçişlerini simüle eder.

AWS üretim güvenlik temeli [infra/aws](./infra/aws) altında bulunur: TLS 1.3
ALB, AWS WAF yönetilen kuralları, public/private subnetler, NAT çıkışı, private
Multi-AZ RDS PostgreSQL, KMS şifreli ve public erişimi kapalı S3, CloudTrail,
GuardDuty ve SNS alarmı. Terraform dosyaları kendiliğinden uygulanmaz; canlı
AWS hesabında plan/maliyet incelemesinden sonra dağıtılmalıdır.

## Çalıştırma

```bash
npm run dev
```

Production build:

```bash
npm run build
```
