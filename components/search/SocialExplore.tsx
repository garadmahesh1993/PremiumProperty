"use client";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { demoListings, demoProjects, SAVED_SEARCHES_KEY } from "@/lib/demo-data";
import { SocialShell } from "@/components/social/SocialShell";
import { PropertyTile } from "@/components/social/PropertyTile";
import { Photo } from "@/components/social/Photo";
import { Icon } from "@/components/social/Icon";
import { Modal } from "@/components/social/Modal";
import { useSocial } from "@/components/social/SocialProvider";
import { filterProperties, parseFilters, modeDefaults } from "@/lib/social/search";

export type SearchMode = "buy" | "rent" | "commercial" | "pg" | "plots";
const modes = {
  buy: { purpose: "buy", category: "residential" },
  rent: { purpose: "rent", category: "residential" },
  commercial: { purpose: "buy", category: "commercial" },
  pg: { purpose: "rent", category: "pg" },
  plots: { purpose: "buy", category: "plot" },
};
const labels: Record<string, string> = {
  purpose: "Offering",
  category: "Category",
  kind: "Type",
  city: "Location",
  q: "Search",
  bed: "Min. bedrooms",
  bhk: "BHK",
  min: "Min. price",
  max: "Max. price",
  minArea: "Min. area",
  maxArea: "Max. area",
  furn: "Furnishing",
  verified: "Sample flag",
};
const categories = [
  { label: "All spaces", value: "" },
  { label: "Apartments", value: "Apartment" },
  { label: "Villas", value: "Villa" },
  { label: "Independent homes", value: "Independent house" },
  { label: "Commercial", value: "commercial" },
  { label: "PG / Co-living", value: "pg" },
  { label: "Plots", value: "plot" },
];
type SearchRecord = { id: string; title: string; query: Record<string, string>; createdAt: string };
function readSearches(key: string): SearchRecord[] {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data)
      ? data
          .filter((x) => x && typeof x.title === "string" && x.query && typeof x.query === "object")
          .slice(0, 12)
      : [];
  } catch {
    return [];
  }
}

function Discovery({ initialMode = "" }: { initialMode?: SearchMode | "" }) {
  const params = useSearchParams(),
    router = useRouter(),
    pathname = usePathname();
  const { notify } = useSocial();
  const [drawer, setDrawer] = useState(false),
    [map, setMap] = useState(false),
    [text, setText] = useState(params.get("q") || ""),
    [recent, setRecent] = useState<SearchRecord[]>([]);
  const base = initialMode ? modes[initialMode] : { purpose: "", category: "" };
  const value = (key: string) =>
    params.get(key) ?? (key === "purpose" ? base.purpose : key === "category" ? base.category : "");
  useEffect(() => setText(params.get("q") || ""), [params]);
  useEffect(() => setRecent(readSearches("premiumproperty-recent-searches")), []);
  function change(values: Record<string, string>, reset = true) {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, val]) => {
      if (val || key === "purpose" || key === "category") next.set(key, val);
      else next.delete(key);
    });
    if (reset) next.delete("page");
    router.push(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  }
  function clear() {
    setText("");
    router.push(pathname, { scroll: false });
  }
  function storeSearch(key: string) {
    try {
      const query: Record<string, string> = {
        ...base,
        ...Object.fromEntries(params),
        q: text.trim(),
      };
      const record = {
        id: crypto.randomUUID(),
        title:
          [query.q, query.city, query.purpose, query.category].filter(Boolean).join(" · ") ||
          "All spaces",
        query,
        createdAt: new Date().toLocaleDateString(),
      };
      const next = [record, ...readSearches(key)].slice(0, 12);
      localStorage.setItem(key, JSON.stringify(next));
      if (key === "premiumproperty-recent-searches") setRecent(next);
      window.dispatchEvent(new Event("pp-account-activity"));
      return true;
    } catch {
      notify("Search could not be saved. Browser storage is unavailable.");
      return false;
    }
  }
  function search(event: FormEvent) {
    event.preventDefault();
    change({ q: text.trim() });
    storeSearch("premiumproperty-recent-searches");
  }
  const q = value("q").toLowerCase().trim(),
    city = value("city").toLowerCase().trim();
  const filtered = filterProperties(
    demoListings,
    parseFilters(new URLSearchParams(params), modeDefaults(initialMode)),
  );
  const sort = value("sort");
  const total = Math.max(1, Math.ceil(filtered.length / 6)),
    raw = Number(value("page") || 1),
    page = Math.max(1, Math.min(total, Number.isFinite(raw) ? Math.floor(raw) : 1));
  const projects = demoProjects.filter(
    (item) =>
      (!city || `${item.city} ${item.locality}`.toLowerCase().includes(city)) &&
      (!q || `${item.name} ${item.city} ${item.locality}`.toLowerCase().includes(q)),
  );
  const chips = Object.entries(labels).filter(([key]) => Boolean(value(key)));
  const filters = (
    <div className="sp-filter-fields">
      <label>
        Buy or rent
        <select value={value("purpose")} onChange={(e) => change({ purpose: e.target.value })}>
          <option value="">Buy or rent</option>
          <option value="buy">Buy</option>
          <option value="rent">Rent / lease</option>
        </select>
      </label>
      <label>
        Category
        <select
          value={value("category")}
          onChange={(e) => change({ category: e.target.value, kind: "" })}
        >
          <option value="">All categories</option>
          <option value="residential">Homes</option>
          <option value="commercial">Commercial</option>
          <option value="pg">PG / Co-living</option>
          <option value="plot">Plots</option>
        </select>
      </label>
      <label>
        Property type
        <select value={value("kind")} onChange={(e) => change({ kind: e.target.value })}>
          <option value="">Any type</option>
          {[...new Set(demoListings.map((item) => item.kind))].map((kind) => (
            <option key={kind}>{kind}</option>
          ))}
        </select>
      </label>
      <label>
        City or locality
        <input
          list="pp-locations"
          value={value("city")}
          onChange={(e) => change({ city: e.target.value })}
          placeholder="Anywhere"
        />
      </label>
      <datalist id="pp-locations">
        {[...new Set(demoListings.flatMap((item) => [item.city, item.locality]))].map((place) => (
          <option key={place}>{place}</option>
        ))}
      </datalist>
      <label>
        Exact BHK
        <select value={value("bhk")} onChange={(e) => change({ bhk: e.target.value })}>
          <option value="">Any</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n} BHK
            </option>
          ))}
        </select>
      </label>
      <label>
        Minimum bedrooms
        <select value={value("bed")} onChange={(e) => change({ bed: e.target.value })}>
          <option value="">Any</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </label>
      {[
        ["min", "Minimum price (₹)"],
        ["max", "Maximum price (₹)"],
        ["minArea", "Minimum area (sq.ft.)"],
        ["maxArea", "Maximum area (sq.ft.)"],
      ].map(([key, label]) => (
        <label key={key}>
          {label}
          <input
            type="number"
            min="0"
            value={value(key)}
            onChange={(e) => change({ [key]: e.target.value })}
            placeholder="No limit"
          />
        </label>
      ))}
      <label>
        Furnishing
        <select value={value("furn")} onChange={(e) => change({ furn: e.target.value })}>
          <option value="">Any furnishing</option>
          {[...new Set(demoListings.map((item) => item.furnishing))]
            .filter((x) => x !== "—")
            .map((x) => (
              <option key={x}>{x}</option>
            ))}
        </select>
      </label>
      <label className="sp-checkbox">
        <input
          type="checkbox"
          checked={value("verified") === "true"}
          onChange={(e) => change({ verified: e.target.checked ? "true" : "" })}
        />
        Sample verification flag
      </label>
      <p className="sp-muted">
        Sample metadata only; no identity or listing has been verified. Amenities, landmarks and
        builder associations are not in the current catalog.
      </p>
      <button className="sp-button sp-button-light" type="button" onClick={clear}>
        Clear all filters
      </button>
    </div>
  );
  return (
    <SocialShell rail={false}>
      <div className="sp-page-heading">
        <span className="sp-label">A DIFFERENT WAY TO DISCOVER</span>
        <h1>
          Find a space. Feel a connection<span>.</span>
        </h1>
        <p>From a first apartment to a little more room to dream.</p>
      </div>
      <form className="sp-discovery-search" onSubmit={search}>
        <Icon name="search" />
        <label className="sp-sr" htmlFor="discover-query">
          Search properties or projects
        </label>
        <input
          id="discover-query"
          list="pp-search-suggestions"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="City, neighbourhood, property or project"
        />
        <datalist id="pp-search-suggestions">
          {[
            ...new Set([
              ...demoListings.flatMap((x) => [x.city, x.locality, x.title]),
              ...demoProjects.map((x) => x.name),
            ]),
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </datalist>
        <button className="sp-button">Search</button>
      </form>
      <div className="sp-category-chips" aria-label="Property categories">
        {categories.map((item) => (
          <button
            type="button"
            key={item.label}
            aria-pressed={
              item.value
                ? value("kind") === item.value || value("category") === item.value
                : !value("kind") && !value("category")
            }
            onClick={() =>
              change({
                category: ["commercial", "pg", "plot"].includes(item.value) ? item.value : "",
                kind: ["commercial", "pg", "plot"].includes(item.value) ? "" : item.value,
              })
            }
          >
            {item.label}
          </button>
        ))}
      </div>
      {!q && !city && (
        <div className="sp-location-links">
          <span>Discover by city</span>
          {[...new Set(demoListings.map((x) => x.city))].map((x) => (
            <button type="button" key={x} onClick={() => change({ city: x })}>
              {x}
              <Icon name="arrow" size={14} />
            </button>
          ))}
        </div>
      )}
      <div className="sp-discovery-toolbar">
        <div>
          <h2 aria-live="polite">{filtered.length} spaces to explore</h2>
          <p>Illustrative collection · no live availability</p>
        </div>
        <div>
          <button
            type="button"
            className="sp-button sp-button-light sp-filter-toggle"
            onClick={() => setDrawer(true)}
          >
            <Icon name="filter" size={17} />
            Filters{chips.length ? ` (${chips.length})` : ""}
          </button>
          <label>
            <span className="sp-sr">Sort properties</span>
            <select
              value={sort || "recommended"}
              onChange={(e) => change({ sort: e.target.value })}
            >
              <option value="recommended">Collection order</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="area">Largest area</option>
            </select>
          </label>
        </div>
      </div>
      {sort.startsWith("price") && !value("purpose") && (
        <p className="sp-muted sp-sort-explanation">
          Sale prices first, then monthly rents. Each price group is sorted separately.
        </p>
      )}
      <div className="sp-discovery-layout">
        <aside className="sp-desktop-filters">
          <h2>Make it yours</h2>
          {!drawer && filters}
        </aside>
        <section className="sp-results" aria-label="Search results">
          <div className="sp-active-chips">
            {chips.map(([key, label]) => (
              <button
                type="button"
                key={key}
                onClick={() => change({ [key]: "" })}
                aria-label={`Remove ${label} filter`}
              >
                {label}: {value(key)} <Icon name="close" size={13} />
              </button>
            ))}
            {chips.length > 0 && (
              <button type="button" onClick={clear}>
                Clear all
              </button>
            )}
          </div>
          <div className="sp-search-tools">
            <button
              type="button"
              onClick={() => {
                if (storeSearch(SAVED_SEARCHES_KEY))
                  notify("Search saved on this browser. Find it in your profile.");
              }}
            >
              Save search
            </button>
            <button type="button" aria-pressed={map} onClick={() => setMap(!map)}>
              {map ? "Hide" : "Show"} illustrative map
            </button>
          </div>
          {map && (
            <div className="sp-illustrative-map">
              <p>Illustrative locations · no precise coordinates supplied</p>
              {filtered.slice(0, 4).map((item) => (
                <Link key={item.id} href={`/property/${item.id}`}>
                  <Icon name="pin" size={15} />
                  {item.locality} · {item.priceLabel}
                </Link>
              ))}
            </div>
          )}
          {filtered.length ? (
            <>
              <div className="sp-visual-grid">
                {filtered.slice((page - 1) * 6, page * 6).map((item) => (
                  <PropertyTile key={item.id} item={item} />
                ))}
              </div>
              <nav className="sp-pagination" aria-label="Search pages">
                <button
                  type="button"
                  className="sp-button sp-button-light"
                  disabled={page === 1}
                  onClick={() => change({ page: String(page - 1) }, false)}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {total}
                </span>
                <button
                  type="button"
                  className="sp-button"
                  disabled={page === total}
                  onClick={() => {
                    change({ page: String(page + 1) }, false);
                    document.querySelector(".sp-discovery-toolbar")?.scrollIntoView();
                  }}
                >
                  Next spaces
                  <Icon name="arrow" size={16} />
                </button>
              </nav>
            </>
          ) : (
            <div className="sp-empty">
              <Icon name="search" size={35} />
              <h2>No matching spaces yet</h2>
              <p>Try a different location or remove a filter.</p>
              <button type="button" className="sp-button" onClick={clear}>
                Reset search
              </button>
            </div>
          )}
          {projects.length > 0 && (
            <section className="sp-project-edit">
              <span className="sp-label">THE PROJECT EDIT · SAMPLE PROJECTS</span>
              <h2>Room for a new chapter</h2>
              <div>
                {projects.map((project) => (
                  <Link key={project.slug} href={`/project/${project.slug}`}>
                    <div className="sp-project-photo">
                      <Photo
                        src={project.image}
                        alt={`${project.name}, illustrative photograph`}
                        sizes="(max-width:700px) 90vw, 30vw"
                      />
                    </div>
                    <strong>{project.name}</strong>
                    <p>
                      {project.locality}, {project.city}
                    </p>
                    <b>{project.from}</b>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {recent.length > 0 && (
            <section className="sp-recent">
              <h2>Pick up where you left off</h2>
              {recent.slice(0, 4).map((x) => (
                <Link
                  key={x.id}
                  href={`/explore?${new URLSearchParams(Object.entries(x.query).map(([k, v]) => [k, String(v)]))}`}
                >
                  {x.title}
                  <Icon name="arrow" size={15} />
                </Link>
              ))}
            </section>
          )}
        </section>
      </div>
      <Modal open={drawer} onClose={() => setDrawer(false)} title="Refine your discovery">
        {drawer && filters}
        <button className="sp-button sp-filter-done" onClick={() => setDrawer(false)}>
          Show {filtered.length} spaces
        </button>
      </Modal>
    </SocialShell>
  );
}
export function ExploreExperience(props: { initialMode?: SearchMode | "" }) {
  return (
    <Suspense
      fallback={
        <SocialShell rail={false}>
          <div className="sp-feed-skeleton" role="status" aria-label="Loading discovery">
            <span />
            <div />
          </div>
        </SocialShell>
      }
    >
      <Discovery {...props} />
    </Suspense>
  );
}
