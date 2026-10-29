import Link from "next/link";
import { InfoPageFrame } from "@/components/layout/InfoPageFrame";

export default function PrivacyPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "";

  return <InfoPageFrame eyebrow="YOUR INFORMATION" title="Privacy notice" description="How information is handled in the current PremiumProperty website. Last updated: 28 October 2026.">
    <div className="info-draft-note"><strong>Website notice</strong><span>This notice describes the current prototype. Review and update it for the actual operator, hosting setup, and data practices before a public launch.</span></div>
    <article className="info-article">
      <section><h2>1. Information stored on this website</h2><p>Saved properties, saved searches, and property draft information are kept in local browser storage on the device where you use the website. The current frontend does not send these items to a PremiumProperty account server. They remain in that browser until its site data is cleared.</p><p>The sign-in screen is simulated. It does not send an SMS, create a real account, or verify your identity.</p></section>
      <section><h2>2. Location search providers</h2><p>When Google Places is configured, text entered into location autocomplete is sent to Google to provide place suggestions. Google's handling of that information is described in its <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>. Google Maps content is shown with the required attribution.</p><p>When a Google key is not configured, the current fallback sends the typed search query to the Photon geocoding service to look up OpenStreetMap place data. Do not enter sensitive personal information in the location search.</p></section>
      <section><h2>3. Cookies and local storage</h2><p>This website uses browser local storage for saved items and draft data. This is separate from browser cookies. Your browser settings let you remove local site data; doing so also removes saved information stored on this device.</p></section>
      <section><h2>4. Contact messages</h2><p>The contact page does not submit messages to this website. If a support email address is configured, selecting its email link opens your email application, and your email provider processes any message you choose to send.</p></section>
      <section><h2>5. Security and changes</h2><p>Because this prototype stores data in the browser, do not use it to store confidential documents, passwords, payment details, or other sensitive information. This notice should be revised if the website adds accounts, analytics, advertising, a backend, or other data services.</p></section>
      <section><h2>6. Questions</h2><p>{supportEmail ? <>Contact <a href={"mailto:" + supportEmail}>{supportEmail}</a> with privacy questions.</> : <>A privacy contact address has not yet been configured. See the <Link href="/contact">Contact page</Link> for the current support status.</>}</p></section>
      <section className="info-third-party"><h2>Google Maps Platform terms</h2><p>If Google Maps features are enabled, their use is also subject to Google's applicable <a href="https://maps.google.com/help/terms_maps/" target="_blank" rel="noreferrer">Google Maps terms</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google Privacy Policy</a>.</p></section>
    </article>
  </InfoPageFrame>;
}


