import Link from "next/link";
import { InfoPageFrame } from "../components/InfoPageFrame";

export default function ContactPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "";

  return <InfoPageFrame eyebrow="WE ARE HERE TO HELP" title="Contact PremiumProperty" description="Choose the right place to get help with this property discovery website.">
    <div className="info-grid">
      <section className="info-card info-contact-primary">
        <span className="eyebrow">SUPPORT</span>
        <h2>Get in touch</h2>
        {supportEmail
          ? <><p>For website questions, email our support team. Include the page you were using and a short description of the issue.</p><a className="button button-teal" href={"mailto:" + supportEmail}>Email {supportEmail}</a></>
          : <><p>A support email has not been configured for this preview. Add <code>NEXT_PUBLIC_SUPPORT_EMAIL</code> to your local and hosting environment settings to show your contact address here.</p><p className="info-note">This website has no message service, so this page does not collect or send form submissions.</p></>}
      </section>
      <section className="info-card">
        <span className="eyebrow">PROPERTY OWNERS</span>
        <h2>Post or manage a listing</h2>
        <p>Create a sample property draft or open your workspace.</p>
        <div className="info-actions"><Link href="/post-property">Post a property →</Link><Link href="/dashboard">Open workspace →</Link></div>
      </section>
      <section className="info-card">
        <span className="eyebrow">SEARCH HELP</span>
        <h2>Need help finding a place?</h2>
        <p>Try another locality, review the sample search pages, or read the home search guides.</p>
        <div className="info-actions"><Link href="/explore">Explore properties →</Link><Link href="/guides">Read the guides →</Link></div>
      </section>
    </div>
    <section className="info-section"><h2>About this contact page</h2><p>This website currently provides property discovery and workflow tools. Listing enquiries, phone support, and a central support inbox are not connected. Do not enter sensitive personal or financial information into this website.</p></section>
  </InfoPageFrame>;
}

