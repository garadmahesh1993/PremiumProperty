"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { demoListings, getListing, getListingGallery } from "@/lib/demo-data";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SaveButton } from "@/components/property/SaveButton";
import { ListingCard } from "@/components/property/ListingCard";

const supportEmail = "ajnovarealty@gmail.com";
const supportPhone = "+919607319219";

export function PropertyDetailExperience({ id }: { id: string }) {
  const item = getListing(id);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    try {
      const seen = JSON.parse(localStorage.getItem("premiumproperty-seen") || "[]");
      const ids = Array.isArray(seen) ? seen.map(String) : [];
      localStorage.setItem("premiumproperty-seen", JSON.stringify([id, ...ids.filter((savedId) => savedId !== id)].slice(0, 30)));
      window.dispatchEvent(new Event("pp-account-activity"));
    } catch { /* The property page still works if browser storage is unavailable. */ }
  }, [id]);

  if (!item) return <><SiteHeader/><main id="main-content" className="route-page empty-state"><h1>Listing not found</h1><p>This property may no longer be available.</p><Link className="button button-teal" href="/explore">Browse homes</Link></main><SiteFooter/></>;

  const gallery = getListingGallery(item);
  const previousPhoto = () => setGalleryIndex((index) => (index - 1 + gallery.length) % gallery.length);
  const nextPhoto = () => setGalleryIndex((index) => (index + 1) % gallery.length);
  const emailSubject = encodeURIComponent(`Property enquiry: ${item.title}`);
  const emailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(supportEmail)}&su=${emailSubject}`;
  const similar = demoListings.filter((listing) => listing.id !== item.id && listing.category === item.category).slice(0, 2);

  return <><SiteHeader/><main id="main-content" className="route-page property-page">
    <Link className="back-link" href="/explore">← Back to properties</Link>
    <section className="property-gallery" aria-label={`Illustrative photo gallery for ${item.title}`}>
      <img src={gallery[galleryIndex]} alt={`${item.kind} photo ${galleryIndex + 1} of ${gallery.length}: ${item.locality}, ${item.city}`} fetchPriority="high" decoding="async"/>
      <span className="demo-tag">SAMPLE PROPERTY</span>
      {gallery.length > 1 && <><div className="property-gallery-controls"><button type="button" aria-label="Previous property photo" onClick={previousPhoto}>‹</button><span aria-live="polite">{galleryIndex + 1} / {gallery.length}</span><button type="button" aria-label="Next property photo" onClick={nextPhoto}>›</button></div><div className="property-gallery-thumbnails">{gallery.map((photo, index) => <button type="button" key={photo} aria-label={`Show photo ${index + 1}`} aria-pressed={galleryIndex === index} className={galleryIndex === index ? "is-active" : ""} onClick={() => setGalleryIndex(index)}><img src={photo} alt="" loading="lazy" decoding="async"/></button>)}</div></>}
      <p className="property-gallery-caption">Illustrative photos · listing information is sample content</p>
    </section>
    <div className="property-layout"><article className="property-content">
      <span className="eyebrow">{item.kind} · {item.locality}, {item.city}</span><h1>{item.title}</h1>
      <div className="property-detail-price"><strong>{item.priceLabel}</strong><span>{item.purpose === "buy" ? "Asking price · for sale" : "Monthly rent"}</span></div>
      <p className="property-description">{item.description}</p>
      <h2>Property facts</h2><div className="property-facts"><span><b>{item.bedrooms || "—"}</b> Bedrooms</span><span><b>{item.bathrooms || "—"}</b> Bathrooms</span><span><b>{item.area.toLocaleString("en-IN")}</b> sq.ft.</span><span><b>{item.furnishing}</b> Furnishing</span></div>
      <h2>About this property</h2><p>{item.description} This fictional sample listing demonstrates the property experience. Verify property details independently before making a decision.</p>
      <h2>Location</h2><div className="location-placeholder"><span aria-hidden="true">⌖</span><div><strong>{item.locality}, {item.city}</strong><p>The location preview is illustrative and does not show a precise address.</p></div></div>
      {similar.length > 0 && <><h2>Similar properties</h2><div className="listing-grid">{similar.map((listing) => <ListingCard item={listing} key={listing.id}/>)}</div></>}
    </article><aside className="contact-card property-contact-card"><span>PROPERTY ENQUIRY</span><strong>{item.priceLabel}</strong><p>Ask AJ NOVA REALITY about this sample listing.</p><SaveButton id={item.id}/><a className="button button-orange" href={emailHref} target="_blank" rel="noreferrer" onClick={() => recordContact(id)}>Email about this property →</a><a className="button button-outline" href={`tel:${supportPhone}`} onClick={() => recordContact(id)}>Call +91 9607319219</a><small>This is sample listing content. No owner contact or availability is verified.</small></aside></div>
  </main><SiteFooter/></>;
}

function recordContact(id: string) {
  try {
    const existing = JSON.parse(localStorage.getItem("premiumproperty-contacted") || "[]");
    const ids = Array.isArray(existing) ? existing.map(String) : [];
    localStorage.setItem("premiumproperty-contacted", JSON.stringify([id, ...ids.filter((savedId) => savedId !== id)].slice(0, 30)));
    window.dispatchEvent(new Event("pp-account-activity"));
  } catch { /* Keep the contact action available if browser storage is unavailable. */ }
}
