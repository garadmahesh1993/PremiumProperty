import { ExploreExperience } from "@/components/search/ExploreExperience";
import { searchPageMetadata } from "@/lib/site-metadata";
export const metadata = searchPageMetadata("Homes for sale in India", "Explore homes, apartments, and properties for sale with PremiumProperty.", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80");
export default function Page(){ return <ExploreExperience initialMode="buy"/>; }
