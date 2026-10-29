import { ExploreExperience } from "@/components/search/ExploreExperience";
import { searchPageMetadata } from "@/lib/site-metadata";
export const metadata = searchPageMetadata("PG and co-living stays in India", "Explore PG accommodation and co-living stays by locality and furnishing with PremiumProperty.", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80");
export default function Page(){ return <ExploreExperience initialMode="pg"/>; }
