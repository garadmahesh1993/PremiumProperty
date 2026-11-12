"use client";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { demoListings } from "@/lib/demo-data";
import { PropertyPost } from "./PropertyPost";
import { Photo } from "./Photo";
import { Icon } from "./Icon";
const tabs = [
  { label: "For you", key: "" },
  { label: "Buy", key: "buy" },
  { label: "Rent", key: "rent" },
  { label: "Commercial", key: "commercial" },
  { label: "PG / Co-living", key: "pg" },
  { label: "Plots", key: "plot" },
];
const stories = [
  demoListings[0],
  demoListings[1],
  demoListings[5],
  demoListings[3],
  demoListings[2],
  demoListings[8],
];
function Feed() {
  const params = useSearchParams(),
    router = useRouter();
  useEffect(() => {
    try {
      sessionStorage.setItem("pp-social-return", "/" + (params.size ? `?${params}` : ""));
    } catch {}
  }, [params]);
  const tab = params.get("feed") || "";
  const number = Number(params.get("page") || 1);
  const filtered = demoListings.filter(
    (item) =>
      !tab || (tab === "buy" || tab === "rent" ? item.purpose === tab : item.category === tab),
  );
  const total = Math.max(1, Math.ceil(filtered.length / 4));
  const page = Math.min(total, Math.max(1, Number.isFinite(number) ? Math.floor(number) : 1));
  const items = filtered.slice((page - 1) * 4, page * 4);
  function navigate(nextTab: string, nextPage = 1) {
    const query = new URLSearchParams();
    if (nextTab) query.set("feed", nextTab);
    if (nextPage > 1) query.set("page", String(nextPage));
    router.push(`/${query.size ? `?${query}` : ""}`, { scroll: false });
    if (nextPage !== page)
      document.getElementById("feed-posts")?.scrollIntoView({ block: "start" });
  }
  return (
    <>
      <div className="sp-feed-heading">
        <div>
          <h1>
            Your next move starts here<span>.</span>
          </h1>
          <p>Good spaces. New perspectives. A place for you.</p>
        </div>
        <Link className="sp-feed-filter" href="/explore" aria-label="Search and filter properties">
          <Icon name="filter" size={20} />
        </Link>
      </div>
      <section className="sp-stories" aria-label="Explore neighbourhoods">
        <Link className="sp-story sp-story-create" href="/post-property">
          <span>
            <Icon name="plus" size={29} />
          </span>
          <strong>Your property</strong>
        </Link>
        {stories.map((item) => (
          <Link
            className="sp-story"
            key={item.id}
            href={`/explore?city=${encodeURIComponent(item.city)}&q=${encodeURIComponent(item.locality)}`}
          >
            <span>
              <Photo src={item.image} alt="" sizes="80px" />
            </span>
            <strong>{item.locality}</strong>
          </Link>
        ))}
      </section>
      <div className="sp-feed-tabs" role="group" aria-label="Filter property feed">
        {tabs.map((item) => (
          <button
            type="button"
            key={item.key}
            className={tab === item.key ? "active" : ""}
            aria-pressed={tab === item.key}
            onClick={() => navigate(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div id="feed-posts" className="sp-posts">
        {items.map((item, index) => (
          <PropertyPost item={item} key={item.id} eager={index === 0} />
        ))}
      </div>
      <nav className="sp-pagination" aria-label="Feed pages">
        <button
          type="button"
          className="sp-button sp-button-light"
          disabled={page === 1}
          onClick={() => navigate(tab, page - 1)}
        >
          <Icon name="back" size={17} />
          Previous
        </button>
        <span>
          Page {page} of {total}
        </span>
        <button
          type="button"
          className="sp-button"
          disabled={page === total}
          onClick={() => navigate(tab, page + 1)}
        >
          Next spaces
          <Icon name="arrow" size={17} />
        </button>
      </nav>
      <p className="sp-feed-end">
        You’re exploring our sample collection. No live availability or engagement counts.
      </p>
    </>
  );
}
export function SocialFeed() {
  return (
    <Suspense
      fallback={
        <div className="sp-feed-skeleton" role="status" aria-label="Loading property feed">
          <span />
          <div />
          <div />
        </div>
      }
    >
      <Feed />
    </Suspense>
  );
}
