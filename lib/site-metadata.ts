import type { Metadata } from "next";

export function searchPageMetadata(title: string, description: string, image: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: [{ url: image, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
