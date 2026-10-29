import Link from "next/link";
import type { DemoListing } from "@/lib/demo-data";
import { SaveButton } from "./SaveButton";

export function ListingCard({ item }: { item: DemoListing }) {
  return (
    <article className="listing-card">
      <Link className="listing-image" href={`/property/${item.id}`} aria-label={`View ${item.title}`}>
        <img src={item.image} alt={item.title} loading="lazy" />
      </Link>
      <SaveButton id={item.id} />
      <div className="listing-info">
        <div className="listing-label-line"><span>PROPERTY LISTING</span><span>{item.badge}</span></div>
        <div className="listing-price-row"><strong>{item.priceLabel}</strong><span>{item.purpose === "buy" ? "For sale" : "For rent"}</span></div>
        <Link className="listing-title" href={`/property/${item.id}`}>{item.title}</Link>
        <p className="listing-location">⌖ {item.locality}, {item.city}</p>
        <div className="listing-specs">
          <span>▱ {item.bedrooms ? `${item.bedrooms} Beds` : item.kind}</span>
          <span>▢ {item.bathrooms ? `${item.bathrooms} Baths` : "—"}</span>
          <span>⌗ {item.area.toLocaleString("en-IN")} sq.ft.</span>
        </div>
      </div>
    </article>
  );
}


