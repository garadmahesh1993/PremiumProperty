"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { demoProjects } from "@/lib/demo-data";

const featuredProjects = demoProjects.map((project) => ({
  ...project,
  developer: "PremiumProperty collection",
}));
const localities = ["Wakad", "Baner", "Koregaon Park", "Viman Nagar", "Kothrud"];
const ROTATION_MS = 7000;

export function FeaturedDiscovery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressCycle, setProgressCycle] = useState(0);
  const active = featuredProjects[activeIndex];
  const next = featuredProjects[(activeIndex + 1) % featuredProjects.length];

  useEffect(() => {
    if (paused || featuredProjects.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % featuredProjects.length);
      setProgressCycle((cycle) => cycle + 1);
    }, ROTATION_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused, progressCycle]);

  function selectProject(index: number) {
    setActiveIndex(index);
    setProgressCycle((cycle) => cycle + 1);
  }
  function move(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + featuredProjects.length) % featuredProjects.length);
    setProgressCycle((cycle) => cycle + 1);
  }
  function togglePaused() {
    setPaused((value) => !value);
    setProgressCycle((cycle) => cycle + 1);
  }

  return (
    <>
      <section className="locality-feature-band" aria-label="Popular Pune localities">
        <div className="locality-feature-inner">
          <div className="locality-feature-heading"><span aria-hidden="true">⌖</span><strong>Popular localities</strong></div>
          <div className="locality-chip-list">
            {localities.map((locality) => (
              <Link key={locality} href={"/explore?city=Pune&q=" + encodeURIComponent(locality)} className="locality-chip">
                {locality}<span aria-hidden="true">›</span>
              </Link>
            ))}
          </div>
          <Link className="locality-all-link" href="/explore?city=Pune" aria-label="Explore all Pune listings">→</Link>
          <div className="locality-owner-cta"><span>Are you a property owner?</span><Link href="/post-property">Post a property for free <span aria-hidden="true">›</span></Link></div>
        </div>
      </section>

      <section className="top-picks-section" aria-labelledby="top-picks-title">
        <div className="top-picks-heading">
          <div>
            <span className="eyebrow">FEATURED PROJECTS</span>
            <h2 id="top-picks-title">PremiumProperty&apos;s top picks</h2>
            <p>Explore featured sample homes and communities.</p>
          </div>
          <div className="top-picks-thumbnails" role="tablist" aria-label="Choose a featured project">
            {featuredProjects.map((project, index) => (
              <button key={project.slug} type="button" role="tab" aria-selected={activeIndex === index} aria-controls="top-pick-active" className={"top-pick-tab " + (activeIndex === index ? "is-active" : "")} onClick={() => selectProject(index)}>
                <img src={project.image} alt="" loading="lazy" />
                <span>{project.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="top-picks-carousel" aria-roledescription="carousel">
          <article className="top-pick-card" id="top-pick-active" role="tabpanel" aria-label={active.name + ", " + active.city}>
            <div className="top-pick-copy">
              <div className="top-pick-developer">
                <span className="top-pick-developer-mark" aria-hidden="true">PP</span>
                <div><strong>{active.developer}</strong><Link href="/projects">View projects</Link></div>
              </div>
              <div className="top-pick-details">
                <span className="top-pick-demo-label">SAMPLE PROJECT</span>
                <h3>{active.name}</h3>
                <p>{active.locality}, {active.city}</p>
                <strong className="top-pick-price">{active.from}</strong>
                <p className="top-pick-config">{active.config} homes</p>
                <Link className="button button-teal top-pick-contact" href={"/project/" + active.slug}>View project details <span aria-hidden="true">→</span></Link>
              </div>
              <div className="top-pick-progress" aria-hidden="true"><span key={active.slug + "-" + progressCycle} className={paused ? "is-paused" : ""} style={{ animationDuration: ROTATION_MS + "ms" }} /></div>
            </div>
            <div className="top-pick-image-wrap">
              <Link href={"/project/" + active.slug} className="top-pick-image-link" aria-label={"View details for " + active.name}>
                <img key={active.slug} className="top-pick-image" src={active.image} alt={active.name + " sample project"} />
              </Link>
              <span className="top-pick-image-caption">Illustrative project image</span>
              <button type="button" className="top-pick-pause" aria-label={paused ? "Resume featured project rotation" : "Pause featured project rotation"} aria-pressed={paused} onClick={togglePaused}>
                {paused ? <span aria-hidden="true">▶</span> : <span aria-hidden="true">Ⅱ</span>}
              </button>
            </div>
          </article>

          <aside className="top-pick-next" aria-label={"Next featured project: " + next.name}>
            <img src={next.image} alt="" loading="lazy" />
            <div><span>UP NEXT</span><strong>{next.name}</strong><small>{next.locality}, {next.city}</small></div>
            <button type="button" onClick={() => move(1)} aria-label="Show next featured project">→</button>
          </aside>

          <div className="top-pick-controls" aria-label="Featured project controls">
            <button type="button" onClick={() => move(-1)} aria-label="Previous featured project">←</button>
            <span>{String(activeIndex + 1).padStart(2, "0")} / {String(featuredProjects.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => move(1)} aria-label="Next featured project">→</button>
          </div>
        </div>
        <p className="top-picks-disclaimer">Sample project information and images are illustrative. They are not live property offers.</p>
      </section>
    </>
  );
}

