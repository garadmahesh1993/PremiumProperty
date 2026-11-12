import { PropertyTile } from "@/components/social/PropertyTile";
import type { DemoListing } from "@/lib/demo-data";
export function ListingCard({ item }: { item: DemoListing }) {
  return <PropertyTile item={item} />;
}
