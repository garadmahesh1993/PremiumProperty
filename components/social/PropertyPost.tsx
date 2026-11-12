"use client";
import Link from "next/link";
import { type DemoListing } from "@/lib/demo-data";
import { MediaGallery } from "./MediaGallery";
import { Icon } from "./Icon";
import { useSocial } from "./SocialProvider";
export async function shareProperty(item: DemoListing, notify: (text: string) => void) {
  const url = `${window.location.origin}/property/${item.id}`;
  try {
    if (navigator.share) await navigator.share({ title: item.title, url });
    else {
      await navigator.clipboard.writeText(url);
      notify("Property link copied.");
    }
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "AbortError"))
      notify("To share this property, copy its address from the details page.");
  }
}
export function PropertyPost({ item, eager = false }: { item: DemoListing; eager?: boolean }) {
  const { saved, toggleSave, addToCollection, notify } = useSocial();
  const isSaved = saved.includes(item.id);
  return (
    <article className="sp-post" aria-label={item.title}>
      <header className="sp-post-header">
        <Link href="/profiles/premium-property" className="sp-post-author">
          <span className="sp-avatar sp-editorial-avatar">
            <Icon name="home" size={23} />
          </span>
          <span>
            <strong>
              Premium Property <span className="sp-collection-label">Collection</span>
            </strong>
            <small>
              <Icon name="pin" size={12} />
              {item.locality}, {item.city}
            </small>
          </span>
        </Link>
        <details className="sp-post-menu">
          <summary aria-label={`More options for ${item.title}`}>
            <Icon name="more" />
          </summary>
          <div>
            <button
              type="button"
              onClick={(event) => {
                addToCollection(item.id);
                event.currentTarget.closest("details")?.removeAttribute("open");
              }}
            >
              <Icon name="bookmark" size={16} />
              Add to collection
            </button>
            <Link href={`/contact?topic=listing&id=${item.id}`}>
              Contact support <Icon name="arrow" size={15} />
            </Link>
            <span>Sample listing · date not provided</span>
          </div>
        </details>
      </header>
      <MediaGallery item={item} eager={eager} />
      <div className="sp-post-actions">
        <button
          type="button"
          className={isSaved ? "saved" : ""}
          onClick={() => toggleSave(item.id)}
          aria-pressed={isSaved}
          aria-label={`${isSaved ? "Unsave" : "Save"} ${item.title}`}
        >
          <Icon name="bookmark" fill={isSaved ? "currentColor" : "none"} />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </button>
        <button
          type="button"
          onClick={() => shareProperty(item, notify)}
          aria-label={`Share ${item.title}`}
        >
          <Icon name="share" size={21} />
          <span>Share</span>
        </button>
        <Link href={`/property/${item.id}#inquiry`}>
          <Icon name="message" size={22} />
          <span>Contact</span>
        </Link>
        <button
          type="button"
          className="sp-post-collection"
          onClick={() => addToCollection(item.id)}
          aria-label={`Add ${item.title} to a collection`}
        >
          <Icon name="plus" size={21} />
        </button>
      </div>
      <div className="sp-post-info">
        <div className="sp-post-price">
          <strong>{item.priceLabel}</strong>
          <span>{item.kind}</span>
        </div>
        <Link className="sp-post-title" href={`/property/${item.id}`}>
          {item.title}
        </Link>
        <div className="sp-post-specs">
          {item.bedrooms > 0 && (
            <span>
              <Icon name="bed" size={17} />
              {item.bedrooms} BHK
            </span>
          )}
          <span>
            <Icon name="area" size={17} />
            {item.area.toLocaleString("en-IN")} sq.ft.
          </span>
          <span>{item.furnishing}</span>
        </div>
        <div className="sp-post-bottom">
          <span>{item.city} · Sample property</span>
          <Link href={`/property/${item.id}`}>
            Take a closer look <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
