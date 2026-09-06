"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendToBrandMail } from "./mail";
import { brand } from "./site-data";

const companyTypes = [
  {
    value: "sahis",
    label: "Şahıs Şirketi",
    helper: "TCKN veya VKN ile bireysel işletme kaydı başlatılır.",
  },
  {
    value: "sermaye",
    label: "Limited (LTD) veya Anonim Şirket (A.Ş.)",
    helper: "Şirket VKN bilgisiyle kurumsal galeri kaydı başlatılır.",
  },
];

const cityOptions = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Amasya",
  "Ankara",
  "Antalya",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Isparta",
  "Mersin",
  "İstanbul",
  "İzmir",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Kahramanmaraş",
  "Mardin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Şanlıurfa",
  "Uşak",
  "Van",
  "Yozgat",
  "Zonguldak",
  "Aksaray",
  "Bayburt",
  "Karaman",
  "Kırıkkale",
  "Batman",
  "Şırnak",
  "Bartın",
  "Ardahan",
  "Iğdır",
  "Yalova",
  "Karabük",
  "Kilis",
  "Osmaniye",
  "Düzce",
];

const bankCodeMap = {
  "00010": "Türkiye Cumhuriyeti Ziraat Bankası A.Ş.",
  "00012": "Türkiye Halk Bankası A.Ş.",
  "00015": "Türkiye Vakıflar Bankası T.A.O.",
  "00032": "Türk Ekonomi Bankası A.Ş.",
  "00046": "Akbank T.A.Ş.",
  "00059": "Şekerbank T.A.Ş.",
  "00061": "Türkiye İş Bankası A.Ş.",
  "00062": "Türkiye Garanti Bankası A.Ş.",
  "00064": "Türkiye İş Bankası A.Ş.",
  "00067": "Yapı ve Kredi Bankası A.Ş.",
  "00099": "ING Bank A.Ş.",
  "00103": "Fibabanka A.Ş.",
  "00111": "QNB Finansbank A.Ş.",
  "00123": "HSBC Bank A.Ş.",
  "00124": "Alternatifbank A.Ş.",
  "00125": "Burgan Bank A.Ş.",
  "00134": "DenizBank A.Ş.",
  "00135": "Anadolubank A.Ş.",
  "00143": "Aktif Yatırım Bankası A.Ş.",
  "00146": "Odea Bank A.Ş.",
  "00203": "Albaraka Türk Katılım Bankası A.Ş.",
  "00205": "Kuveyt Türk Katılım Bankası A.Ş.",
  "00206": "Türkiye Finans Katılım Bankası A.Ş.",
  "00209": "Ziraat Katılım Bankası A.Ş.",
  "00210": "Vakıf Katılım Bankası A.Ş.",
  "00211": "Türkiye Emlak Katılım Bankası A.Ş.",
  "00212": "Hayat Finans Katılım Bankası A.Ş.",
};

const maxDocumentSize = 5 * 1024 * 1024;
const acceptedDocumentTypes = ["application/pdf", "image/jpeg"];
const acceptedDocumentExtensions = [".pdf", ".jpg", ".jpeg"];

const documentUploadFields = [
  {
    id: "taxPlate",
    label: "Vergi Levhası",
    helper: "Son yıla ait güncel vergi levhası.",
    required: true,
  },
  {
    id: "signatureDocument",
    label: "İmza Sirküleri veya İmza Beyannamesi",
    helper: "Şirket imza yetkilisini gösteren resmi belge.",
    required: true,
  },
  {
    id: "tradeRegistry",
    label: "Ticaret Sicil Gazetesi",
    helper: "Şahıs şirketlerinde zorunlu değildir.",
    required: true,
    optionalForCompanyType: "sahis",
  },
  {
    id: "galleryPermit",
    label: "Oto Galeri Yetki Belgesi",
    helper: "İkinci El Motorlu Kara Taşıtı Ticareti Yetki Belgesi.",
    required: true,
  },
  {
    id: "identityImages",
    label: "Şirket Ortağı/Yetkilisi Kimlik Görseli",
    helper: "Ön ve arka yüz görsellerini yükleyin.",
    required: true,
    multiple: true,
  },
];

const consentFields = [
  {
    id: "tasitposAgreement",
    label:
      "TaşıtPOS Platformu Üyelik ve Sanal POS Kullanım Sözleşmesi'ni okudum, onaylıyorum.",
    documentHref:
      "/documents/tasitpos-platformu-uyelik-ve-sanal-pos-kullanim-sozlesmesi.pdf",
    downloadHref:
      "/documents/tasitpos-platformu-uyelik-ve-sanal-pos-kullanim-sozlesmesi.docx",
  },
  {
    id: "kvkkConsent",
    label: "KVKK Aydınlatma Metni ve Açık Rıza Beyanı'nı onaylıyorum.",
  },
  {
    id: "memberMerchantAgreement",
    label: "[E-Para Kuruluşu Adı] Üye İşyeri Çerçeve Sözleşmesi'ni okudum, onaylıyorum.",
  },
];

const initialStepOneData = {
  companyType: companyTypes[0].value,
  taxIdentity: "",
  taxOffice: "",
  legalTitle: "",
  tradeName: "",
};

const initialStepTwoData = {
  authorizedName: "",
  authorizedIdentity: "",
  mobilePhone: "",
  authorizedEmail: "",
  galleryAddress: "",
  city: "",
  district: "",
};

const initialStepThreeData = {
  accountHolder: "",
  iban: "",
  bankName: "",
};

const initialDocumentUploads = {};

const initialConsentData = {
  tasitposAgreement: false,
  kvkkConsent: false,
  memberMerchantAgreement: false,
};

function formText(data, name) {
  return String(data.get(name) || "").trim();
}

function normalizeIban(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 26);
}

function formatIban(value) {
  return normalizeIban(value).replace(/(.{4})/g, "$1 ").trim();
}

function getBankNameFromIban(value) {
  const normalizedIban = normalizeIban(value);

  if (!normalizedIban.startsWith("TR") || normalizedIban.length < 9) {
    return "";
  }

  const bankCode = normalizedIban.slice(4, 9);

  return bankCodeMap[bankCode] || `Banka kodu: ${bankCode}`;
}

function getDocumentUploadFields(companyTypeValue) {
  return documentUploadFields.map((field) => ({
    ...field,
    required: field.optionalForCompanyType === companyTypeValue ? false : field.required,
  }));
}

function isAcceptedDocument(file) {
  const fileName = file.name.toLowerCase();
  const hasAcceptedExtension = acceptedDocumentExtensions.some((extension) =>
    fileName.endsWith(extension)
  );

  return acceptedDocumentTypes.includes(file.type) || hasAcceptedExtension;
}

function validateDocumentFile(file) {
  if (!isAcceptedDocument(file)) {
    return "Sadece PDF veya JPEG dosyası yüklenebilir.";
  }

  if (file.size > maxDocumentSize) {
    return "Dosya boyutu en fazla 5MB olmalıdır.";
  }

  return "";
}

function formatFileSize(bytes) {
  if (!bytes) {
    return "0 KB";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.ceil(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function documentUploadLine(field, upload) {
  const files = upload?.files || [];

  if (!files.length) {
    return `${field.label}: ${field.required ? "Eksik" : "Yüklenmedi (opsiyonel)"}`;
  }

  return `${field.label}: ${files
    .map((file) => `${file.name} (${formatFileSize(file.size)})`)
    .join(", ")}`;
}

function consentLine(field, consentData) {
  return `${field.label}: ${consentData[field.id] ? "Onaylandı" : "Onaylanmadı"}`;
}

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const remember = data.get("remember") === "on";

    if (!email || !password) {
      setError("E-posta ve parola zorunludur.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password, remember }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        setStatus("idle");
        setError(result.message || "E-posta veya parola hatalı.");
        return;
      }
      router.push("/panel");
      router.refresh();
    } catch {
      setStatus("idle");
      setError("Giriş şu anda tamamlanamadı. Lütfen tekrar deneyin.");
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form-head">
        <h1>Müşteri Girişi</h1>
        <p>TaşıtPOS paneline giriş yaparak tahsilat ve işlemlerinizi yönetin.</p>
      </div>

      {error ? (
        <div className="auth-feedback is-error" role="alert">
          <strong>Giriş yapılamadı.</strong>
          <p>{error}</p>
        </div>
      ) : null}

      <label>
        E-posta <em>*</em>
        <input
          type="email"
          name="email"
          placeholder="ornek@galeri.com"
          autoComplete="email"
          required
        />
      </label>
      <label>
        Parola <em>*</em>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </label>
      <div className="auth-row">
        <label className="auth-check">
          <input type="checkbox" name="remember" />
          Beni hatırla
        </label>
        <a
          href={`${brand.emailHref}?subject=${encodeURIComponent("TaşıtPOS Parola Sıfırlama")}`}
        >
          Parolamı unuttum
        </a>
      </div>
      <button className="btn btn-primary auth-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Kontrol ediliyor…" : "Giriş Yap"}
      </button>

      <p className="auth-switch">
        Henüz üye değil misiniz?{" "}
        <Link href="/basvuru">Hızlı başvuru yapın</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [companyType, setCompanyType] = useState(companyTypes[0].value);
  const [stepOneData, setStepOneData] = useState(initialStepOneData);
  const [stepTwoData, setStepTwoData] = useState(initialStepTwoData);
  const [stepThreeData, setStepThreeData] = useState(initialStepThreeData);
  const [documentUploads, setDocumentUploads] = useState(initialDocumentUploads);
  const [documentUploadError, setDocumentUploadError] = useState("");
  const [consentData, setConsentData] = useState(initialConsentData);
  const [ibanValue, setIbanValue] = useState(initialStepThreeData.iban);
  const detectedBankName = getBankNameFromIban(ibanValue);
  const activeDocumentFields = getDocumentUploadFields(stepOneData.companyType);

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (step === 1) {
      const nextStepOneData = {
        companyType,
        taxIdentity: formText(data, "taxIdentity"),
        taxOffice: formText(data, "taxOffice"),
        legalTitle: formText(data, "legalTitle"),
        tradeName: formText(data, "tradeName"),
      };

      setStepOneData(nextStepOneData);
      setStep(2);
      return;
    }

    if (step === 2) {
      const nextStepTwoData = {
        authorizedName: formText(data, "authorizedName"),
        authorizedIdentity: formText(data, "authorizedIdentity"),
        mobilePhone: formText(data, "mobilePhone"),
        authorizedEmail: formText(data, "authorizedEmail"),
        galleryAddress: formText(data, "galleryAddress"),
        city: formText(data, "city"),
        district: formText(data, "district"),
      };

      setStepTwoData(nextStepTwoData);
      setIbanValue(stepThreeData.iban);
      setStep(3);
      return;
    }

    if (step === 3) {
      const accountHolder = formText(data, "accountHolder");
      const normalizedIban = normalizeIban(formText(data, "iban"));
      const accountHolderInput = form.elements.accountHolder;
      const ibanInput = form.elements.iban;

      if (accountHolder !== stepOneData.legalTitle) {
        accountHolderInput.setCustomValidity(
          "Hesap sahibi adı, Adım 1'deki Ticari Unvan ile birebir aynı olmalıdır."
        );
        accountHolderInput.reportValidity();
        return;
      }

      accountHolderInput.setCustomValidity("");

      if (!/^TR[0-9]{24}$/.test(normalizedIban)) {
        ibanInput.setCustomValidity("IBAN TR ile başlamalı ve toplam 26 hane olmalıdır.");
        ibanInput.reportValidity();
        return;
      }

      ibanInput.setCustomValidity("");

      const nextStepThreeData = {
        accountHolder,
        iban: normalizedIban,
        bankName: getBankNameFromIban(normalizedIban),
      };

      setStepThreeData(nextStepThreeData);
      setIbanValue(normalizedIban);
      setStep(4);
      return;
    }

    const missingDocument = activeDocumentFields.find(
      (field) => field.required && !(documentUploads[field.id]?.files || []).length
    );

    if (missingDocument) {
      setDocumentUploadError(`${missingDocument.label} yüklenmeden başvuru gönderilemez.`);
      return;
    }

    setDocumentUploadError("");

    if (step === 4) {
      setStep(5);
      return;
    }

    const nextConsentData = consentFields.reduce(
      (accumulator, field) => ({
        ...accumulator,
        [field.id]: data.get(field.id) === "on",
      }),
      {}
    );
    const missingConsent = consentFields.find((field) => !nextConsentData[field.id]);

    if (missingConsent) {
      setConsentData(nextConsentData);
      return;
    }

    setConsentData(nextConsentData);

    const nextStepTwoData = {
      ...stepTwoData,
    };
    const accountHolder = formText(data, "accountHolder");
    const nextStepThreeData = {
      ...stepThreeData,
    };
    const completedCompanyType = companyTypes.find(
      (item) => item.value === stepOneData.companyType
    );

    sendToBrandMail("TaşıtPOS Dijital Onboarding - Başvuru Tamamlandı", [
      "Adım 1: Başlangıç ve Firma Türü Seçimi",
      `Firma Türü: ${completedCompanyType?.label || "-"}`,
      `VKN/TCKN: ${stepOneData.taxIdentity}`,
      `Vergi Dairesi: ${stepOneData.taxOffice}`,
      `Ticari Unvan: ${stepOneData.legalTitle}`,
      `İşletme Adı: ${stepOneData.tradeName}`,
      "",
      "Adım 2: Yetkili ve İletişim Bilgileri",
      `Adı Soyadı: ${nextStepTwoData.authorizedName}`,
      `T.C. Kimlik Numarası: ${nextStepTwoData.authorizedIdentity}`,
      `Cep Telefonu: ${nextStepTwoData.mobilePhone} (SMS OTP doğrulamalı)`,
      `E-posta Adresi: ${nextStepTwoData.authorizedEmail} (aktivasyon linkli)`,
      `Galeri Açık Adresi: ${nextStepTwoData.galleryAddress}`,
      `İl / İlçe: ${nextStepTwoData.city} / ${nextStepTwoData.district}`,
      "",
      "Adım 3: Banka ve Hak Ediş Bilgileri",
      `Hesap Sahibi Adı: ${nextStepThreeData.accountHolder || accountHolder}`,
      `IBAN Numarası: ${nextStepThreeData.iban}`,
      `Banka Adı: ${nextStepThreeData.bankName}`,
      "Not: Hesap sahibi adı Ticari Unvan ile birebir eşleşmelidir.",
      "",
      "Adım 4: Dijital Evrak Yükleme Paneli",
      ...activeDocumentFields.map((field) => documentUploadLine(field, documentUploads[field.id])),
      "Not: Mail uygulaması dosyaları otomatik ekleyemediği için seçilen evrakların e-postaya ek olarak iliştirilmesi gerekir.",
      "",
      "Adım 5: Sözleşme Onayları ve Başvuru Tamamlama",
      ...consentFields.map((field) => consentLine(field, nextConsentData)),
    ]);
    setStatus("sent");
  }

  function handleRestart() {
    setStatus("idle");
    setStep(1);
    setStepOneData(initialStepOneData);
    setStepTwoData(initialStepTwoData);
    setStepThreeData(initialStepThreeData);
    setDocumentUploads(initialDocumentUploads);
    setDocumentUploadError("");
    setConsentData(initialConsentData);
    setIbanValue(initialStepThreeData.iban);
    setCompanyType(companyTypes[0].value);
  }

  function handleBackToStepOne(event) {
    const form = event.currentTarget.form;

    if (form) {
      const data = new FormData(form);

      setStepTwoData({
        authorizedName: formText(data, "authorizedName"),
        authorizedIdentity: formText(data, "authorizedIdentity"),
        mobilePhone: formText(data, "mobilePhone"),
        authorizedEmail: formText(data, "authorizedEmail"),
        galleryAddress: formText(data, "galleryAddress"),
        city: formText(data, "city"),
        district: formText(data, "district"),
      });
    }

    setStep(1);
  }

  function handleBackToStepTwo(event) {
    const form = event.currentTarget.form;

    if (form) {
      const data = new FormData(form);
      const normalizedIban = normalizeIban(formText(data, "iban"));

      setStepThreeData({
        accountHolder: formText(data, "accountHolder"),
        iban: normalizedIban,
        bankName: getBankNameFromIban(normalizedIban),
      });
      setIbanValue(normalizedIban);
    }

    setStep(2);
  }

  function handleIbanChange(event) {
    event.currentTarget.setCustomValidity("");
    setIbanValue(normalizeIban(event.currentTarget.value));
  }

  function handleDocumentFiles(fieldId, fileList) {
    const files = Array.from(fileList || []);

    if (!files.length) {
      return;
    }

    const validFiles = [];
    const errors = [];

    files.forEach((file) => {
      const validationError = validateDocumentFile(file);

      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        return;
      }

      validFiles.push(file);
    });

    setDocumentUploads((currentUploads) => {
      const currentFiles = currentUploads[fieldId]?.files || [];

      return {
        ...currentUploads,
        [fieldId]: {
          files: validFiles.length ? validFiles : currentFiles,
          error: errors.join(" "),
        },
      };
    });
    setDocumentUploadError("");
  }

  function handleDocumentInputChange(event, fieldId) {
    handleDocumentFiles(fieldId, event.currentTarget.files);
    event.currentTarget.value = "";
  }

  function handleDocumentDrop(event, fieldId) {
    event.preventDefault();
    handleDocumentFiles(fieldId, event.dataTransfer.files);
  }

  function handleDocumentDragOver(event) {
    event.preventDefault();
  }

  function handleRemoveDocument(fieldId, fileIndex) {
    setDocumentUploads((currentUploads) => {
      const currentFiles = currentUploads[fieldId]?.files || [];
      const nextFiles = currentFiles.filter((_, index) => index !== fileIndex);

      return {
        ...currentUploads,
        [fieldId]: {
          files: nextFiles,
          error: "",
        },
      };
    });
  }

  function handleBackToStepThree() {
    setDocumentUploadError("");
    setStep(3);
  }

  function handleBackToStepFour() {
    setStep(4);
  }

  function handleConsentChange(event) {
    const { name, checked } = event.currentTarget;

    setConsentData((currentConsentData) => ({
      ...currentConsentData,
      [name]: checked,
    }));
  }

  return (
    <form className="auth-form auth-form-wide" onSubmit={handleSubmit}>
      <div className="auth-form-head">
        <div className="auth-steps" aria-label="Başvuru adımları">
          <span className={step === 1 ? "auth-step auth-step-active" : "auth-step"}>
            Adım 1
          </span>
          <span className={step === 2 ? "auth-step auth-step-active" : "auth-step"}>
            Adım 2
          </span>
          <span className={step === 3 ? "auth-step auth-step-active" : "auth-step"}>
            Adım 3
          </span>
          <span className={step === 4 ? "auth-step auth-step-active" : "auth-step"}>
            Adım 4
          </span>
          <span className={step === 5 ? "auth-step auth-step-active" : "auth-step"}>
            Adım 5
          </span>
        </div>
        <h1>Dijital Onboarding</h1>
        {step === 1 ? (
          <p>
            Galerinizin hukuki yapısını belirleyin. İstenen evraklar bu seçime
            göre dinamik olarak hazırlanır.
          </p>
        ) : step === 2 ? (
          <p>
            Şirket imza yetkilisinin ve TaşıtPOS'u yönetecek kişinin iletişim
            bilgilerini girin.
          </p>
        ) : step === 3 ? (
          <p>
            Araç satışlarından gelen hak edişlerin aktarılacağı resmi banka
            hesabını tanımlayın.
          </p>
        ) : step === 4 ? (
          <p>
            E-para kuruluşunun risk birimi tarafından incelenecek resmi belgeleri
            PDF veya JPEG formatında yükleyin.
          </p>
        ) : (
          <p>
            Yasal metinleri dijital olarak onaylayarak başvurunuzu tamamlayın.
          </p>
        )}
      </div>

      {status === "sent" ? (
        <div className="auth-feedback" role="status">
          <strong>Onboarding bilgileriniz hazırlandı.</strong>
          <p>
            Mail <strong>{brand.email}</strong> adresine yönlendirildi. E-posta
            uygulamanızdan göndermeniz yeterli.
          </p>
          <button className="btn btn-primary auth-submit" type="button" onClick={handleRestart}>
            Yeni Başvuru Başlat
          </button>
        </div>
      ) : step === 1 ? (
        <>
          <fieldset className="auth-fieldset">
            <legend>
              Firma Türü <em>*</em>
            </legend>
            <div className="company-type-options">
              {companyTypes.map((item) => (
                <label
                  key={item.value}
                  className={
                    item.value === companyType
                      ? "company-type-option company-type-option-active"
                      : "company-type-option"
                  }
                >
                  <input
                    type="radio"
                    name="companyType"
                    value={item.value}
                    checked={companyType === item.value}
                    onChange={(event) => setCompanyType(event.currentTarget.value)}
                    required
                  />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.helper}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="auth-grid">
            <label>
              Vergi Numarası / T.C. Kimlik Numarası <em>*</em>
              <input
                type="text"
                name="taxIdentity"
                inputMode="numeric"
                maxLength="11"
                pattern="[0-9]{10,11}"
                placeholder="VKN/TCKN"
                defaultValue={stepOneData.taxIdentity}
                required
              />
            </label>
            <label>
              Vergi Dairesi <em>*</em>
              <input
                type="text"
                name="taxOffice"
                placeholder="Manisa Vergi Dairesi"
                defaultValue={stepOneData.taxOffice}
                required
              />
            </label>
            <label>
              Ticari Unvan <em>*</em>
              <input
                type="text"
                name="legalTitle"
                placeholder="Şirket resmi adı"
                defaultValue={stepOneData.legalTitle}
                required
              />
            </label>
            <label>
              İşletme Adı <em>*</em>
              <input
                type="text"
                name="tradeName"
                placeholder="Tabela adı"
                defaultValue={stepOneData.tradeName}
                required
              />
            </label>
          </div>
          <button className="btn btn-primary auth-submit" type="submit">
            Devam Et
          </button>
        </>
      ) : step === 2 ? (
        <>
          <div className="auth-grid">
            <label>
              Adı Soyadı <em>*</em>
              <input
                type="text"
                name="authorizedName"
                placeholder="Ahmet Yılmaz"
                defaultValue={stepTwoData.authorizedName}
                autoComplete="name"
                required
              />
            </label>
            <label>
              T.C. Kimlik Numarası <em>*</em>
              <input
                type="text"
                name="authorizedIdentity"
                inputMode="numeric"
                maxLength="11"
                pattern="[0-9]{11}"
                placeholder="11 haneli TCKN"
                defaultValue={stepTwoData.authorizedIdentity}
                required
              />
            </label>
            <label>
              <span className="auth-label-row">
                <span>
                  Cep Telefonu <em>*</em>
                </span>
                <small>SMS OTP</small>
              </span>
              <input
                type="tel"
                name="mobilePhone"
                placeholder="+90 532 000 00 00"
                defaultValue={stepTwoData.mobilePhone}
                autoComplete="tel"
                required
              />
            </label>
            <label>
              <span className="auth-label-row">
                <span>
                  E-posta Adresi <em>*</em>
                </span>
                <small>Aktivasyon</small>
              </span>
              <input
                type="email"
                name="authorizedEmail"
                placeholder="ornek@galeri.com"
                defaultValue={stepTwoData.authorizedEmail}
                autoComplete="email"
                required
              />
            </label>
          </div>

          <label>
            Galerinin Açık Adresi <em>*</em>
            <textarea
              name="galleryAddress"
              rows="4"
              placeholder="Mahalle, cadde/sokak, bina no, kat, kapı no"
              defaultValue={stepTwoData.galleryAddress}
              autoComplete="street-address"
              required
            />
          </label>

          <div className="auth-grid">
            <label>
              İl <em>*</em>
              <select name="city" defaultValue={stepTwoData.city} required>
                <option value="">İl seçin</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
            <label>
              İlçe <em>*</em>
              <input
                type="text"
                name="district"
                placeholder="İlçe"
                defaultValue={stepTwoData.district}
                autoComplete="address-level2"
                required
              />
            </label>
          </div>

          <div className="auth-actions">
            <button className="btn btn-light auth-back" type="button" onClick={handleBackToStepOne}>
              Geri
            </button>
            <button className="btn btn-primary auth-submit" type="submit">
              Devam Et
            </button>
          </div>
        </>
      ) : step === 3 ? (
        <>
          <label>
            Hesap Sahibi Adı <em>*</em>
            <input
              type="text"
              name="accountHolder"
              placeholder={stepOneData.legalTitle || "Adım 1'deki Ticari Unvan"}
              defaultValue={stepThreeData.accountHolder || stepOneData.legalTitle}
              onInput={(event) => event.currentTarget.setCustomValidity("")}
              required
            />
          </label>

          <div className="auth-grid">
            <label>
              IBAN Numarası <em>*</em>
              <input
                type="text"
                name="iban"
                maxLength="32"
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                value={formatIban(ibanValue)}
                onChange={handleIbanChange}
                aria-describedby="iban-help"
                required
              />
            </label>
            <label>
              Banka Adı <em>*</em>
              <input
                type="text"
                name="bankName"
                value={detectedBankName}
                placeholder="IBAN yazıldığında otomatik gelir"
                readOnly
                required
              />
            </label>
          </div>

          <p className="auth-note" id="iban-help">
            Hesap sahibi adı, Adım 1'deki Ticari Unvan ile birebir eşleşmelidir.
            IBAN TR ile başlamalı ve toplam 26 hane olmalıdır.
          </p>

          <div className="auth-actions">
            <button className="btn btn-light auth-back" type="button" onClick={handleBackToStepTwo}>
              Geri
            </button>
            <button className="btn btn-primary auth-submit" type="submit">
              Devam Et
            </button>
          </div>
        </>
      ) : step === 4 ? (
        <>
          <div className="document-upload-list">
            {activeDocumentFields.map((field) => {
              const upload = documentUploads[field.id] || { files: [], error: "" };
              const files = upload.files || [];

              return (
                <section className="document-upload-card" key={field.id}>
                  <div className="document-upload-head">
                    <div>
                      <h3>{field.label}</h3>
                      <p>{field.helper}</p>
                    </div>
                    <span
                      className={
                        field.required
                          ? "document-upload-badge"
                          : "document-upload-badge document-upload-badge-optional"
                      }
                    >
                      {field.required ? "Zorunlu" : "Opsiyonel"}
                    </span>
                  </div>

                  <label
                    className="document-dropzone"
                    onDragOver={handleDocumentDragOver}
                    onDrop={(event) => handleDocumentDrop(event, field.id)}
                  >
                    <input
                      className="document-file-input"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
                      multiple={field.multiple}
                      onChange={(event) => handleDocumentInputChange(event, field.id)}
                    />
                    <span>Sürükle-bırak veya dosya seç</span>
                    <small>PDF, JPEG · Maksimum 5MB</small>
                  </label>

                  {files.length ? (
                    <ul className="document-upload-files">
                      {files.map((file, index) => (
                        <li key={`${file.name}-${file.size}-${index}`}>
                          <span>
                            {file.name}
                            <small>{formatFileSize(file.size)}</small>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(field.id, index)}
                          >
                            Kaldır
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {upload.error ? <p className="document-upload-error">{upload.error}</p> : null}
                </section>
              );
            })}
          </div>

          {documentUploadError ? (
            <p className="document-upload-error document-upload-error-global">
              {documentUploadError}
            </p>
          ) : null}

          <p className="auth-note">
            Ticaret Sicil Gazetesi, şahıs şirketleri için opsiyoneldir. Diğer
            tüm belgeler risk incelemesi için zorunludur.
          </p>

          <div className="auth-actions">
            <button className="btn btn-light auth-back" type="button" onClick={handleBackToStepThree}>
              Geri
            </button>
            <button className="btn btn-primary auth-submit" type="submit">
              Devam Et
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="contract-consent-list">
            {consentFields.map((field) => (
              <div className="contract-consent-option" key={field.id}>
                <label htmlFor={`consent-${field.id}`}>
                  <input
                    id={`consent-${field.id}`}
                    type="checkbox"
                    name={field.id}
                    checked={consentData[field.id]}
                    onChange={handleConsentChange}
                    required
                  />
                  <span>{field.label}</span>
                </label>
                {field.documentHref ? (
                  <div className="contract-document-actions">
                    <a href={field.documentHref} target="_blank" rel="noreferrer">
                      Sözleşmeyi görüntüle
                    </a>
                    <a href={field.downloadHref} download>
                      Word olarak indir
                    </a>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <p className="auth-note">
            Bu onaylar başvurunun dijital imza/ön kabul adımı olarak kayda alınır.
            Nihai aktivasyon, e-para kuruluşu risk ve uyum incelemesine tabidir.
          </p>

          <div className="auth-actions">
            <button className="btn btn-light auth-back" type="button" onClick={handleBackToStepFour}>
              Geri
            </button>
            <button className="btn btn-primary auth-submit" type="submit">
              Başvuruyu Tamamla
            </button>
          </div>
        </>
      )}

      <p className="auth-switch">
        Zaten hesabınız var mı? <Link href="/giris">Müşteri girişi</Link>
      </p>
    </form>
  );
}
