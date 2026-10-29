import type { Metadata } from "next";
import { demoListings, getListing } from "@/lib/demo-data";
import { PropertyDetailExperience } from "./PropertyDetailExperience";

type PropertyPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return demoListings.map((listing) => ({ id: listing.id }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) return { title: "Property not found" };
  const title = `${listing.title} in ${listing.locality}, ${listing.city}`;
  const description = `${listing.kind} in ${listing.locality}, ${listing.city}. ${listing.priceLabel}. View property facts and illustrative photos.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: [{ url: listing.image, alt: `${listing.kind} in ${listing.locality}, ${listing.city}` }] },
    twitter: { card: "summary_large_image", title, description, images: [listing.image] },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  return <PropertyDetailExperience id={id}/>;
}
