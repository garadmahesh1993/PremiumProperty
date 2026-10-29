import { ExploreExperience } from "@/components/search/ExploreExperience";
import { searchPageMetadata } from "@/lib/site-metadata";
export const metadata = searchPageMetadata("Homes for rent in India", "Explore rental homes and apartments by location, budget, and furnishing with PremiumProperty.", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80");
export default function Page(){ return <ExploreExperience initialMode="rent"/>; }
