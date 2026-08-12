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
        <div className="container auth-shell-single">
          <RegisterForm />
        </div>
      </section>
    </SiteFrame>
  );
}
