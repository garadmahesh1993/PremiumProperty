"use client";

import { useState } from "react";

const listings = [
  { title: "3 BHK apartment · Baner", state: "Published", tone: "published", views: "248", leads: "12", date: "Updated 18 Oct" },
  { title: "2 BHK apartment · Wakad", state: "Under review", tone: "review", views: "—", leads: "—", date: "Submitted 21 Oct" },
  { title: "Row house · Kothrud", state: "Draft", tone: "draft", views: "—", leads: "—", date: "Edited 17 Oct" },
];
const enquiries = [
  { initials: "AS", name: "Aarav S.", interest: "3 BHK apartment · Baner", when: "Today, 10:42 am", state: "New" },
  { initials: "NK", name: "Nisha K.", interest: "3 BHK apartment · Baner", when: "Yesterday, 5:18 pm", state: "Contacted" },
  { initials: "RM", name: "Rohan M.", interest: "3 BHK apartment · Baner", when: "21 Oct, 1:06 pm", state: "Visit requested" },
];

export default function DashboardPage() {
  const [tab, setTab] = useState("Overview");
  const [message, setMessage] = useState("");
  const show = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(""), 2800); };
  return <main className="dashboard-page">
    <header className="site-header"><a className="brand" href="/" aria-label="PremiumProperty home"><span className="brand-mark">P<span>.</span></span><span className="brand-name">Premium<span>Property</span></span></a><nav className="desktop-nav"><a className="nav-link" href="/">Explore homes</a><span className="nav-link active">My workspace</span></nav><div className="header-actions"><a className="text-button dashboard-back" href="/">Back to homes</a><span className="avatar-small">AJ</span></div></header>
    <div className="dashboard-wrap"><aside className="dash-sidebar"><div className="dash-user"><div className="avatar-large">AJ</div><div><strong>Arjun Joshi</strong><span>Property owner</span></div></div><div className="dash-sidebar-label">WORKSPACE</div>{["Overview", "My listings", "Enquiries", "Site visits", "Profile"].map((x) => <button key={x} className={`dash-nav ${tab === x ? "dash-nav-active" : ""}`} onClick={() => setTab(x)}>{x === "Overview" ? "◫" : x === "My listings" ? "⌂" : x === "Enquiries" ? "✉" : x === "Site visits" ? "▦" : "○"}<span>{x}</span>{x === "Enquiries" && <i>3</i>}</button>)}<div className="dash-sidebar-bottom"><span>Need a hand?</span><button onClick={() => show("Our team will be available once support is connected.")}>Contact support <span>→</span></button></div></aside>
      <section className="dash-main"><div className="dash-welcome"><div><span className="eyebrow">YOUR PROPERTY WORKSPACE</span><h1>{tab === "Overview" ? "Good morning, Arjun." : tab}</h1><p>Keep your listings moving and every conversation in view.</p></div><a className="button button-teal" href="/#top">＋ List a property</a></div><div className="dash-demo-banner"><span className="dash-demo-dot"/><span><strong>Property workspace</strong> · All listings, leads and activity below are example activity.</span></div>
        <div className="dash-stats"><article><span>ACTIVE LISTINGS</span><strong>1</strong><small>1 more in progress</small></article><article><span>PROPERTY VIEWS</span><strong>248</strong><small>Across your published listing</small></article><article><span>NEW ENQUIRIES</span><strong>3</strong><small>1 waiting for your reply</small></article><article><span>SITE VISITS</span><strong>1</strong><small>Next request: 26 Oct</small></article></div>
        <div className="dash-section-heading"><div><h2>Your listings</h2><p>A quick view of what’s moving.</p></div><button onClick={() => setTab("My listings")}>All listings <span>→</span></button></div><div className="dash-table-wrap"><table className="dash-table"><thead><tr><th>PROPERTY</th><th>STATUS</th><th>VIEWS</th><th>ENQUIRIES</th><th>LAST UPDATED</th><th></th></tr></thead><tbody>{listings.map((x) => <tr key={x.title}><td><strong>{x.title}</strong><small>Residential · For sale</small></td><td><span className={`status-pill ${x.tone}`}>{x.state}</span></td><td>{x.views}</td><td>{x.leads}</td><td>{x.date}</td><td><button className="row-menu" aria-label={`More actions for ${x.title}`} onClick={() => show("Listing actions are not connected to listing management yet.")}>•••</button></td></tr>)}</tbody></table></div>
        <div className="dash-lower-grid"><section className="dash-panel"><div className="dash-section-heading"><div><h2>Recent enquiries</h2><p>Follow up when you’re ready.</p></div><button onClick={() => setTab("Enquiries")}>View all <span>→</span></button></div>{enquiries.map((x) => <article className="enquiry-row" key={x.name}><div className="enquiry-avatar">{x.initials}</div><div className="enquiry-details"><strong>{x.name}</strong><span>{x.interest}</span><small>{x.when}</small></div><span className={`enquiry-state ${x.state === "New" ? "state-new" : ""}`}>{x.state}</span></article>)}</section><section className="dash-panel visit-panel"><div className="dash-section-heading"><div><h2>Next site visit</h2><p>Keep the details close at hand.</p></div><button onClick={() => setTab("Site visits")}>All visits <span>→</span></button></div><div className="visit-card"><div className="visit-date"><strong>26</strong><span>OCT</span></div><div><strong>Visit requested</strong><p>3 BHK apartment · Baner</p><small>With Rohan M. · 11:30 am</small></div></div><button className="visit-action" onClick={() => show("Visit confirmation requires a connected account and notification service.")}>Review visit request <span>→</span></button></section></div>
        <div className="dash-tip"><span>✦</span><div><strong>A little more detail helps the right people find you.</strong><p>Add clear photos and complete your property facts to make your listing more useful.</p></div><button onClick={() => show("Edit property details in the connected listing workflow.")}>Improve a listing →</button></div>
      </section></div>
    {message && <div className="toast" role="status">{message}</div>}
  </main>;
}

