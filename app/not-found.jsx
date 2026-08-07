import Link from "next/link";
import { SiteFrame } from "./components";

export default function NotFound() {
  return (
    <SiteFrame>
      <section className="page-intro not-found-page">
        <div className="container narrow">
          <p className="eyebrow">404</p>
          <h1>Aradığınız sayfa bulunamadı.</h1>
          <p>Sayfa taşınmış ya da kaldırılmış olabilir.</p>
          <Link className="btn btn-primary" href="/">
            Ana Sayfaya Dön
          </Link>
        </div>
      </section>
    </SiteFrame>
  );
}
