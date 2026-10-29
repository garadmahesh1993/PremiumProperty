import type { Metadata } from "next";
import "./globals.css";

const siteTitle = "PremiumProperty | Find a place that feels like yours";
const siteDescription = "Explore homes, apartments, rentals, commercial spaces, PG stays, plots, and projects with PremiumProperty.";
const socialImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80";

export const metadata: Metadata = {
  title: { default: siteTitle, template: "%s | PremiumProperty" },
  description: siteDescription,
  openGraph: { title: siteTitle, description: siteDescription, siteName: "PremiumProperty", type: "website", images: [{ url: socialImage, alt: "A bright contemporary home" }] },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription, images: [socialImage] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
