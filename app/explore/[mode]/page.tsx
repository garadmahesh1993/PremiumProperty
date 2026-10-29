import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExploreExperience, type SearchMode } from "@/components/search/ExploreExperience";
import { searchPageMetadata } from "@/lib/site-metadata";

const pages: Record<SearchMode, { title: string; description: string; image: string }> = {
  buy: { title: "Homes for sale in India", description: "Explore homes and apartments for sale by location, type, and budget.", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80" },
  rent: { title: "Homes for rent in India", description: "Explore rental homes and apartments by location, budget, and furnishing.", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80" },
  commercial: { title: "Commercial spaces to buy or lease", description: "Explore offices, shops, and commercial properties by location and budget.", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80" },
  pg: { title: "PG and co-living stays in India", description: "Explore PG accommodation and co-living stays by locality and furnishing.", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80" },
  plots: { title: "Plots and land for sale in India", description: "Explore sample residential and other plots by location.", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80" },
};

type ModePageProps = { params: Promise<{ mode: string }> };

export async function generateMetadata({ params }: ModePageProps): Promise<Metadata> {
  const { mode } = await params;
  const page = Object.prototype.hasOwnProperty.call(pages, mode) ? pages[mode as SearchMode] : undefined;
  return page ? searchPageMetadata(page.title, page.description, page.image) : { title: "Explore properties | PremiumProperty" };
}

export default async function ModeExplorePage({ params }: ModePageProps) {
  const { mode } = await params;
  if (!Object.prototype.hasOwnProperty.call(pages, mode)) notFound();
  return <ExploreExperience initialMode={mode as SearchMode}/>;
}
