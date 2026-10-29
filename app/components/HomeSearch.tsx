"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { demoListings, demoProjects } from "@/lib/demo-data";

const tabs = [
  { label: "Buy", slug: "buy", purpose: "buy", category: "residential" },
  { label: "Rent", slug: "rent", purpose: "rent", category: "residential" },
  { label: "Commercial", slug: "commercial", purpose: "buy", category: "commercial" },
  { label: "PG / Co-living", slug: "pg", purpose: "rent", category: "pg" },
  { label: "Plots", slug: "plots", purpose: "buy", category: "plot" },
] as const;
type Tab = (typeof tabs)[number];
type SuggestionKind = "CITY" | "LOCALITY" | "VILLAGE" | "PROPERTY" | "PROJECT";
type SearchSuggestion = { id: string; label: string; kind: SuggestionKind; city: string; query?: string; slug?: string; listingId?: string; source?: "google" | "photon"; googlePrediction?: GooglePlacePrediction };

const cityNames = Array.from(new Set(["Pune", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Delhi", "Noida", "Gurugram", "Kolkata", "Ahmedabad", "Mysuru", "Thane", ...demoListings.map((item) => item.city), ...demoProjects.map((item) => item.city)]));
const localityData = [...demoListings.map((item) => ({ label: item.locality, city: item.city })), { label: "Hadapsar", city: "Pune" }, { label: "Wagholi", city: "Pune" }, { label: "Kharadi", city: "Pune" }];
const uniqueLocalities = Array.from(new Map(localityData.map((item) => [item.city.toLowerCase() + "-" + item.label.toLowerCase(), item])).values());
const searchCatalog: SearchSuggestion[] = [
  ...cityNames.map((city) => ({ id: `city-${city}`, label: city, kind: "CITY" as const, city })),
  ...uniqueLocalities.map((item) => ({ id: `locality-${item.city}-${item.label}`, label: item.label, kind: "LOCALITY" as const, city: item.city, query: item.label })),
  ...demoListings.map((item) => ({ id: `property-${item.id}`, label: item.title, kind: "PROPERTY" as const, city: item.city, query: item.title, listingId: item.id })),
  ...demoProjects.map((item) => ({ id: `project-${item.slug}`, label: item.name, kind: "PROJECT" as const, city: item.city, query: item.name, slug: item.slug })),
];
const suggestionIcons: Record<SuggestionKind, string> = { CITY: "C", LOCALITY: "L", VILLAGE: "V", PROPERTY: "H", PROJECT: "P" };
type PhotonFeature = { properties?: { name?: string; city?: string; district?: string; county?: string; state?: string; country?: string; type?: string; osm_value?: string } };
type GooglePlaceComponent = { longText?: string; types?: string[] };
type GooglePlace = { displayName?: string | { toString(): string }; formattedAddress?: string; addressComponents?: GooglePlaceComponent[]; fetchFields: (options: { fields: string[] }) => Promise<void> };
type GooglePlacePrediction = { text?: { toString(): string }; mainText?: { toString(): string }; types?: string[]; toPlace: () => GooglePlace };
type GooglePlacesLibrary = {
  AutocompleteSessionToken: new () => unknown;
  AutocompleteSuggestion: { fetchAutocompleteSuggestions: (request: { input: string; includedRegionCodes: string[]; language: string; region: string; sessionToken: unknown }) => Promise<{ suggestions?: { placePrediction?: GooglePlacePrediction }[] }> };
};
declare global {
  interface Window {
    google?: { maps?: { importLibrary?: (name: "places") => Promise<unknown> } };
    __premiumPropertyGooglePlaces?: Promise<GooglePlacesLibrary>;
  }
}
const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || "";
const placeCache = new Map<string, SearchSuggestion[]>();
function getPlaceSuggestions(features: PhotonFeature[]): SearchSuggestion[] {
  return features.flatMap((feature, index) => {
    const place = feature.properties;
    if (!place?.name || place.country?.toLowerCase() !== "india") return [];
    const city = place.city || place.county || place.district || place.state || "";
    const label = [place.name, city, place.state].filter((part, i, all): part is string => Boolean(part) && all.indexOf(part) === i).join(", ");
    const type = `${place.type || ""} ${place.osm_value || ""}`.toLowerCase();
    const village = /village|hamlet|suburb|neighbourhood|quarter/.test(type);
    return [{ id: `place-${index}-${label}`, label, kind: village ? "VILLAGE" as const : "LOCALITY" as const, city, query: place.name }];
  });
}
function getTabPath(tab: Tab) { return `/${tab.slug}`; }

async function loadGooglePlaces(): Promise<GooglePlacesLibrary> {
  if (!googleMapsKey) throw new Error("Google Maps API key is not configured");
  if (!window.__premiumPropertyGooglePlaces) {
    const promise = new Promise<GooglePlacesLibrary>((resolve, reject) => {
      const finishLoading = async () => {
        const importLibrary = window.google?.maps?.importLibrary;
        if (!importLibrary) { reject(new Error("Google Maps JavaScript API did not initialize")); return; }
        try { resolve(await importLibrary("places") as GooglePlacesLibrary); } catch (error) { reject(error); }
      };
      if (window.google?.maps?.importLibrary) { void finishLoading(); return; }
      let script = document.getElementById("premiumproperty-google-maps") as HTMLScriptElement | null;
      const alreadyAdded = Boolean(script);
      if (!script) script = document.createElement("script");
      script.addEventListener("load", () => { void finishLoading(); }, { once: true });
      script.addEventListener("error", () => reject(new Error("Google Maps JavaScript API could not be loaded")), { once: true });
      if (!alreadyAdded) {
        script.id = "premiumproperty-google-maps";
        script.async = true;
        script.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(googleMapsKey) + "&v=weekly&loading=async";
        document.head.appendChild(script);
      }
    });
    window.__premiumPropertyGooglePlaces = promise.catch((error) => {
      window.__premiumPropertyGooglePlaces = undefined;
      throw error;
    });
  }
  return window.__premiumPropertyGooglePlaces;
}
export function HomeSearch({ onLocationChange }: { onLocationChange?: (city: string) => void }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [commercialPurpose, setCommercialPurpose] = useState<"buy" | "rent">("buy");
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<SearchSuggestion | null>(null);
  const [city, setCity] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [placeSuggestions, setPlaceSuggestions] = useState<SearchSuggestion[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesUnavailable, setPlacesUnavailable] = useState(false);

  const googleSession = useRef<unknown>(null);
  useEffect(() => {
    const query = value.trim();
    if (query.length < 2 || /(?:survey|surv\.?\s*no|gat\s*no|cts\s*no|plot\s*no)\s*[:#-]?\s*[a-z0-9/-]+/i.test(query)) {
      setPlaceSuggestions([]); setPlacesLoading(false); setPlacesUnavailable(false); googleSession.current = null; return;
    }
    const cacheKey = query.toLocaleLowerCase();
    const cached = placeCache.get(cacheKey);
    if (cached) { setPlaceSuggestions(cached); setPlacesLoading(false); setPlacesUnavailable(false); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setPlacesLoading(true); setPlacesUnavailable(false);
      try {
        if (googleMapsKey) {
          const places = await loadGooglePlaces();
          if (controller.signal.aborted) return;
          googleSession.current ??= new places.AutocompleteSessionToken();
          const response = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query, includedRegionCodes: ["in"], language: "en", region: "in", sessionToken: googleSession.current,
          });
          if (controller.signal.aborted) return;
          const results = (response.suggestions || []).flatMap((suggestion, index) => {
            const prediction = suggestion.placePrediction;
            if (!prediction) return [];
            const label = prediction.text?.toString().trim();
            if (!label) return [];
            const types = (prediction.types || []).join(" ").toLowerCase();
            const kind: SuggestionKind = /administrative_area|locality|postal_town/.test(types) ? "CITY" : /village|hamlet/.test(types) ? "VILLAGE" : "LOCALITY";
            return [{ id: "google-" + index + "-" + label, label, kind, city: "", query: prediction.mainText?.toString() || label.split(",")[0], source: "google" as const, googlePrediction: prediction }];
          });
          setPlaceSuggestions(results);
        } else {
          const params = new URLSearchParams({ q: query, limit: "8", lang: "en", countrycode: "in" });
          const response = await fetch("https://photon.komoot.io/api/?" + params, { signal: controller.signal });
          if (!response.ok) throw new Error("Place search unavailable");
          const payload = await response.json() as { features?: PhotonFeature[] };
          const results = getPlaceSuggestions(payload.features || []).map((item) => ({ ...item, source: "photon" as const }));
          placeCache.set(cacheKey, results); setPlaceSuggestions(results);
        }
      } catch {
        if (!controller.signal.aborted) { setPlaceSuggestions([]); setPlacesUnavailable(true); }
      } finally { if (!controller.signal.aborted) setPlacesLoading(false); }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [value]);  const suggestions = useMemo(() => {
    const query = value.trim().toLocaleLowerCase();
    const local = query
      ? searchCatalog.filter((item) => item.label.toLocaleLowerCase().includes(query))
      : searchCatalog.filter((item) => item.kind === "CITY" || item.kind === "LOCALITY");
    const merged = query ? [...placeSuggestions, ...local] : local;
    return merged
      .filter((item, index, all) => all.findIndex((candidate) => candidate.label.toLowerCase() === item.label.toLowerCase()) === index)
      .sort((a, b) => Number(b.label.toLocaleLowerCase().startsWith(query)) - Number(a.label.toLocaleLowerCase().startsWith(query)))
      .slice(0, 10);
  }, [value, placeSuggestions]);

  async function chooseSuggestion(item: SearchSuggestion) {
    let chosen = item;
    if (item.googlePrediction) {
      try {
        const place = item.googlePrediction.toPlace();
        await place.fetchFields({ fields: ["displayName", "formattedAddress", "addressComponents", "types"] });
        const components = place.addressComponents || [];
        const findComponent = (type: string) => components.find((part) => part.types?.includes(type))?.longText || "";
        const cityName = findComponent("locality") || findComponent("postal_town") || findComponent("administrative_area_level_3") || findComponent("administrative_area_level_2");
        const displayName = place.displayName?.toString() || item.query || item.label.split(",")[0];
        const isCity = item.kind === "CITY";
        chosen = { ...item, label: place.formattedAddress || item.label, city: cityName || (isCity ? displayName : ""), query: isCity ? "" : displayName };
      } catch {
        chosen = { ...item, city: item.city || "", query: item.query || item.label.split(",")[0] };
      } finally {
        googleSession.current = null;
      }
    }
    setValue(chosen.label); setSelected(chosen); setCity(chosen.city); setOpen(false); setActiveIndex(-1);
    onLocationChange?.(chosen.kind === "CITY" ? chosen.city || chosen.label : chosen.label);
  }  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    const choice = selected ?? searchCatalog.find((item) => item.label.toLowerCase() === query.toLowerCase());
    const purpose = activeTab.slug === "commercial" ? commercialPurpose : activeTab.purpose;
    const params = new URLSearchParams({ purpose, category: activeTab.category });
    const selectedCity = choice?.kind === "CITY" ? choice.city : choice?.city || city;
    const keyword = choice?.kind === "CITY" ? "" : choice?.query ?? query;
    if (selectedCity) params.set("city", selectedCity);
    if (keyword) params.set("q", keyword);
    if (choice?.kind === "PROPERTY" && choice.listingId) { router.push(`/property/${encodeURIComponent(choice.listingId)}`); return; }
    if (choice?.kind === "PROJECT" && choice.slug) { router.push(`/project/${encodeURIComponent(choice.slug)}`); return; }
    router.push(`${getTabPath(activeTab)}?${params.toString()}`);
  }
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && suggestions.length) { event.preventDefault(); setOpen(true); setActiveIndex((index) => (index + 1) % suggestions.length); }
    else if (event.key === "ArrowUp" && suggestions.length) { event.preventDefault(); setOpen(true); setActiveIndex((index) => index <= 0 ? suggestions.length - 1 : index - 1); }
    else if (event.key === "Escape") setOpen(false);
    else if (event.key === "Enter" && open && suggestions.length && activeIndex >= 0) { event.preventDefault(); chooseSuggestion(suggestions[activeIndex]); }
  }
  const placeholder = activeTab.slug === "pg" ? "Search for locality or landmark" : activeTab.slug === "commercial" ? "Search locality" : "Search for locality, landmark, project, or builder";

  return (
    <form className={`home-search search-mode-${activeTab.slug}`} onSubmit={submitSearch}>
      <div className="search-tabs" role="tablist" aria-label="Property purpose">
        {tabs.map((tab) => <button key={tab.slug} type="button" role="tab" aria-selected={activeTab.slug === tab.slug} className={activeTab.slug === tab.slug ? "selected" : ""} onClick={() => { setActiveTab(tab); setActiveIndex(-1); router.push(getTabPath(tab)); }}>{tab.label}</button>)}
      </div>
      <div className="home-search-control">
        {(activeTab.slug === "pg" || activeTab.slug === "plots") && <label className="home-search-city-wrap"><span className="sr-only">Choose a city</span><select className="home-search-city" aria-label="Choose city" value={city} onChange={(event) => { setCity(event.target.value); onLocationChange?.(event.target.value); }}><option value="">All India</option>{cityNames.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>}
        <div className="home-search-input-row">
          <span className="home-search-icon" aria-hidden="true">Q</span>
          <input className="home-search-query" type="search" role="combobox" aria-label="Search city, locality, property or project" aria-autocomplete="list" aria-expanded={open} aria-controls="home-search-suggestions" aria-activedescendant={open && suggestions[activeIndex] ? `suggestion-${suggestions[activeIndex].id}` : undefined} autoComplete="off" value={value} placeholder={placeholder} onFocus={() => { setOpen(true); setActiveIndex(-1); }} onBlur={() => window.setTimeout(() => setOpen(false), 130)} onChange={(event) => { setValue(event.target.value); setPlaceSuggestions([]); setSelected(null); setActiveIndex(-1); setOpen(true); if (!event.target.value.trim()) { setCity(""); onLocationChange?.(""); } }} onKeyDown={handleKeyDown}/>
          {activeTab.slug === "commercial" && <fieldset className="commercial-search-purpose"><legend>Listing purpose</legend><label><input type="radio" name="commercial-purpose" checked={commercialPurpose === "buy"} onChange={() => setCommercialPurpose("buy")}/> Buy</label><label><input type="radio" name="commercial-purpose" checked={commercialPurpose === "rent"} onChange={() => setCommercialPurpose("rent")}/> Lease</label></fieldset>}
          <button className="button button-orange home-search-submit" type="submit">Search <span aria-hidden="true">&gt;</span></button>
        </div>
        {open && <div className="home-search-suggestions" id="home-search-suggestions" role="listbox" aria-label="Search suggestions">
          <div className="home-search-suggestion-heading">{value.trim() ? "PLACES, LOCALITIES & LISTINGS" : "POPULAR CITIES & LOCALITIES"}</div>
          {placesLoading && <div className="home-search-no-results">Searching Indian locations...</div>}
          {suggestions.length ? suggestions.map((item, index) => <button key={item.id} id={`suggestion-${item.id}`} type="button" role="option" aria-selected={activeIndex === index} className={`home-search-suggestion${activeIndex === index ? " is-active" : ""}`} onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => setActiveIndex(index)} onClick={() => { void chooseSuggestion(item); }}>
            <span className={`home-search-suggestion-icon kind-${item.kind.toLowerCase()}`} aria-hidden="true">{suggestionIcons[item.kind]}</span><span className="home-search-suggestion-copy"><strong>{item.label}</strong><small>{item.kind} <span aria-hidden="true">|</span> {item.city.toLocaleUpperCase() || "INDIA"}</small></span>
          </button>) : <div className="home-search-no-results"><strong>No matching suggestions</strong><span>{placesUnavailable ? "Live locality search is temporarily unavailable. You can still submit your query." : `Press Search to look for ${value.trim()} in available listings. Survey/Gat numbers match only when listing data contains them.`}</span></div>}
          {suggestions.some((item) => item.source === "google") && <div className="google-maps-attribution">Google Maps</div>}
        </div>}
      </div>
      <Link href={getTabPath(activeTab)} className="search-all">Explore {activeTab.label.toLowerCase()} properties &gt;</Link>
    </form>
  );
}




