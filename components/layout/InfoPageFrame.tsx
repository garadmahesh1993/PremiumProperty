import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

type InfoPageFrameProps = { eyebrow: string; title: string; description: string; children: ReactNode };

export function InfoPageFrame({ eyebrow, title, description, children }: InfoPageFrameProps) {
  return <>
    <SiteHeader />
    <main id="main-content" className="route-page info-page">
      <header className="info-hero">
        <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
        <span className="info-hero-mark" aria-hidden="true">P.</span>
      </header>
      <div className="info-content">{children}</div>
    </main>
    <SiteFooter />
  </>;
}
