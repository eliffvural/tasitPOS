import { SiteFrame } from "../components";
import { RegisterForm } from "../auth-forms";

export const metadata = {
  title: "Hızlı Başvuru",
  description:
    "TaşıtPOS için hızlı başvuru yapın. Aynı gün kurulum ve sanal POS aktivasyonu.",
};

export default function RegisterPage() {
  return (
    <SiteFrame>
      <section className="auth-page">
        <div className="container auth-shell auth-shell-wide">
          <aside className="auth-aside">
            <p className="eyebrow">Ücretsiz Kurulum</p>
            <h2>Bugün başvurun, yarın tahsilat alın.</h2>
            <ul className="auth-points">
              <li>Kurulum ücretsiz</li>
              <li>Bağlayıcı sözleşme yok</li>
              <li>24 saatte devreye alma</li>
            </ul>
          </aside>
          <RegisterForm />
        </div>
      </section>
    </SiteFrame>
  );
}
