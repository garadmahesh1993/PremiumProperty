import type { ReactNode } from "react";
import Link from "next/link";
import { demoProjects } from "@/lib/demo-data";
import { SocialChrome } from "./SocialChrome";
import { Photo } from "./Photo";
import { Icon } from "./Icon";
export function SocialShell({ children, rail = true }: { children: ReactNode; rail?: boolean }) {
  return (
    <>
      <SocialChrome />
      <main id="main-content" className={`sp-main ${rail ? "" : "sp-main-wide"}`}>
        <div className={rail ? "sp-layout" : ""}>
          <div className="sp-content">{children}</div>
          {rail && (
            <aside className="sp-right-rail">
              <div className="sp-rail-heading">
                <h2>Places to watch</h2>
                <Link prefetch={false} href="/explore">Explore all</Link>
              </div>
              <p className="sp-rail-note">Neighbourhoods in the collection</p>
              <div className="sp-area-tags">
                {["Baner", "Powai", "Whitefield", "Koregaon Park"].map((area) => (
                  <Link prefetch={false} key={area} href={`/explore?city=${encodeURIComponent(area)}`}>
                    <Icon name="pin" size={14} />
                    {area}
                  </Link>
                ))}
              </div>
              <div className="sp-rail-heading">
                <h2>The project edit</h2>
                <Link prefetch={false} href="/projects">View all</Link>
              </div>
              <div className="sp-rail-projects">
                {demoProjects.map((project) => (
                  <Link prefetch={false} key={project.slug} href={`/project/${project.slug}`}>
                    <div className="sp-rail-project-photo">
                      <Photo src={project.image} alt="" sizes="90px" />
                    </div>
                    <div>
                      <strong>{project.name}</strong>
                      <span>
                        {project.locality}, {project.city}
                      </span>
                      <b>{project.from}</b>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="sp-team-card">
                <div className="sp-team-card-top">
                  <span className="sp-avatar sp-team-avatar">AN</span>
                  <div>
                    <strong>AJ NOVA REALITY</strong>
                    <small>Platform operator</small>
                  </div>
                </div>
                <p>People behind your next property journey.</p>
                <Link prefetch={false} href="/profiles/aj-nova-reality">
                  Meet the team <Icon name="arrow" size={16} />
                </Link>
              </div>
              <div className="sp-rail-disclaimer">
                <Icon name="home" size={18} />
                <p>
                  A preview of property discovery.
                  <br />
                  Listings and photos are illustrative. No live availability is asserted.
                </p>
              </div>
            </aside>
          )}
        </div>
      </main>
    </>
  );
}
