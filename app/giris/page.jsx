import { SiteFrame } from "../components";
import { LoginForm } from "../auth-forms";

export const metadata = {
  title: "Müşteri Girişi",
  description:
    "TaşıtPOS müşteri paneline giriş yapın. Tahsilat, taksit ve işlemlerinizi yönetin.",
};

export default function LoginPage() {
  return (
    <SiteFrame>
      <section className="auth-page">
        <div className="container auth-shell">
          <aside className="auth-aside">
            <p className="eyebrow">TaşıtPOS Panel</p>
            <h2>Galeriniz için güvenli ödeme paneli.</h2>
            <ul className="auth-points">
              <li>Anlık tahsilat ve ödeme takibi</li>
              <li>Taksit ve vade yönetimi</li>
              <li>TCMB lisanslı kuruluş altyapısı</li>
            </ul>
          </aside>
          <LoginForm />
        </div>
      </section>
    </SiteFrame>
  );
}
