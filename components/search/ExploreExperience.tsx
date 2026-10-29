"use client";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { demoListings, SAVED_SEARCHES_KEY, type DemoListing } from "@/lib/demo-data";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ListingCard } from "@/components/property/ListingCard";

export type SearchMode = "buy" | "rent" | "commercial" | "pg" | "plots";
const modeDefaults: Record<SearchMode, { purpose: string; category: string }> = {
  buy: { purpose: "buy", category: "residential" },
  rent: { purpose: "rent", category: "residential" },
  commercial: { purpose: "buy", category: "commercial" },
  pg: { purpose: "rent", category: "pg" },
  plots: { purpose: "buy", category: "plot" },
};
const modeTitles: Record<SearchMode, string> = {
  buy: "Homes for sale",
  rent: "Homes for rent",
  commercial: "Commercial spaces",
  pg: "PG & co-living stays",
  plots: "Plots for sale",
};

const modeHeroImages: Record<SearchMode, string> = {
  buy: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2200&q=85",
  rent: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85",
  commercial: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=85",
  pg: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2200&q=85",
  plots: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=85",
};export function ExploreExperience({ initialMode = "" }: { initialMode?: SearchMode | "" }) {
  const router = useRouter();
  const defaults = initialMode ? modeDefaults[initialMode] : { purpose: "", category: "" };
  const [purpose, setPurpose] = useState(defaults.purpose), [category, setCategory] = useState(defaults.category), [kind, setKind] = useState(""), [city, setCity] = useState(""), [q, setQ] = useState(""), [bed, setBed] = useState(""), [bhk, setBhk] = useState(""), [max, setMax] = useState(""), [furn, setFurn] = useState(""), [verified, setVerified] = useState(false), [sort, setSort] = useState("recommended"), [shown, setShown] = useState(6), [map, setMap] = useState(false), [ready, setReady] = useState(false), [saved, setSaved] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPurpose(params.get("purpose") ?? defaults.purpose);
    setCategory(params.get("category") ?? defaults.category);
    setKind(params.get("kind") || ""); setCity(params.get("city") || ""); setQ(params.get("q") || "");
    setBed(params.get("bed") || ""); setBhk(params.get("bhk") || ""); setMax(params.get("max") || "");
    setFurn(params.get("furn") || ""); setVerified(params.get("verified") === "true"); setSort(params.get("sort") || "recommended"); setReady(true);
  }, [defaults.category, defaults.purpose]);
  useEffect(() => {
    const resetFilters = () => { setPurpose(""); setCategory(""); setKind(""); setQ(""); setBed(""); setBhk(""); setMax(""); setFurn(""); setVerified(false); setSort("recommended"); setShown(6); };
    const syncLocation = (event: Event) => { resetFilters(); setCity((event as CustomEvent<string>).detail); };
    const clearLocation = () => { resetFilters(); setCity(""); };
    window.addEventListener("pp-location-change", syncLocation); window.addEventListener("pp-clear-explore", clearLocation);
    return () => { window.removeEventListener("pp-location-change", syncLocation); window.removeEventListener("pp-clear-explore", clearLocation); };
  }, []);

  const filtered = useMemo(() => {
    let results: DemoListing[] = demoListings.filter((item) =>
      (!purpose || item.purpose === purpose) && (!category || item.category === category) &&
      (!kind || item.kind.toLowerCase().includes(kind.toLowerCase())) &&
      (!city || `${item.city} ${item.locality}`.toLowerCase().includes(city.trim().toLowerCase())) &&
      (!q || `${item.title} ${item.kind} ${item.locality} ${item.city} ${(item as DemoListing & { surveyNumber?: string; gatNumber?: string; ctsNumber?: string }).surveyNumber || ""} ${(item as DemoListing & { gatNumber?: string }).gatNumber || ""} ${(item as DemoListing & { ctsNumber?: string }).ctsNumber || ""}`.toLowerCase().includes(q.toLowerCase())) &&
      (!bed || item.bedrooms >= Number(bed)) && (!bhk || item.bedrooms === Number(bhk)) && (!max || item.price <= Number(max)) && (!furn || item.furnishing === furn) && (!verified || item.verified));
    if (sort === "price-low") results.sort((a, b) => a.price - b.price);
    if (sort === "price-high") results.sort((a, b) => b.price - a.price);
    if (sort === "area") results.sort((a, b) => b.area - a.area);
    return results;
  }, [purpose, category, kind, city, q, bed, bhk, max, furn, verified, sort]);

  function apply(event: FormEvent) {
    event.preventDefault(); const params = new URLSearchParams();
    if (purpose) params.set("purpose", purpose); if (category) params.set("category", category); if (kind) params.set("kind", kind);
    if (bed) params.set("bed", bed); if (bhk) params.set("bhk", bhk); if (city.trim()) params.set("city", city.trim()); if (q.trim()) params.set("q", q.trim());
    if (max) params.set("max", max); if (furn) params.set("furn", furn); if (verified) params.set("verified", "true"); if (sort !== "recommended") params.set("sort", sort);
    const query = Object.fromEntries(params.entries());
    try { const recent = JSON.parse(localStorage.getItem("premiumproperty-recent-searches") || "[]"); const entry = { id: Date.now().toString(), title: [purpose, category, city.trim()].filter(Boolean).join(" · ") || "All homes", query, createdAt: new Date().toLocaleDateString() }; localStorage.setItem("premiumproperty-recent-searches", JSON.stringify([entry, ...(Array.isArray(recent) ? recent : [])].slice(0, 12))); window.dispatchEvent(new Event("pp-account-activity")); } catch { /* Continue navigation even if browser storage is unavailable. */ }
    router.replace(`${initialMode ? `/${initialMode}` : "/explore"}?${params.toString()}`); setShown(6);
  }
  function clearFilters() {
    setPurpose(defaults.purpose); setCategory(defaults.category); setKind(""); setCity(""); setQ(""); setBed(""); setBhk(""); setMax(""); setFurn(""); setVerified(false); setSort("recommended"); setShown(6); router.replace(initialMode ? `/${initialMode}` : "/explore");
  }
  function saveSearch() {
    const entry = { id: Date.now().toString(), title: [purpose, category, city].filter(Boolean).join(" · ") || "All homes", query: { purpose, category, kind, city, q, bed, bhk, max, furn, verified, sort }, createdAt: new Date().toLocaleDateString() };
    try { const old = JSON.parse(localStorage.getItem(SAVED_SEARCHES_KEY) || "[]"); localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify([entry, ...old])); setSaved(true); } catch { setSaved(true); }
  }
  const mode = initialMode || (category === "commercial" ? "commercial" : category === "pg" ? "pg" : category === "plot" ? "plots" : purpose === "rent" ? "rent" : "buy");
  const title = `${modeTitles[mode]}${mode === "commercial" ? purpose === "rent" ? " for lease" : " to buy" : ""}${city.trim() ? ` in ${city.trim()}` : ""}`;
  const hasLocation = Boolean(city.trim());
  const cityAreas = Array.from(new Set(demoListings.filter((item) => item.category === (category || modeDefaults[mode].category) && item.purpose === (purpose || modeDefaults[mode].purpose) && city.trim() && item.city.toLowerCase() === city.trim().toLowerCase()).map((item) => item.locality))).slice(0, 5);
  const popularAreas = Array.from(new Set(demoListings.filter((item) => item.category === (category || modeDefaults[mode].category) && item.purpose === (purpose || modeDefaults[mode].purpose)).map((item) => item.locality))).slice(0, 5);
  const nearbyAreas = cityAreas.length ? cityAreas : popularAreas;
  const activeFilters = [
    purpose && purpose !== defaults.purpose ? { key: "purpose", label: purpose === "rent" ? "Rent / lease" : "Buy" } : null,
    category && category !== defaults.category ? { key: "category", label: category === "residential" ? "Homes" : category === "commercial" ? "Commercial" : category === "pg" ? "PG / co-living" : "Plots" } : null,
    kind ? { key: "kind", label: `Type: ${kind}` } : null,
    city ? { key: "city", label: `Location: ${city}` } : null,
    q ? { key: "q", label: `Keyword: ${q}` } : null,
    bed ? { key: "bed", label: `${bed}+ bedrooms` } : null,
    bhk ? { key: "bhk", label: `${bhk} BHK` } : null,
    max ? { key: "max", label: `Up to ₹${Number(max).toLocaleString("en-IN")}` } : null,
    furn ? { key: "furn", label: furn } : null,
    verified ? { key: "verified", label: "Verified details" } : null,
  ].filter((filter): filter is { key: string; label: string } => Boolean(filter));
  function removeFilter(key: string) {
    if (key === "purpose") setPurpose(defaults.purpose);
    if (key === "category") setCategory(defaults.category);
    if (key === "kind") setKind("");
    if (key === "city") setCity("");
    if (key === "q") setQ("");
    if (key === "bed") setBed("");
    if (key === "bhk") setBhk("");
    if (key === "max") setMax("");
    if (key === "furn") setFurn("");
    if (key === "verified") setVerified(false);
    setShown(6);
  }

  return <><SiteHeader selectedLocation={city}/><main id="main-content" className={`category-page search-results-${mode}`}>
    <section className={`category-page-hero category-page-hero-${mode}`} style={{ backgroundImage: `linear-gradient(90deg, rgba(15,22,49,.78), rgba(15,22,49,.24)), url("${modeHeroImages[mode]}")` }}>
      <div className="category-page-hero-inner"><span className="category-hero-kicker">PROPERTY DISCOVERY · {mode === "pg" ? "STAYS" : mode === "commercial" ? "BUSINESS SPACES" : mode === "plots" ? "LAND & PLOTS" : mode.toUpperCase()}</span><h1>{title}</h1><p>{mode === "rent" ? "Find a home that fits your next move." : mode === "commercial" ? "Find offices, shops and workspaces to buy or lease." : mode === "pg" ? "Explore furnished rooms and co-living stays." : mode === "plots" ? "Explore land and plots for your next plan." : "Explore homes and sample properties for sale."}</p>
        <form className="category-hero-search" onSubmit={apply}>
          <label className="category-hero-location"><span>LOCATION</span><input aria-label="Search city or locality" value={city} onChange={(event) => setCity(event.target.value)} placeholder="City, village or locality"/></label>
          <label className="category-hero-keyword"><span>{mode === "pg" ? "LOCALITY OR LANDMARK" : "LOCALITY, PROJECT OR BUILDER"}</span><input aria-label="Search locality, project or builder" value={q} onChange={(event) => setQ(event.target.value)} placeholder={mode === "pg" ? "Search locality or landmark" : "Search locality, landmark, project, or builder"}/></label>
          {mode === "commercial" && <fieldset className="category-hero-intent"><legend>Commercial listing purpose</legend><label><input type="radio" name="commercial-result-purpose" checked={purpose === "buy"} onChange={() => setPurpose("buy")}/> Buy</label><label><input type="radio" name="commercial-result-purpose" checked={purpose === "rent"} onChange={() => setPurpose("rent")}/> Lease</label></fieldset>}
          <button className="button category-hero-submit">Search <span aria-hidden="true">→</span></button>
        </form>
        {popularAreas.length > 0 && <div className="category-popular"><strong>Popular {mode === "pg" ? "areas" : "localities"}</strong>{popularAreas.map((area) => <button type="button" key={area} onClick={() => { setQ(area); }}>{area} <span aria-hidden="true">›</span></button>)}</div>}
        <Link className="category-owner-link" href="/post-property">Are you a property owner? <strong>Post your property →</strong></Link>
      </div>
    </section>
    <div className="route-page category-page-content"><div className="route-title"><div><span className="eyebrow">{mode.toUpperCase()} LISTINGS</span><h2>{title}</h2><p>Browse {mode === "buy" ? "homes for sale" : mode === "rent" ? "homes for rent" : mode === "commercial" ? "commercial properties to buy or lease" : mode === "pg" ? "PG and co-living stays" : "plots for sale"}, then refine by location, type and budget.</p></div><Link className="button button-teal" href="/post-property">+ Post a property</Link></div>
    {!initialMode && <form className="explore-search" onSubmit={apply}>
      <label>Looking to<select value={purpose} onChange={(event) => setPurpose(event.target.value)}><option value="">Buy or rent</option><option value="buy">Buy</option><option value="rent">Rent / lease</option></select></label>
      <label>Property type<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All types</option><option value="residential">Homes</option><option value="commercial">Commercial</option><option value="pg">PG / Co-living</option><option value="plot">Plots</option></select></label>
      <label>Specific type<input value={kind} onChange={(event) => setKind(event.target.value)} placeholder="Villa, apartment, shop…"/></label>
      <label>{city.trim() ? `LOCATION · ${city.trim().toLocaleUpperCase()}` : "LOCATION"}<input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City, village, neighbourhood or landmark"/></label>
      <label>Keyword<input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Project, builder, survey / Gat no…"/></label>
      <button className="button button-orange">Update results</button>
    </form>}
    <div className="explore-layout"><aside className="filter-panel"><h2>Filter properties</h2><label>Property subtype<input value={kind} onChange={(event) => setKind(event.target.value)} placeholder={mode === "commercial" ? "Office, shop, warehouse…" : mode === "pg" ? "Private room, shared…" : mode === "plots" ? "Residential, agricultural…" : "Apartment, villa, house…"}/></label>{(mode === "buy" || mode === "rent" || mode === "pg") && <label>Bedrooms<select value={bed} onChange={(event) => setBed(event.target.value)}><option value="">Any bedrooms</option>{[1,2,3,4].map((number) => <option value={number} key={number}>{number}+ bedrooms</option>)}</select></label>}{(mode === "buy" || mode === "rent" || mode === "pg") && <label>Exact BHK<select value={bhk} onChange={(event) => setBhk(event.target.value)}><option value="">Any</option>{[1,2,3,4].map((number) => <option value={number} key={number}>{number} BHK</option>)}</select></label>}<label>Maximum price (₹)<input type="number" value={max} onChange={(event) => setMax(event.target.value)} placeholder="No limit"/></label>{(mode === "rent" || mode === "pg") && <label>Furnishing<select value={furn} onChange={(event) => setFurn(event.target.value)}><option value="">Any</option><option>Fully furnished</option><option>Semi-furnished</option><option>Unfurnished</option></select></label>}<label className="check-line"><input type="checkbox" checked={verified} onChange={(event) => setVerified(event.target.checked)}/> Verified details</label><button type="button" className="button button-outline" onClick={clearFilters}>Clear filters</button></aside>
            <section className="results-panel" aria-busy={!ready}>
        {activeFilters.length > 0 && <div className="active-filter-bar" role="region" aria-label="Applied filters"><div className="active-filter-heading"><strong>Applied filters</strong><button type="button" onClick={clearFilters}>Clear all</button></div><div className="active-filter-chips">{activeFilters.map((filter) => <button type="button" className="active-filter-chip" key={filter.key} onClick={() => removeFilter(filter.key)} aria-label={`Remove filter ${filter.label}`}>{filter.label}<span aria-hidden="true">×</span></button>)}</div></div>}
        <div className="results-toolbar"><div><h2 aria-live="polite" aria-atomic="true">{ready ? `${filtered.length} ${category === "pg" ? "stays" : category === "commercial" ? "commercial spaces" : category === "plot" ? "plots" : "homes"} to explore` : "Loading listings…"}</h2><p>Property information</p></div><div className="result-actions"><button type="button" className="button button-outline" onClick={saveSearch}>{saved ? "Search saved ✓" : "♡ Save search"}</button><button type="button" className="button button-outline" onClick={() => setMap(!map)} aria-pressed={map}>{map ? "Hide map" : "Show map"}</button><label className="sort-control">Sort listings<select aria-label="Sort listings" value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="area">Largest area</option></select></label></div></div>
        {map && <div className="demo-map"><span className="map-label">Illustrative location map</span>{filtered.slice(0,4).map((item, index) => <Link style={{ left: `${18 + index * 19}%`, top: `${30 + (index % 2) * 25}%` }} href={`/property/${item.id}`} key={item.id}>{item.priceLabel}</Link>)}</div>}
        {!ready ? <div className="empty-state compact" role="status"><p>Loading properties…</p></div> : filtered.length ? <><div className="listing-grid">{(hasLocation ? filtered : filtered.slice(0, shown)).map((item) => <ListingCard item={item} key={item.id}/>)}</div>{!hasLocation && shown < filtered.length && <button className="button button-outline load-more" onClick={() => setShown(shown + 6)}>Show more properties</button>}</> : <div className="empty-state" role="status"><span aria-hidden="true">⌕</span><h3>{hasLocation ? `No listings available in ${city.trim()}` : "No matching properties available"}</h3><p>{hasLocation ? `There are no matching properties in ${city.trim()} for these filters.` : "Try removing one or more filters to see more properties."}</p>{nearbyAreas.length > 0 && <div className="nearby-suggestions"><strong>{cityAreas.length ? `Try these areas in ${city.trim()}` : "Try one of these popular areas"}</strong><div>{nearbyAreas.map((area) => <button type="button" key={area} onClick={() => { setCity(area); setQ(""); setShown(6); }}>{area}<span aria-hidden="true"> →</span></button>)}</div></div>}<button className="button button-teal" onClick={clearFilters}>Clear all filters</button></div>}
      </section></div></div></main><SiteFooter/></>;
}
export default function ExplorePage() { return <ExploreExperience/>; }

