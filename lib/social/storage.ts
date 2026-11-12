export const COLLECTIONS_KEY = "premiumproperty-collections";
export type Collection = { id: string; name: string; propertyIds: string[] };
export function readCollections(): Collection[] {
  if (typeof window === "undefined") return [];
  try {
    const records = JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || "[]");
    return Array.isArray(records)
      ? records
          .filter(
            (item) =>
              item &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              Array.isArray(item.propertyIds),
          )
          .map((item) => ({
            ...item,
            propertyIds: item.propertyIds.filter((id: unknown) => typeof id === "string"),
          }))
      : [];
  } catch {
    return [];
  }
}
