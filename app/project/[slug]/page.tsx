import type { Metadata } from "next";
import Link from "next/link";
import { demoProjects } from "@/lib/demo-data";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return demoProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = demoProjects.find((item) => item.slug === slug);
  if (!project) return { title: "Project not found" };
  const title = `${project.name} in ${project.locality}, ${project.city}`;
  const description = `Explore the ${project.name} sample project in ${project.locality}, ${project.city}: ${project.config}, from ${project.from}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: [{ url: project.image, alt: `${project.name}, sample project in ${project.city}` }] },
    twitter: { card: "summary_large_image", title, description, images: [project.image] },
  };
}

export default async function ProjectDetail({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = demoProjects.find((item) => item.slug === slug);
  if (!project) return <><SiteHeader/><main id="main-content" className="route-page empty-state"><h1>Project not found</h1><Link href="/projects">Explore projects</Link></main><SiteFooter/></>;
  return <><SiteHeader/><main id="main-content" className="route-page"><Link className="back-link" href="/projects">← All projects</Link><div className="project-detail-hero" role="img" aria-label={`Illustrative image for ${project.name}`} style={{backgroundImage:`linear-gradient(90deg,rgba(20,38,39,.72),rgba(20,38,39,.06)),url("${project.image}")`}}><span>FICTIONAL PROJECT PROFILE · {project.city.toUpperCase()}</span><h1>{project.name}</h1><p>{project.locality}, {project.city} · {project.config}</p></div><div className="project-detail-grid"><section><span className="eyebrow">ABOUT THE COMMUNITY</span><h2>A place designed around everyday life.</h2><p>{project.description} Project details shown here are illustrative only and are not verified regulatory or sales information.</p><h3>At a glance</h3><div className="property-facts"><span><b>{project.config}</b> Configurations</span><span><b>{project.from}</b> Sample pricing</span><span><b>{project.possession}</b> Status</span></div><Link className="button button-outline" href="/guides#buying">Read the buying guide →</Link></section><aside className="contact-card"><span>PROJECT ENQUIRY</span><h3>Interested in this project?</h3><p>Contact our team for help with the website or sample project page.</p><Link href="/contact" className="button button-orange">Contact AJ NOVA REALITY →</Link><small>Project availability, pricing, and developer details are not verified.</small></aside></div></main><SiteFooter/></>;
}
