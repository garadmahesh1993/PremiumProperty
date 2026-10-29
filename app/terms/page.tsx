import Link from "next/link";
import { InfoPageFrame } from "../components/InfoPageFrame";

export default function TermsPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "";

  return <InfoPageFrame eyebrow="SITE TERMS" title="Terms of use" description="Please read these terms for the current PremiumProperty website.  Last updated: 28 October 2026.">
    <div className="info-draft-note"><strong>Website terms</strong><span>These terms describe the current website experience. The site operator should review and customize them before accepting public users or real property listings.</span></div>
    <article className="info-article">
      <section><h2>1. About this website</h2><p>PremiumProperty provides property discovery and workflow tools. By using the website, you agree to use it lawfully and not disrupt its operation or attempt unauthorized access.</p></section>
      <section><h2>2. Property listings and projects</h2><p>Property listings, project names, prices, availability, photos, locations, and related details shown on this website are illustrative and may be fictional. They are not offers to sell, lease, or rent property, and must not be relied on for a property, financial, or legal decision.</p><p>Verify ownership, approvals, location, price, availability, and all other details independently with the relevant parties and authorities before taking action.</p></section>
      <section><h2>3. Search and availability</h2><p>Search suggestions help identify places; they do not confirm that a property exists or is available there. Results depend on the sample listings currently included on the website. A location with no matching sample listing may show an empty-results message.</p></section>
      <section><h2>4. User information and submissions</h2><p>Some website features save sample preferences or drafts in your browser. They do not publish a real property listing, create an account, send a message, or make a booking. Do not submit information that you do not have permission to share.</p></section>
      <section><h2>5. Third-party services</h2><p>Location search may use Google Maps Platform or Photon/OpenStreetMap, depending on configuration. Third-party services are subject to their own terms and privacy notices. If Google Maps features are enabled, their use is subject to the applicable <a href="https://maps.google.com/help/terms_maps/" target="_blank" rel="noreferrer">Google Maps terms</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google Privacy Policy</a>.</p></section>
      <section><h2>6. Website availability</h2><p>This website may change and may change, become unavailable, or contain errors. No service level, listing accuracy, or uninterrupted access is promised by this prototype.</p></section>
      <section><h2>7. Contact</h2><p>{supportEmail ? <>Questions about these terms can be sent to <a href={"mailto:" + supportEmail}>{supportEmail}</a>.</> : <>No support email is configured for this preview. Visit the <Link href="/contact">Contact page</Link> for available help options.</>}</p></section>
    </article>
  </InfoPageFrame>;
}



