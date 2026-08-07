import { brand } from "./site-data";

export function sendToBrandMail(subject, lines) {
  const mailSubject = encodeURIComponent(subject);
  const mailBody = encodeURIComponent(lines.filter(Boolean).join("\n"));
  window.location.href = `${brand.emailHref}?subject=${mailSubject}&body=${mailBody}`;
}
