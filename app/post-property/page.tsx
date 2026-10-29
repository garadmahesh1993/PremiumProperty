"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const steps = ["Property type", "Location", "Property details", "Pricing", "Photos", "Review"];

type PropertyDraft = { type: string; purpose: string; city: string; area: string; beds: string; price: string; title: string };
const emptyDraft: PropertyDraft = { type: "Apartment", purpose: "Sell", city: "Pune", area: "", beds: "2", price: "", title: "" };

export default function PostProperty() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [access, setAccess] = useState<"checking" | "allowed">("checking");
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<PropertyDraft>(emptyDraft);
  const [photos, setPhotos] = useState(0);

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("pp-account-profile") || "null");
      if (profile?.verified === true) {
        setAccess("allowed");
        setMounted(true);
        const draft = JSON.parse(localStorage.getItem("pp-property-draft") || "null");
        if (draft && typeof draft === "object") setForm({ ...emptyDraft, ...draft });
        return;
      }
    } catch {
      // Invalid or unavailable local storage is treated as signed out.
    }
    router.replace(`/login?next=${encodeURIComponent("/post-property")}`);
    setMounted(true);
  }, [router]);

  function update(key: keyof PropertyDraft, value: string) {
    const next = { ...form, [key]: value };
    setForm(next);
    try { localStorage.setItem("pp-property-draft", JSON.stringify(next)); } catch { /* Keep editing in memory if storage is unavailable. */ }
  }

  // Match the server and first browser render; local account storage is checked after mount.
  if (!mounted || access !== "allowed") return <><SiteHeader/><main id="main-content" className="route-page narrow-page"><section className="form-panel" role="status" aria-live="polite">Opening your property workspace…</section></main><SiteFooter/></>;

  return <><SiteHeader/><main id="main-content" className="route-page narrow-page">
    <Link className="back-link" href="/">← Home</Link>
    <div className="route-title"><div><span className="eyebrow">OWNER WORKSPACE</span><h1>{done ? "Your listing draft is ready" : "Post a property"}</h1><p>{done ? "Your information was saved only in this browser." : "Create a property listing draft in a few guided steps."}</p></div></div>
    {done ? <section className="success-panel"><span>✓</span><h2>{form.title || form.type}</h2><p>{form.type} · {form.city} · {form.price ? `₹${form.price}` : "Price not set"}</p><Link className="button button-teal" href="/dashboard">Open workspace →</Link></section> : <>
      <div className="stepper" aria-label={`Step ${step + 1} of ${steps.length}`}>{steps.map((label, index) => <div className={index <= step ? "step active" : "step"} key={label}><i>{index + 1}</i><span>{label}</span></div>)}</div>
      <section className="form-panel"><span className="eyebrow">STEP {step + 1} OF {steps.length}</span><h2>{steps[step]}</h2>
        {step === 0 && <div className="form-grid"><label>Listing type<select value={form.type} onChange={(event) => update("type", event.target.value)}>{["Apartment", "Independent house", "Villa", "Office space", "PG / Co-living", "Plot"].map((type) => <option key={type}>{type}</option>)}</select></label><label>Offering<select value={form.purpose} onChange={(event) => update("purpose", event.target.value)}><option>Sell</option><option>Rent</option></select></label></div>}
        {step === 1 && <div className="form-grid"><label>City<input value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="City"/></label><label>Locality<input value={form.area} onChange={(event) => update("area", event.target.value)} placeholder="Neighbourhood"/></label></div>}
        {step === 2 && <div className="form-grid"><label>Bedrooms<select value={form.beds} onChange={(event) => update("beds", event.target.value)}>{["Studio", "1", "2", "3", "4", "5"].map((bedroom) => <option key={bedroom}>{bedroom}</option>)}</select></label><label>Listing title<input value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="A short description"/></label></div>}
        {step === 3 && <div className="form-grid"><label>Expected price (₹)<input type="number" min="0" value={form.price} onChange={(event) => update("price", event.target.value)} placeholder="e.g. 8500000"/></label><label>Price type<select aria-label="Price frequency"><option>Asking price</option><option>Monthly rent</option></select></label></div>}
        {step === 4 && <div className="upload-box"><p>Add photos to your local property draft</p><input type="file" accept="image/*" multiple aria-label="Choose property photos" onChange={(event) => setPhotos(event.target.files?.length || 0)}/><small>{photos ? `${photos} file(s) selected in this browser.` : "Selected photos are not uploaded or stored."}</small></div>}
        {step === 5 && <div className="review-box"><h3>{form.title || form.type}</h3><p>{form.purpose} · {form.area || form.city}, {form.city}</p><p>{form.beds} bedrooms · {form.price ? `₹${form.price}` : "Price not provided"}</p><p>This preview saves a local draft only. It does not publish a property or send it to a listing service.</p></div>}
        <div className="wizard-actions"><button type="button" className="button button-outline" disabled={!step} onClick={() => setStep((current) => current - 1)}>← Previous</button>{step < steps.length - 1 ? <button type="button" className="button button-orange" onClick={() => setStep((current) => current + 1)}>Continue →</button> : <button type="button" className="button button-orange" onClick={() => { localStorage.setItem("pp-demo-listing", JSON.stringify(form)); setDone(true); }}>Save listing draft →</button>}</div>
      </section>
    </>}
  </main><SiteFooter/></>;
}
