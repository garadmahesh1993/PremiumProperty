"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { readRecentSearches, RECENT_SEARCHES_KEY, type RecentSearch } from "@/lib/social/history";
import { Icon } from "./Icon";
export function RecentSearches() {
  const [items, setItems] = useState<RecentSearch[]>([]);
  useEffect(() => {
    setItems(readRecentSearches().slice(0, 4));
  }, []);
  if (!items.length)
    return (
      <p className="sp-search-privacy">
        Search suggestions may use Google or OpenStreetMap services. Saved search history stays on
        this browser. <Link href="/privacy">Privacy</Link>
      </p>
    );
  return (
    <section className="sp-recent-searches" aria-label="Recent property searches">
      <div>
        <h3>Recent searches</h3>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.removeItem(RECENT_SEARCHES_KEY);
              setItems([]);
              window.dispatchEvent(new Event("pp-account-activity"));
            } catch {}
          }}
        >
          Clear recent
        </button>
      </div>
      {items.map((item) => (
        <Link key={item.id} href={`/explore?${new URLSearchParams(item.query)}`}>
          <Icon name="search" size={16} />
          <span>{item.query.city || item.query.q || item.title}</span>
          <Icon name="arrow" size={16} />
        </Link>
      ))}
      <p>
        Stored only on this browser. <Link href="/privacy">Privacy</Link>
      </p>
    </section>
  );
}
