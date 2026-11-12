export const RECENT_SEARCHES_KEY = "premiumproperty-recent-searches";
export type RecentSearch = {
  id: string;
  title: string;
  query: Record<string, string>;
  createdAt: string;
};
export function readRecentSearches(): RecentSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
    return Array.isArray(value)
      ? value.filter(
          (item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.title === "string" &&
            item.query &&
            typeof item.query === "object",
        )
      : [];
  } catch {
    return [];
  }
}
export function rememberSearch(query: URLSearchParams, title: string) {
  try {
    const next = {
      id: Date.now().toString(),
      title,
      query: Object.fromEntries(query),
      createdAt: new Date().toLocaleDateString("en-IN"),
    };
    const previous = readRecentSearches();
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(
        [
          next,
          ...previous.filter((item) => JSON.stringify(item.query) !== JSON.stringify(next.query)),
        ].slice(0, 12),
      ),
    );
    window.dispatchEvent(new Event("pp-account-activity"));
  } catch {
    /* Search still works when optional browser history is unavailable. */
  }
}
