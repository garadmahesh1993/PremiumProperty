"use client";
import Link from "next/link";
import { type DemoListing } from "@/lib/demo-data";
import { Photo } from "./Photo";
import { Icon } from "./Icon";
import { useSocial } from "./SocialProvider";
export function PropertyTile({ item }: { item: DemoListing }) {
  const { saved, toggleSave } = useSocial();
  const isSaved = saved.includes(item.id);
  return (
    <article className="sp-tile" aria-label={item.title}>
      <div className="sp-tile-media">
        <Link href={`/property/${item.id}`} aria-label={`View ${item.title}`}>
          <Photo
            src={item.image}
            alt={`${item.kind} in ${item.locality}, illustrative photo`}
            sizes="(max-width: 700px) 50vw, 33vw"
          />
        </Link>
        <span>{item.purpose === "buy" ? "Buy" : "Rent"}</span>
        <button
          className="sp-tile-save"
          type="button"
          aria-label={`${isSaved ? "Unsave" : "Save"} ${item.title}`}
          aria-pressed={isSaved}
          onClick={() => toggleSave(item.id)}
        >
          <Icon name="bookmark" size={19} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="sp-tile-copy">
        <strong>{item.priceLabel}</strong>
        <Link href={`/property/${item.id}`}>{item.title}</Link>
        <p>
          <Icon name="pin" size={13} />
          {item.locality}, {item.city}
        </p>
        <div>
          {item.bedrooms > 0 && <span>{item.bedrooms} BHK</span>}
          <span>{item.area.toLocaleString("en-IN")} sq.ft.</span>
        </div>
      </div>
    </article>
  );
}
