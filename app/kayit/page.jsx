import { SiteFrame } from "../components";
import { SignupForm } from "../auth-forms";

export const metadata = {
  title: "Kayıt Ol",
  description: "TaşıtPOS müşteri paneli için e-posta ve parola ile hesap oluşturun.",
};

export default function SignupPage() {
  return (
    <SiteFrame>
      <section className="auth-page">
        <div className="container auth-shell">
          <aside className="auth-aside">
            <p className="eyebrow">TaşıtPOS Panel</p>
            <h2>Hesabınızı oluşturun, tahsilata geçin.</h2>
            <ul className="auth-points">
              <li>E-posta ve parola ile kayıt</li>
              <li>Parola özeti güvenli saklanır</li>
              <li>Kayıt sonrası panele giriş</li>
            </ul>
          </aside>
          <SignupForm />
        </div>
      </section>
    </SiteFrame>
  );
}
