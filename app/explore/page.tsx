import type { Metadata } from "next";
import { ExploreExperience } from "@/components/search/ExploreExperience";
import { searchPageMetadata } from "@/lib/site-metadata";

type ExplorePageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: ExplorePageProps): Promise<Metadata> {
  const params = await searchParams;
  const cityValue = params.city;
  const city = Array.isArray(cityValue) ? cityValue[0] : cityValue;
  const purposeValue = params.purpose;
  const purpose = Array.isArray(purposeValue) ? purposeValue[0] : purposeValue;
  const categoryValue = params.category;
  const category = Array.isArray(categoryValue) ? categoryValue[0] : categoryValue;
  const mode = category === "commercial" ? "Commercial spaces" : category === "pg" ? "PG and co-living stays" : category === "plot" ? "Plots for sale" : purpose === "rent" ? "Homes for rent" : purpose === "buy" ? "Homes for sale" : "Explore properties";
  const title = `${mode}${city ? ` in ${city}` : " in India"}`;
  const description = `Search ${mode.toLowerCase()}${city ? ` in ${city}` : " across India"} by location, property type, and budget.`;
  return searchPageMetadata(title, description, "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80");
}

export default function ExplorePage() { return <ExploreExperience/>; }
