import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PremiumProperty | Find a place that feels like yours",
  description: "Explore homes, apartments and new projects in India with PremiumProperty.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
