import Link from "next/link";
import { demoProjects } from "@/lib/demo-data";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

type ProjectsPageProps = { searchParams: Promise<{ city?: string }> };

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { city = "" } = await searchParams;
  const visibleProjects = city
    ? demoProjects.filter((project) => project.city.toLowerCase() === city.trim().toLowerCase())
    : demoProjects;

  return <><SiteHeader/><main id="main-content" className="route-page">
    <div className="route-title"><div><span className="eyebrow">NEW COMMUNITIES</span><h1>{city ? "New projects in " + city : "Explore projects"}</h1><p>Compare illustrative project profiles, layouts and locations.</p></div><Link className="button button-teal" href="/post-property">List a project →</Link></div>
    {visibleProjects.length ? <div className="project-grid project-grid-large">{visibleProjects.map((project) => <Link href={"/project/" + project.slug} className="project-card" key={project.slug}><div className="project-image" style={{ backgroundImage: "url(\"" + project.image + "\")" }}/><div className="project-info"><span>PROJECT · {project.city.toUpperCase()}</span><h3>{project.name}</h3><p>{project.locality} · {project.config}</p><strong>{project.from}</strong><small>{project.possession}</small></div></Link>)}</div> : <div className="empty-state"><span>⌕</span><h3>No projects listed in {city}</h3><p>There are no projects for this city in the current catalog. Explore all listed projects instead.</p><Link className="button button-teal" href="/projects">Show all projects</Link></div>}
    <p className="demo-disclaimer">Project information and pricing are illustrative examples.</p>
  </main><SiteFooter/></>;
}


