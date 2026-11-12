"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { demoListings, getListing } from "@/lib/demo-data";
import { SocialShell } from "@/components/social/SocialShell";
import { MediaGallery } from "@/components/social/MediaGallery";
import { PropertyTile } from "@/components/social/PropertyTile";
import { Icon } from "@/components/social/Icon";
import { useSocial } from "@/components/social/SocialProvider";
import { shareProperty } from "@/components/social/PropertyPost";
export function PropertyDetailExperience({ id }: { id: string }) {
  const item = getListing(id);
  const [back, setBack] = useState("/");
  const { saved, toggleSave, addToCollection, notify } = useSocial();
  useEffect(() => {
    try {
      const previous = sessionStorage.getItem("pp-social-return");
      if (
        previous &&
        /^\/(?:\?|$|explore(?:\?|$)|buy(?:\?|$)|rent(?:\?|$)|commercial(?:\?|$)|pg(?:\?|$)|plots(?:\?|$))/.test(
          previous,
        )
      )
        setBack(previous);
      const seen = JSON.parse(localStorage.getItem("premiumproperty-seen") || "[]");
      localStorage.setItem(
        "premiumproperty-seen",
        JSON.stringify(
          [id, ...(Array.isArray(seen) ? seen : []).filter((value) => value !== id)].slice(0, 30),
        ),
      );
      window.dispatchEvent(new Event("pp-account-activity"));
    } catch {}
  }, [id]);
  if (!item)
    return (
      <SocialShell rail={false}>
        <div className="sp-empty">
          <Icon name="home" size={35} />
          <h1>Property not found</h1>
          <p>Explore our sample collection to find another place.</p>
          <Link href="/explore" className="sp-button">
            Explore properties
          </Link>
        </div>
      </SocialShell>
    );
  const isSaved = saved.includes(id);
  const email = `https://mail.google.com/mail/?view=cm&fs=1&to=ajnovarealty%40gmail.com&su=${encodeURIComponent(`Property enquiry: ${item.title} (${item.id})`)}`;
  const similar = demoListings
    .filter(
      (value) =>
        value.id !== id && value.category === item.category && value.purpose === item.purpose,
    )
    .slice(0, 3);
  return (
    <SocialShell rail={false}>
      <div className="sp-detail">
        <div className="sp-detail-back">
          <Link href={back} className="sp-text-link">
            <Icon name="back" size={16} />
            Back to discovery
          </Link>
          <span>Sample property · {item.id.toUpperCase()}</span>
        </div>
        <div className="sp-detail-title">
          <div>
            <span className="sp-label">
              {item.kind} · {item.purpose === "buy" ? "For sale" : "For rent"}
            </span>
            <h1>{item.title}</h1>
            <p>
              <Icon name="pin" size={17} />
              {item.locality}, {item.city}
            </p>
          </div>
          <div>
            <strong>{item.priceLabel}</strong>
            <span>{item.purpose === "buy" ? "Total asking price" : "Monthly rent"}</span>
          </div>
        </div>
        <div className="sp-detail-gallery">
          <MediaGallery item={item} eager />
        </div>
        <div className="sp-detail-photo-note">
          <span>Illustrative photography · Not a live property offer</span>
          <div>
            <button type="button" onClick={() => toggleSave(id)} aria-pressed={isSaved}>
              <Icon name="bookmark" size={18} fill={isSaved ? "currentColor" : "none"} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button type="button" onClick={() => shareProperty(item, notify)}>
              <Icon name="share" size={18} />
              Share
            </button>
            <button type="button" onClick={() => addToCollection(id)}>
              <Icon name="plus" size={18} />
              Collection
            </button>
          </div>
        </div>
        <div className="sp-detail-layout">
          <article>
            <div className="sp-detail-facts">
              {item.bedrooms > 0 && (
                <div>
                  <Icon name="bed" size={24} />
                  <span>
                    <strong>{item.bedrooms} BHK</strong>Bedrooms
                  </span>
                </div>
              )}
              {item.bathrooms > 0 && (
                <div>
                  <Icon name="home" size={23} />
                  <span>
                    <strong>{item.bathrooms} baths</strong>Bathrooms
                  </span>
                </div>
              )}
              <div>
                <Icon name="area" size={24} />
                <span>
                  <strong>{item.area.toLocaleString("en-IN")}</strong>Square feet
                </span>
              </div>
            </div>
            <section>
              <h2>About this space</h2>
              <p>{item.description}</p>
            </section>
            <section>
              <h2>The property details</h2>
              <dl className="sp-detail-data">
                <div>
                  <dt>Property type</dt>
                  <dd>{item.kind}</dd>
                </div>
                <div>
                  <dt>Furnishing</dt>
                  <dd>{item.furnishing}</dd>
                </div>
                <div>
                  <dt>Listing purpose</dt>
                  <dd>{item.purpose === "buy" ? "For sale" : "For rent"}</dd>
                </div>
                <div>
                  <dt>Listing label (sample)</dt>
                  <dd>{item.badge}</dd>
                </div>
                <div>
                  <dt>Availability</dt>
                  <dd>Not verified</dd>
                </div>
                <div>
                  <dt>Posting date</dt>
                  <dd>Not provided</dd>
                </div>
              </dl>
            </section>
            <section>
              <h2>Amenities</h2>
              <p>Amenities have not been provided in the current sample listing data.</p>
            </section>
            <section>
              <h2>Location</h2>
              <div className="sp-detail-location">
                <Icon name="pin" size={30} />
                <div>
                  <strong>
                    {item.locality}, {item.city}
                  </strong>
                  <p>A precise address has not been provided.</p>
                  <Link
                    className="sp-text-link"
                    href={`/explore?city=${encodeURIComponent(item.city)}&q=${encodeURIComponent(item.locality)}`}
                  >
                    Explore this neighbourhood <Icon name="arrow" size={16} />
                  </Link>
                </div>
              </div>
            </section>
          </article>
          <aside className="sp-detail-contact" id="inquiry">
            <span className="sp-label">A conversation about your next move</span>
            <h2>Want to know more?</h2>
            <Link className="sp-contact-identity" href="/profiles/aj-nova-reality">
              <span className="sp-avatar sp-team-avatar">AN</span>
              <span>
                <strong>AJ NOVA REALITY</strong>
                <small>Premium Property platform team</small>
              </span>
              <Icon name="arrow" size={15} />
            </Link>
            <p>Contact the team about this sample property or for help with your search.</p>
            <a
              className="sp-button"
              href={email}
              target="_blank"
              rel="noreferrer"
              onClick={() => recordContact(id)}
            >
              <Icon name="mail" size={18} />
              Enquire by email <Icon name="arrow" size={16} />
            </a>
            <a
              className="sp-button sp-button-light"
              href="tel:+919607319219"
              onClick={() => recordContact(id)}
            >
              <Icon name="phone" size={17} />
              +91 96073 19219
            </a>
            <small>
              Opens Gmail in a new tab or your phone app. This website does not send messages, book
              visits or collect payments. Owner identity and availability are not verified.
            </small>
          </aside>
        </div>
        <div className="sp-section-row">
          <h2>More spaces, more possibilities</h2>
          <Link href="/explore" className="sp-text-link">
            Explore all <Icon name="arrow" size={16} />
          </Link>
        </div>
        {similar.length ? (
          <div className="sp-visual-grid">
            {similar.map((value) => (
              <PropertyTile item={value} key={value.id} />
            ))}
          </div>
        ) : (
          <p className="sp-muted">No other sample properties in this category yet.</p>
        )}
      </div>
    </SocialShell>
  );
}
function recordContact(id: string) {
  try {
    const current = JSON.parse(localStorage.getItem("premiumproperty-contacted") || "[]");
    localStorage.setItem(
      "premiumproperty-contacted",
      JSON.stringify(
        [id, ...(Array.isArray(current) ? current : []).filter((value) => value !== id)].slice(
          0,
          30,
        ),
      ),
    );
    window.dispatchEvent(new Event("pp-account-activity"));
  } catch {}
}
