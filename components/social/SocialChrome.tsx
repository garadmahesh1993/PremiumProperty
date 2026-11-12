"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeSearch } from "@/components/search/HomeSearch";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import { RecentSearches } from "./RecentSearches";
const navigation = [
  { label: "Home", href: "/", icon: "home" as const },
  { label: "Explore", href: "/explore", icon: "explore" as const },
  { label: "Reels", href: "/reels", icon: "reels" as const },
  { label: "Saved", href: "/saved", icon: "bookmark" as const },
  { label: "Messages", href: "/messages", icon: "message" as const },
  { label: "Profile", href: "/account", icon: "user" as const },
];
export function SocialChrome() {
  const pathname = usePathname();
  const [search, setSearch] = useState(false);
  const [initial, setInitial] = useState("P");
  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("pp-account-profile") || "null");
      if (profile?.name) setInitial(String(profile.name).charAt(0).toUpperCase());
    } catch {}
  }, []);
  const active = (href: string) =>
    href === "/"
      ? pathname === "/"
      : href === "/explore"
        ? ["/explore", "/buy", "/rent", "/commercial", "/pg", "/plots", "/projects"].some(
            (path) => pathname === path || pathname.startsWith(`${path}/`),
          )
        : pathname === href;
  return (
    <div className="sp-chrome">
      <a className="sp-skip" href="#main-content">
        Skip to content
      </a>
      <header className="sp-topbar">
        <Link prefetch={false} className="sp-brand" href="/">
          <span className="sp-logo">
            <Icon name="home" size={22} />
          </span>
          <span>
            Premium
            <span>
              Property<span className="sp-brand-dot">.</span>
            </span>
          </span>
        </Link>
        <button type="button" className="sp-global-search" onClick={() => setSearch(true)}>
          <Icon name="search" size={20} />
          <span>Search a city, a neighbourhood, a new beginning…</span>
          <kbd>Search</kbd>
        </button>
        <div className="sp-top-actions">
          <button
            type="button"
            className="sp-icon-button sp-mobile-search"
            aria-label="Search properties"
            onClick={() => setSearch(true)}
          >
            <Icon name="search" />
          </button>
          <Link prefetch={false} href="/post-property" className="sp-create-top" aria-label="Post property">
            <Icon name="plus" size={20} />
            <span>Post property</span>
          </Link>
          <Link prefetch={false} className="sp-avatar sp-top-avatar" href="/account" aria-label="Your profile">
            {initial}
          </Link>
        </div>
      </header>
      <aside className="sp-sidebar">
        <nav aria-label="Main navigation">
          {navigation.map((item) => (
            <Link prefetch={false}
              key={item.href}
              href={item.href}
              className={active(item.href) ? "active" : ""}
              aria-current={active(item.href) ? "page" : undefined}
            >
              <Icon name={item.icon} size={23} />
              <span>{item.label}</span>
              {item.label === "Reels" && <small>Coming soon</small>}
            </Link>
          ))}
          <Link prefetch={false} href="/post-property" className="sp-sidebar-post">
            <Icon name="plus" size={21} />
            Create a property post
          </Link>
        </nav>
        <div className="sp-sidebar-bottom">
          <Link prefetch={false} href="/profiles/aj-nova-reality">
            <span className="sp-avatar sp-team-avatar">AN</span>
            <span>
              <strong>AJ NOVA REALITY</strong>
              <small>
                Meet the team <Icon name="arrow" size={12} />
              </small>
            </span>
          </Link>
          <div>
            <Link prefetch={false} href="/about">About</Link>
            <Link prefetch={false} href="/guides">Guides</Link>
            <Link prefetch={false} href="/services">Tools</Link>
            <Link prefetch={false} href="/contact">Contact</Link>
            <Link prefetch={false} href="/privacy">Privacy</Link>
            <Link prefetch={false} href="/terms">Terms</Link>
            <Link prefetch={false} href="/dashboard">Workspace</Link>
          </div>
          <p>
            © 2026 Premium Property
            <br />
            Sample properties. Real possibilities.
          </p>
        </div>
      </aside>
      <nav className="sp-bottom-nav" aria-label="Mobile navigation">
        {navigation
          .filter((item) => item.label !== "Messages")
          .map((item) => (
            <Link prefetch={false}
              key={item.href}
              href={item.href}
              className={active(item.href) ? "active" : ""}
              aria-current={active(item.href) ? "page" : undefined}
            >
              <Icon name={item.icon} size={22} />
              <span>{item.label}</span>
            </Link>
          ))}
      </nav>
      <Modal
        open={search}
        onClose={() => setSearch(false)}
        title="Find your next place"
        className="sp-search-modal"
      >
        <HomeSearch />
        <RecentSearches />
      </Modal>
    </div>
  );
}
