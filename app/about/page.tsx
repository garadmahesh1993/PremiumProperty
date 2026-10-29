import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageFrame } from "@/components/layout/InfoPageFrame";

export const metadata: Metadata = {
  title: "About PremiumProperty",
  description: "Learn about the PremiumProperty property discovery experience.",
};

export default function AboutPage() {
  return <InfoPageFrame eyebrow="ABOUT US" title="A clearer way to find your next place" description="PremiumProperty brings property discovery, practical tools, and helpful guides together in one straightforward experience.">
    <div className="info-grid">
      <section className="info-card">
        <span className="eyebrow">OUR PURPOSE</span>
        <h2>Make the search easier to navigate</h2>
        <p>Finding a home or workspace involves many choices. This experience is designed to help people explore locations, compare property details, and keep useful options together.</p>
      </section>
      <section className="info-card">
        <span className="eyebrow">WHAT YOU CAN DO</span>
        <h2>Explore at your own pace</h2>
        <p>Browse sample homes, rentals, commercial spaces, plots, and projects. Use the planning tools and guides to organize your next steps.</p>
        <div className="info-actions"><Link href="/explore">Explore properties →</Link><Link href="/guides">Read the guides →</Link></div>
      </section>
      <section className="info-card">
        <span className="eyebrow">OUR APPROACH</span>
        <h2>Know what is sample content</h2>
        <p>This website helps people explore property information and tools. Property listings, prices, projects, enquiries, and account workflows are examples and are not verified real offers or connected services.</p>
        <div className="info-actions"><Link href="/terms">Read the terms →</Link><Link href="/privacy">Privacy notice →</Link></div>
      </section>
      <section className="info-card">
        <span className="eyebrow">QUESTIONS?</span>
        <h2>Find help and support information</h2>
        <p>See the available contact options and learn which parts of the current preview are connected.</p>
        <div className="info-actions"><Link href="/contact">Contact and support →</Link><Link href="/services">Open property tools →</Link></div>
      </section>
    </div>
    <section className="info-section"><h2>Explore the site</h2><p>Start with <Link href="/buy">homes for sale</Link>, <Link href="/rent">homes for rent</Link>, <Link href="/commercial">commercial property</Link>, <Link href="/pg">PG and co-living</Link>, or <Link href="/plots">plots and land</Link>.</p></section>
  </InfoPageFrame>;
}

