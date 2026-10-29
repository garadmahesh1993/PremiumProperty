"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { demoListings, FAVORITES_KEY, SAVED_SEARCHES_KEY, readStoredIds } from "@/lib/demo-data";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ListingCard } from "@/components/property/ListingCard";

type Profile = { name?: string; email?: string; phone?: string; verified?: boolean };
type SavedSearch = { id: string; title: string; query: Record<string, string | boolean>; createdAt: string };
type ActivityTab = "contacted" | "seen" | "saved" | "searches";
const ACTIVITY_KEYS: Record<Exclude<ActivityTab, "saved" | "searches">, string> = { contacted: "premiumproperty-contacted", seen: "premiumproperty-seen" };
const activityOptions: { id: ActivityTab; label: string; icon: string }[] = [
  { id: "contacted", label: "Contacted properties", icon: "↗" },
  { id: "seen", label: "Seen properties", icon: "⌕" },
  { id: "saved", label: "Saved properties", icon: "♡" },
  { id: "searches", label: "Recent searches", icon: "◷" },
];

function readArray(key: string): string[] {
  try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value.map(String) : []; } catch { return []; }
}

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [active, setActive] = useState<ActivityTab>("saved");
  const [activity, setActivity] = useState<Record<ActivityTab, string[]>>({ contacted: [], seen: [], saved: [], searches: [] });
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [recentSearches, setRecentSearches] = useState<SavedSearch[]>([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const refresh = () => {
      try { const savedProfile = JSON.parse(localStorage.getItem("pp-account-profile") || "null"); setProfile(savedProfile); setEditName(savedProfile?.name || ""); setEditEmail(savedProfile?.email || ""); } catch { setProfile(null); }
      const savedIds = readStoredIds(FAVORITES_KEY);
      setActivity({ contacted: readArray(ACTIVITY_KEYS.contacted), seen: readArray(ACTIVITY_KEYS.seen), saved: savedIds, searches: [] });
      try { setSearches(JSON.parse(localStorage.getItem(SAVED_SEARCHES_KEY) || "[]")); } catch { setSearches([]); }
      try { const recent = JSON.parse(localStorage.getItem("premiumproperty-recent-searches") || "[]"); setRecentSearches(Array.isArray(recent) ? recent : []); } catch { setRecentSearches([]); }
    };
    refresh();
    window.addEventListener("pp-favorites", refresh);
    window.addEventListener("pp-account-activity", refresh);
    return () => { window.removeEventListener("pp-favorites", refresh); window.removeEventListener("pp-account-activity", refresh); };
  }, []);

  const items = useMemo(() => demoListings.filter((item) => activity[active].includes(item.id)), [activity, active]);
  const count = (tab: ActivityTab) => tab === "searches" ? recentSearches.length : activity[tab].length;

  function saveProfile() {
    if (!profile) return;
    const updated = { ...profile, name: editName.trim(), email: editEmail.trim() };
    try { localStorage.setItem("pp-account-profile", JSON.stringify(updated)); setProfile(updated); setEditing(false); setNotice("Your profile was updated on this browser."); }
    catch { setNotice("Could not save your changes in this browser."); }
  }

  function logOut() {
    localStorage.removeItem("pp-account-profile");
    window.location.href = "/login";
  }

  function removeSearch(id: string) {
    const next = searches.filter((search) => search.id !== id);
    setSearches(next);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(next));
  }

  return <><SiteHeader/><main id="main-content" className="route-page account-page">
    <div className="account-overview">
      <section className="account-profile-card">
        <div className="account-avatar" aria-hidden="true">{(profile?.name || "P").trim().charAt(0).toUpperCase()}</div>
        <div className="account-profile-copy">
          {profile?.verified ? <><span className="eyebrow">YOUR ACCOUNT</span><h1>Hello{profile.name ? `, ${profile.name}` : " there"}!</h1><div className="account-contact-lines">{profile.email && <span>{profile.email}</span>}{profile.phone && <span>+91 {profile.phone}</span>}<Link className="account-upgrade-link" href="/services#listing-packages">✦ Explore property services →</Link></div></> : <><span className="eyebrow">YOUR PREMIUMPROPERTY ACCOUNT</span><h1>Welcome to your account</h1><p>Sign in to manage your profile and property activity.</p></>}
        </div>
        {profile?.verified ? <button className="account-edit-button" onClick={() => { setEditing(!editing); setNotice(""); }}>{editing ? "Cancel" : "Edit profile"}</button> : <Link className="account-edit-button" href="/login">Log in</Link>}
        {editing && <div className="account-edit-form"><label>Name<input value={editName} onChange={(event) => setEditName(event.target.value)} autoComplete="name"/></label><label>Email<input type="email" value={editEmail} onChange={(event) => setEditEmail(event.target.value)} autoComplete="email"/></label><button className="button button-teal" onClick={saveProfile}>Save changes</button></div>}
      </section>
      <Link className="account-owner-banner" href="/post-property"><span className="account-owner-art" aria-hidden="true">⌂</span><span className="account-owner-copy"><small>FOR PROPERTY OWNERS</small><strong>Looking to sell or rent your property?</strong><b>Post property for free <span aria-hidden="true">→</span></b></span></Link>
    </div>

    <section className="account-activity">
      <div className="account-section-title"><div><span className="eyebrow">YOUR PROPERTY JOURNEY</span><h2>My activity</h2></div><Link href="/explore">Start a new search →</Link></div>
      <div className="activity-tabs" role="tablist" aria-label="Property activity">
        {activityOptions.map((option) => <button key={option.id} role="tab" aria-selected={active === option.id} className={active === option.id ? "active" : ""} onClick={() => setActive(option.id)}><span className="activity-icon" aria-hidden="true">{option.icon}</span><span>{option.label}</span><b>{String(count(option.id)).padStart(2, "0")}</b></button>)}
      </div>
      {active === "searches" ? <section className="account-activity-results" role="tabpanel" aria-label="Recent searches">
        {recentSearches.length ? <div className="saved-search-list">{recentSearches.map((search) => <article key={search.id}><div><strong>{search.title}</strong><small>Searched {search.createdAt}</small></div><Link href={`/explore?${new URLSearchParams(Object.entries(search.query).filter(([, value]) => value !== false && value !== "").map(([key, value]) => [key, String(value)]))}`}>Open search →</Link></article>)}</div> : <ActivityEmpty text="Your recent searches will appear here when you search for a place."/>}{searches.length > 0 && <div className="account-saved-searches"><h3>Saved searches</h3><div className="saved-search-list">{searches.map((search) => <article key={search.id}><div><strong>{search.title}</strong><small>Saved {search.createdAt}</small></div><Link href={`/explore?${new URLSearchParams(Object.entries(search.query).filter(([, value]) => value !== false && value !== "").map(([key, value]) => [key, String(value)]))}`}>Open search →</Link><button onClick={() => removeSearch(search.id)}>Remove</button></article>)}</div></div>}
      </section> : <section className="account-activity-results" role="tabpanel" aria-label={activityOptions.find((option) => option.id === active)?.label}>
        {items.length ? <div className="listing-grid">{items.map((item) => <ListingCard item={item} key={item.id}/>)}</div> : <ActivityEmpty text={active === "saved" ? "Save homes you like to compare them here." : active === "seen" ? "Properties you open will appear here for easy access." : "Properties you contact will be collected here."}/>}
      </section>}
    </section>

    <section className="account-links-section"><span className="eyebrow">ACCOUNT & SUPPORT</span><div className="account-links-grid">
      <Link href="/explore"><span aria-hidden="true">◇</span>Explore property listings<i>›</i></Link>
      <Link href="/contact?topic=transactions"><span aria-hidden="true">▤</span>My transactions<i>›</i></Link>
      <Link href="/contact?topic=reviews"><span aria-hidden="true">☆</span>My reviews<i>›</i></Link>
      <Link href="/contact?topic=alerts"><span aria-hidden="true">♧</span>Unsubscribe alerts<i>›</i></Link>
      <Link href="/contact?topic=fraud"><span aria-hidden="true">⚑</span>Report a concern<i>›</i></Link>
      <Link className="account-help-link" href="/contact"><span aria-hidden="true">?</span>Visit help centre<i>›</i></Link>
      {profile?.verified && <button className="account-logout-link" onClick={logOut}><span aria-hidden="true">↪</span>Log out<i>›</i></button>}
    </div></section>
    <p className="account-local-note">Your profile, shortlist and activity are stored in this browser. Support, reviews, alerts and transactions open the relevant information pages; online account services are not connected in this preview.</p>
    {notice && <div className="account-notice" role="status">{notice}</div>}
  </main><SiteFooter/></>;
}

function ActivityEmpty({ text }: { text: string }) {
  return <div className="account-empty"><div aria-hidden="true">⌂</div><p>{text}</p><Link className="button button-teal" href="/explore">Start a new search →</Link></div>;
}
