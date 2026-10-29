import Link from "next/link";
import { InfoPageFrame } from "@/components/layout/InfoPageFrame";

const contactPhone = "+91 9607319219";
const contactEmail = "ajnovarealty@gmail.com";
const gmailComposeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}&su=${encodeURIComponent("PremiumProperty website query")}`;

export default function ContactPage() {
  return <InfoPageFrame eyebrow="WE ARE HERE TO HELP" title="Contact AJ NOVA REALITY" description="Reach our team about PremiumProperty, property listings, or help using the website.">
    <div className="info-grid">
      <section className="info-card info-contact-primary">
        <span className="eyebrow">CONTACT OUR TEAM</span>
        <h2>We would be glad to hear from you</h2>
        <p>Choose the contact method that works best. For website support, include the page you were using and a short description of your question.</p>
        <div className="info-actions">
          <a className="button button-teal" href={`tel:${contactPhone.replaceAll(" ", "")}`}>Call {contactPhone}</a>
          <a href={gmailComposeHref} target="_blank" rel="noreferrer">Email us in Gmail →</a>
        </div>
        <p className="info-note">This preview does not include a contact form or an online message inbox. Your email app or phone app will open when you select a contact option.</p>
      </section>
      <section className="info-card info-contact-secondary">
        <span className="eyebrow">PROPERTY OWNERS</span>
        <h2>Post or manage a listing</h2>
        <p>Prepare a property listing or open your workspace to review saved drafts.</p>
        <div className="info-actions"><Link href="/post-property">Post a property →</Link><Link href="/dashboard">Open workspace →</Link></div>
      </section>
      <section className="info-card info-contact-secondary">
        <span className="eyebrow">SEARCH HELP</span>
        <h2>Need help finding a place?</h2>
        <p>Explore available properties, try another locality, or browse the search guides.</p>
        <div className="info-actions"><Link href="/explore">Explore properties →</Link><Link href="/guides">Read the guides →</Link></div>
      </section>
      <section className="info-card info-contact-secondary">
        <span className="eyebrow">BUSINESS DETAILS</span>
        <h2>AJ NOVA REALITY</h2>
        <p>PremiumProperty is a property discovery and workflow website operated by AJ NOVA REALITY.</p>
        <p><strong>Email:</strong> <a href={gmailComposeHref} target="_blank" rel="noreferrer">{contactEmail}</a><br/><strong>Phone:</strong> <a href={`tel:${contactPhone.replaceAll(" ", "")}`}>{contactPhone}</a></p>
      </section>
    </div>
    <section className="info-section"><h2>Before you contact us</h2><p>Please do not email passwords, one-time codes, payment details, or other sensitive personal or financial information. Property availability and listing details should be confirmed directly before making a transaction. Contact links open your device’s email or phone app; this website does not send or store messages.</p></section>
  </InfoPageFrame>;
}
