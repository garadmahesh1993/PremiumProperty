import { ExploreExperience } from "@/components/search/ExploreExperience";
import { searchPageMetadata } from "@/lib/site-metadata";
export const metadata = searchPageMetadata("Plots and land for sale in India", "Explore sample residential and other plots by location with PremiumProperty.", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80");
export default function Page(){ return <ExploreExperience initialMode="plots"/>; }
