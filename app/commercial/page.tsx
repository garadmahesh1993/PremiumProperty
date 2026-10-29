import { ExploreExperience } from "@/components/search/ExploreExperience";
import { searchPageMetadata } from "@/lib/site-metadata";
export const metadata = searchPageMetadata("Commercial spaces to buy or lease", "Explore offices, shops, and commercial properties by location and budget with PremiumProperty.", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80");
export default function Page(){ return <ExploreExperience initialMode="commercial"/>; }
