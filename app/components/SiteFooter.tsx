"use client";

import { useState } from "react";
import Link from "next/link";

type FooterTab = "buyers" | "tenants" | "projects" | "cities" | "searches";
type FooterLink = { label: string; href: string };

const cityNames = ["Thane", "Virar", "Ambernath", "Satara", "Nagpur", "Vasai", "Aurangabad", "Raigad", "Mira Bhayandar", "Badlapur", "Amravati", "Ahmednagar", "Nashik", "Nala Sopara", "Lonavala", "Jalgaon", "Kalyan", "Naigaon", "Kolhapur", "Bhusawal"];
const popularCities = ["Pune", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Ahmedabad", "Delhi", "Noida", "Gurgaon", "Hyderabad", "Thane", "Navi Mumbai", "Nagpur", "Nashik", "Jaipur", "Surat", "Indore", "Lucknow", "Kochi", "Coimbatore"];
const makeCityLinks = (cities: string[], mode: "buy" | "rent"): FooterLink[] => cities.map((city) => ({ label: (mode === "buy" ? "Flats for sale in " : "Properties for rent in ") + city, href: "/" + mode + "?city=" + encodeURIComponent(city) }));
const tabLabels: { id: FooterTab; label: string }[] = [
  { id: "buyers", label: "FOR BUYERS" }, { id: "tenants", label: "FOR TENANTS" }, { id: "projects", label: "PROJECTS" },
  { id: "cities", label: "POPULAR CITIES" }, { id: "searches", label: "POPULAR SEARCHES" },
];
const footerContent: Record<FooterTab, { heading: string; links: FooterLink[] }> = {
  buyers: { heading: "Find homes for sale", links: makeCityLinks(cityNames, "buy") },
  tenants: { heading: "Find homes for rent", links: makeCityLinks(cityNames, "rent") },
  projects: { heading: "Explore new projects", links: ["Pune", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Navi Mumbai", "Thane", "Noida", "Gurgaon", "Ahmedabad", "Kolkata", "Jaipur"].map((city) => ({ label: "New projects in " + city, href: "/projects?city=" + encodeURIComponent(city) })) },
  cities: { heading: "Explore properties by city", links: popularCities.map((city) => ({ label: city, href: "/buy?city=" + encodeURIComponent(city) })) },
  searches: { heading: "Popular property searches", links: [
    { label: "Apartments for sale", href: "/buy?kind=Apartment" }, { label: "Villas for sale", href: "/buy?kind=Villa" },
    { label: "Plots for sale", href: "/plots" }, { label: "Commercial property", href: "/commercial" },
    { label: "Apartments for rent", href: "/rent?kind=Apartment" }, { label: "Independent homes for rent", href: "/rent?kind=Independent%20house" },
    { label: "PG & co-living", href: "/pg" }, { label: "Commercial spaces for lease", href: "/commercial?purpose=rent" },
    { label: "1 BHK homes for sale", href: "/buy?bhk=1" }, { label: "2 BHK homes for sale", href: "/buy?bhk=2" },
    { label: "1 BHK homes for rent", href: "/rent?bhk=1" }, { label: "2 BHK homes for rent", href: "/rent?bhk=2" },
    { label: "New residential projects", href: "/projects" }, { label: "Property guides", href: "/guides" },
  ] },
};

const companyLinks: FooterLink[] = [
  { label: "About us", href: "/about" }, { label: "Services & tools", href: "/services" }, { label: "Contact", href: "/contact" },
  { label: "Privacy notice", href: "/privacy" }, { label: "Terms of use", href: "/terms" },
  { label: "Saved searches", href: "/account" }, { label: "Property guides", href: "/guides#areas" },
];

export function SiteFooter() {
  const [activeTab, setActiveTab] = useState<FooterTab>("buyers");
  const activeContent = footerContent[activeTab];

  return <footer className="site-footer">
    <div className="footer-discovery">
      <div className="footer-tabs" role="tablist" aria-label="Explore property links">
        {tabLabels.map(({ id, label }) => <button key={id} type="button" role="tab" id={"footer-tab-" + id} aria-selected={activeTab === id} aria-controls="footer-link-panel" className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}>{label}</button>)}
      </div>
      <section className="footer-link-panel" id="footer-link-panel" role="tabpanel" aria-labelledby={"footer-tab-" + activeTab}>
        <h2>{activeContent.heading}</h2>
        <div className="footer-link-grid">{activeContent.links.map((item) => <Link href={item.href} key={item.label + item.href}>{item.label}</Link>)}</div>
      </section>
    </div>

    <div className="footer-main">
      <div className="footer-brand-panel">
        <Link className="brand footer-brand" href="/"><span className="brand-mark">P<span>.</span></span><span className="brand-name">Premium<span>Property</span></span></Link>
        <p>Find a place that feels like yours.</p>
        <div className="footer-brand-art" aria-label="A clearer way to find your next place">
          <span>Find your<br/>next place.</span><i aria-hidden="true">⌂</i><small>DISCOVER · COMPARE · MOVE</small>
        </div>
      </div>
      <FooterColumn title="COMPANY" links={companyLinks}/>
      <FooterColumn title="PARTNER SITES" links={[{ label: "List a property", href: "/post-property" }, { label: "Broker workspace", href: "/dashboard" }, { label: "Project directory", href: "/projects" }]}/>
      <FooterColumn title="EXPLORE" links={[{ label: "Buy a home", href: "/buy" }, { label: "Rent a home", href: "/rent" }, { label: "Commercial", href: "/commercial" }, { label: "PG / co-living", href: "/pg" }, { label: "Plots", href: "/plots" }, { label: "Property details example", href: "/property/pp-101" }, { label: "Guides & tools", href: "/guides" }]}/>
      <div className="footer-app">
        <h2>YOUR PROPERTY SEARCH, ANYWHERE</h2>
        <p>Save searches and keep your property shortlist in one place.</p>
        <Link className="footer-app-link" href="/account">Open your account <span aria-hidden="true">→</span></Link>
        <div className="footer-socials" aria-label="Follow PremiumProperty"><span>in</span><span>◎</span><span>f</span></div>
      </div>
    </div>

    <div className="footer-legal"><Link className="brand footer-brand-small" href="/"><span className="brand-mark">P<span>.</span></span><span className="brand-name">Premium<span>Property</span></span></Link><span>© 2026 PremiumProperty · Property discovery</span><div className="footer-legal-links"><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><span>Property information is illustrative.</span></div>
  </footer>;
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return <nav className="footer-column" aria-label={title}><h2>{title}</h2>{links.map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}</nav>;
}






