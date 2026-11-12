import type { DemoListing } from "../demo-data";
export type SearchMode = "buy" | "rent" | "commercial" | "pg" | "plots";
export type Filters = {
  purpose: string;
  category: string;
  kind: string;
  city: string;
  q: string;
  bed: string;
  bhk: string;
  min: string;
  max: string;
  minArea: string;
  maxArea: string;
  furn: string;
  verified: string;
  sort: string;
};
export const emptyFilters: Filters = {
  purpose: "",
  category: "",
  kind: "",
  city: "",
  q: "",
  bed: "",
  bhk: "",
  min: "",
  max: "",
  minArea: "",
  maxArea: "",
  furn: "",
  verified: "",
  sort: "recommended",
};
export function modeDefaults(mode: SearchMode | ""): Filters {
  return mode
    ? {
        ...emptyFilters,
        purpose: mode === "rent" || mode === "pg" ? "rent" : "buy",
        category:
          mode === "commercial"
            ? "commercial"
            : mode === "pg"
              ? "pg"
              : mode === "plots"
                ? "plot"
                : "residential",
      }
    : { ...emptyFilters };
}
export function parseFilters(params: URLSearchParams, defaults: Filters = emptyFilters) {
  const value = { ...defaults };
  for (const key of Object.keys(value) as (keyof Filters)[])
    if (params.has(key)) value[key] = (params.get(key) || "").trim();
  for (const key of ["min", "max", "bed", "bhk", "minArea", "maxArea"] as const)
    if (value[key] && (!Number.isFinite(Number(value[key])) || Number(value[key]) < 0))
      value[key] = "";
  if (!["", "buy", "rent"].includes(value.purpose)) value.purpose = defaults.purpose;
  if (!["", "residential", "commercial", "pg", "plot"].includes(value.category))
    value.category = defaults.category;
  if (!["recommended", "price-low", "price-high", "area"].includes(value.sort))
    value.sort = "recommended";
  value.verified = value.verified === "true" ? "true" : "";
  return value;
}
export function filterParams(value: Filters, defaults: Filters = emptyFilters) {
  const params = new URLSearchParams();
  for (const key of Object.keys(value) as (keyof Filters)[]) {
    if (key === "sort" && value.sort === "recommended") continue;
    if (value[key] || ((key === "purpose" || key === "category") && defaults[key]))
      params.set(key, value[key]);
  }
  return params;
}
export function filterProperties(items: DemoListing[], f: Filters) {
  const lower = (v: string) => v.trim().toLowerCase();
  const result = items.filter(
    (item) =>
      (!f.purpose || item.purpose === f.purpose) &&
      (!f.category || item.category === f.category) &&
      (!f.kind || lower(item.kind).includes(lower(f.kind))) &&
      (!f.city || lower(`${item.city} ${item.locality}`).includes(lower(f.city))) &&
      (!f.q ||
        lower(`${item.title} ${item.locality} ${item.city} ${item.kind}`).includes(lower(f.q))) &&
      (!f.bed || item.bedrooms >= Number(f.bed)) &&
      (!f.bhk || item.bedrooms === Number(f.bhk)) &&
      (!f.min || item.price >= Number(f.min)) &&
      (!f.max || item.price <= Number(f.max)) &&
      (!f.minArea || item.area >= Number(f.minArea)) &&
      (!f.maxArea || item.area <= Number(f.maxArea)) &&
      (!f.furn || item.furnishing === f.furn) &&
      (!f.verified || item.verified),
  );
  if (f.sort === "area") result.sort((a, b) => b.area - a.area);
  if (f.sort.startsWith("price"))
    result.sort(
      (a, b) =>
        a.purpose.localeCompare(b.purpose) ||
        (f.sort === "price-low" ? a.price - b.price : b.price - a.price),
    );
  return result;
}
export function filterLabels(f: Filters) {
  const labels: Partial<Record<keyof Filters, string>> = {
    purpose: f.purpose === "rent" ? "Rent" : "Buy",
    category: (
      {
        residential: "Homes",
        commercial: "Commercial",
        pg: "PG / Co-living",
        plot: "Plots",
      } as Record<string, string>
    )[f.category],
    city: f.city,
    q: f.q,
    kind: f.kind,
    bed: `${f.bed}+ bedrooms`,
    bhk: `${f.bhk} BHK`,
    min: `From ₹${Number(f.min).toLocaleString("en-IN")}`,
    max: `Up to ₹${Number(f.max).toLocaleString("en-IN")}`,
    minArea: `From ${f.minArea} sq.ft.`,
    maxArea: `Up to ${f.maxArea} sq.ft.`,
    furn: f.furn,
    verified: "Sample verification flag",
  };
  return (Object.keys(labels) as (keyof Filters)[])
    .filter((key) => f[key])
    .map((key) => ({ key, label: labels[key] || f[key] }));
}
