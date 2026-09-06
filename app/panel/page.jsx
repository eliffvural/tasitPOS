import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "../../lib/server/session.mjs";
import { PanelApp } from "./panel-app";

export const metadata = {
  title: "Galeri Paneli",
  description: "TaşıtPOS tahsilat, hakediş ve muhasebe paneli.",
};

export default async function PanelPage() {
  const cookieStore = await cookies();
  const principal = verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value || "");
  if (!principal) redirect("/giris");
  return <PanelApp accountEmail={principal.email} />;
}
