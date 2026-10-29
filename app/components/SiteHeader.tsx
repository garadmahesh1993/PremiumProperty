"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const cities = [
  { name: "Pune", icon: "🏙️" },
  { name: "Mumbai", icon: "🌉" },
  { name: "Bengaluru", icon: "🏢" },
  { name: "Chennai", icon: "🏛️" },
  { name: "Kolkata", icon: "🌆" },
  { name: "Ahmedabad", icon: "🏘️" },
  { name: "Delhi", icon: "🏙️" },
  { name: "Noida", icon: "🏬" },
  { name: "Gurgaon", icon: "🏢" },
  { name: "Hyderabad", icon: "🌇" },
  { name: "Thane", icon: "🌳" },
  { name: "Navi Mumbai", icon: "🌉" },
];

const menus = {
  "For Buyers": [
    ["Apartments for sale", "/explore?purpose=buy&category=residential"],
    ["Independent homes & villas", "/explore?purpose=buy&kind=Villa"],
    ["Plots & land", "/explore?purpose=buy&category=plot"],
    ["Commercial property", "/explore?category=commercial"],
    ["1 BHK homes", "/explore?purpose=buy&bhk=1"],
    ["2 BHK homes", "/explore?purpose=buy&bhk=2"],
    ["3 BHK homes", "/explore?purpose=buy&bhk=3"],
    ["Popular searches in Pune", "/explore?purpose=buy&city=Pune"],
    ["New projects", "/projects"],
  ],
  "For Tenants": [
    ["Apartments for rent", "/explore?purpose=rent&category=residential"],
    ["Independent homes for rent", "/explore?purpose=rent&kind=Independent%20house"],
    ["PG & co-living", "/explore?category=pg"],
    ["Commercial rentals", "/explore?purpose=rent&category=commercial"],
    ["1 BHK rentals", "/explore?purpose=rent&bhk=1"],
    ["2 BHK rentals", "/explore?purpose=rent&bhk=2"],
    ["3 BHK rentals", "/explore?purpose=rent&bhk=3"],
    ["Popular rental areas", "/explore?purpose=rent&city=Pune"],
  ],
  "For Sellers": [
    ["Post a property", "/post-property"],
    ["Owner listing plans", "/services#listing-packages"],
    ["Broker workspace", "/dashboard"],
    ["Broker tools", "/dashboard"],
    ["Developer projects", "/projects"],
    ["Selling guide", "/guides#selling"],
  ],
  Services: [
    ["Home loan EMI calculator", "/services#emi"],
    ["Affordability planner", "/services#budget"],
    ["Property value guide", "/services#value-estimator"],
    ["Rent receipt checklist", "/services#rent-receipt"],
  ],
  "News & Guides": [
    ["About PremiumProperty", "/about"],
    ["Buying a home", "/guides#buying"],
    ["Renting a home", "/guides#renting"],
    ["Selling property", "/guides#selling"],
    ["Neighbourhood guides", "/guides#areas"],
  ],
};

const megaMenus: Partial<Record<MenuName, { title: string; links: [string, string][] }[]>> = {
  "For Buyers": [
    { title: "Property type", links: [["Flats", "/explore?purpose=buy&category=residential&kind=Apartment"], ["Houses", "/explore?purpose=buy&category=residential&kind=Independent%20house"], ["Builder floors", "/explore?purpose=buy&category=residential&kind=Builder%20floor"], ["Plots", "/plots"], ["Villas", "/explore?purpose=buy&category=residential&kind=Villa"], ["Commercial properties", "/commercial?purpose=buy"]] },
    { title: "Popular areas · Pune", links: ["Baner", "Koregaon Park", "Kothrud", "Wakad"].map((area) => [area, `/explore?purpose=buy&category=residential&city=Pune&q=${encodeURIComponent(area)}`]) },
    { title: "Search by BHK", links: [1, 2, 3, 4].map((count) => [`${count} BHK for sale in Pune`, `/explore?purpose=buy&category=residential&city=Pune&bhk=${count}`]) },
    { title: "Popular searches", links: [["Verified homes", "/explore?purpose=buy&category=residential&verified=true"], ["Homes under ₹1 Cr", "/explore?purpose=buy&category=residential&max=10000000"], ["New residential projects", "/projects"], ["Plots for sale", "/plots"], ["All homes for sale", "/buy"]] },
  ],
  "For Tenants": [
    { title: "Property type", links: [["Flats for rent", "/explore?purpose=rent&category=residential&kind=Apartment"], ["Houses for rent", "/explore?purpose=rent&category=residential&kind=Independent%20house"], ["Villas for rent", "/explore?purpose=rent&category=residential&kind=Villa"], ["PG / co-living", "/pg"], ["Commercial lease", "/commercial?purpose=rent"]] },
    { title: "Popular areas", links: [["Aundh · Pune", "Pune", "Aundh"], ["Sarjapur Road · Bengaluru", "Bengaluru", "Sarjapur Road"], ["Indiranagar · Bengaluru", "Bengaluru", "Indiranagar"], ["Chembur · Mumbai", "Mumbai", "Chembur"]].map(([label, city, area]) => [label, `/explore?purpose=rent&category=residential&city=${encodeURIComponent(city)}&q=${encodeURIComponent(area)}`]) },
    { title: "Search by BHK", links: [1, 2, 3].map((count) => [`${count} BHK for rent`, `/explore?purpose=rent&category=residential&bhk=${count}`]) },
    { title: "Popular searches", links: [["Fully furnished rentals", "/explore?purpose=rent&category=residential&furn=Fully%20furnished"], ["Semi-furnished rentals", "/explore?purpose=rent&category=residential&furn=Semi-furnished"], ["Rentals under ₹50,000", "/explore?purpose=rent&category=residential&max=50000"], ["PG / co-living", "/pg"], ["All homes for rent", "/rent"]] },
  ],
};
type MenuName = keyof typeof menus;

export function SiteHeader({ selectedLocation = "" }: { selectedLocation?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationScope, setLocationScope] = useState<"india" | "international">("india");
  const visibleCities = cities.filter((city) =>
    city.name.toLowerCase().includes(locationSearch.trim().toLowerCase()),
  );

  function chooseCity(city: string) {
    setOpen(null);
    setMobile(false);
    setLocationSearch("");
    setLocationScope("india");
    window.dispatchEvent(new CustomEvent("pp-location-change", { detail: city }));
  }

  function searchCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const city = locationSearch.trim();
    if (!city) return;
    chooseCity(city);
    router.push(`/explore?city=${encodeURIComponent(city)}`);
  }

  function showAllCities() {
    setOpen(null);
    setMobile(false);
    setLocationSearch("");
    setLocationScope("india");
    window.dispatchEvent(new Event("pp-clear-explore"));
  }

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="PremiumProperty home">
        <span className="brand-mark">P<span>.</span></span>
        <span className="brand-name">Premium<span>Property</span></span>
      </Link>

      <nav className="desktop-nav" aria-label="Main navigation">
        <div
          className={`nav-menu-wrap location-menu-wrap ${open === "Location" ? "is-open" : ""}`}
          onMouseEnter={() => setOpen("Location")}
          onMouseLeave={() => setOpen(null)}
        >
          <button
            className="nav-link menu-trigger"
            aria-expanded={open === "Location"}
            aria-haspopup="true"
            onClick={() => setOpen(open === "Location" ? null : "Location")}
          >
            {selectedLocation.trim() || "Location"}<span className="menu-caret">⌄</span>
          </button>
          <div className="nav-dropdown location-dropdown" role="dialog" aria-label="Choose a location">
            <form className="location-picker-search" onSubmit={searchCity}>
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Search for a city"
                value={locationSearch}
                onChange={(event) => setLocationSearch(event.target.value)}
                placeholder="Search for city"
              />
              {locationSearch && (
                <button type="button" aria-label="Clear city search" onClick={() => setLocationSearch("")}>
                  ×
                </button>
              )}
            </form>

            <div className="location-picker-content">
              {locationScope === "india" ? (
                <>
                  <h2>{locationSearch ? "Matching cities" : "Popular cities"}</h2>
                  {visibleCities.length ? (
                    <div className="location-city-grid">
                      {visibleCities.map((city) => (
                        <Link
                          className={`location-city-card ${selectedLocation.toLowerCase() === city.name.toLowerCase() ? "is-selected" : ""}`}
                          href={`/explore?city=${encodeURIComponent(city.name)}`}
                          key={city.name}
                          onClick={() => chooseCity(city.name)}
                        >
                          <span aria-hidden="true">{city.icon}</span>
                          <strong>{city.name}</strong>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="location-no-cities">
                      <strong>No city found</strong>
                      <span>Press Enter to search listings for “{locationSearch}”.</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="location-international-note">
                  <span aria-hidden="true">✦</span>
                  <strong>International listings are coming soon</strong>
                  <p>This website currently includes property information from India.</p>
                </div>
              )}
            </div>

            <div className="location-picker-footer">
              <div className="location-scope-tabs" aria-label="Location region">
                <button
                  type="button"
                  className={locationScope === "india" ? "active" : ""}
                  onClick={() => setLocationScope("india")}
                >
                  All India
                </button>
                <span aria-hidden="true">|</span>
                <button
                  type="button"
                  className={locationScope === "international" ? "active" : ""}
                  onClick={() => setLocationScope("international")}
                >
                  International
                </button>
              </div>
              <Link href="/explore" onClick={showAllCities}>
                View all cities <span aria-hidden="true">›</span>
              </Link>
            </div>
          </div>
        </div>

        {(Object.keys(menus) as MenuName[]).map((name) => (
          <div
            className={`nav-menu-wrap ${open === name ? "is-open" : ""}`}
            key={name}
            onMouseEnter={() => setOpen(name)}
            onMouseLeave={() => setOpen(null)}
          >
            <button
              className={`nav-link menu-trigger ${open === name ? "active" : ""}`}
              aria-expanded={open === name}
              aria-haspopup="true"
              onClick={() => setOpen(open === name ? null : name)}
            >
              {name}<span className="menu-caret">⌄</span>
            </button>
            <div className={`nav-dropdown ${megaMenus[name] ? "nav-mega-dropdown" : ""}`}>
              {megaMenus[name] ? <div className="nav-mega-grid">{megaMenus[name]!.map((column) => <section className="nav-mega-column" key={column.title}><h2>{column.title}</h2>{column.links.map(([label, href]) => <Link href={href} key={label} onClick={() => setOpen(null)}>{label}</Link>)}</section>)}</div> : <><div className="dropdown-kicker">{name.toUpperCase()}</div>{menus[name].map(([label, href]) => <Link href={href} key={label} onClick={() => setOpen(null)}>{label}<span>→</span></Link>)}</>}
            </div>
          </div>
        ))}
      </nav>

      <div className="header-actions">
        <Link className="text-button" href="/login">Log in</Link>
        <Link className="button button-teal button-small" href="/post-property">Post Property <span>→</span></Link>
        <button className="mobile-menu" aria-label={mobile ? "Close navigation" : "Open navigation"} aria-expanded={mobile} onClick={() => setMobile(!mobile)}>
          {mobile ? "×" : "☰"}
        </button>
      </div>

      {mobile && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <button className="mobile-location-trigger" aria-expanded={open === "Mobile Location"} onClick={() => setOpen(open === "Mobile Location" ? null : "Mobile Location")}>
            {selectedLocation.trim() || "Choose a city"}<span>⌄</span>
          </button>
          {open === "Mobile Location" && (
            <div className="mobile-location-panel">
              <form className="location-picker-search" onSubmit={searchCity}>
                <span aria-hidden="true">⌕</span>
                <input aria-label="Search for a city" value={locationSearch} onChange={(event) => setLocationSearch(event.target.value)} placeholder="Search for city" />
              </form>
              <div className="location-city-grid">
                {visibleCities.map((city) => (
                  <Link href={`/explore?city=${encodeURIComponent(city.name)}`} key={city.name} onClick={() => chooseCity(city.name)}>
                    <span aria-hidden="true">{city.icon}</span><strong>{city.name}</strong>
                  </Link>
                ))}
              </div>
              {!visibleCities.length && <p className="location-no-cities">No city found. Press Enter to search this location.</p>}
              <button className="mobile-all-cities" onClick={showAllCities}>View all cities →</button>
            </div>
          )}
          <Link href="/explore?purpose=buy">For Buyers · Homes for sale</Link>
          <Link href="/explore?purpose=rent">For Tenants · Homes for rent</Link>
          <Link href="/explore?category=commercial">Commercial property</Link>
          <Link href="/explore?category=pg">PG / Co-living</Link>
          <Link href="/explore?category=plot">Plots</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/post-property">For Sellers · Post a property</Link>
          <Link href="/dashboard">Broker workspace</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About us</Link>
          <Link href="/guides">News & Guides</Link>
          <Link href="/account">My shortlist</Link>
          {Object.entries(megaMenus).map(([menuName, columns]) => <section className="mobile-mega-section" key={menuName}><h2>{menuName}</h2><div>{columns?.flatMap((column) => column.links).map(([label, href]) => <Link href={href} key={`${menuName}-${label}`} onClick={() => setMobile(false)}>{label}</Link>)}</div></section>)}
        </nav>
      )}
    </header>
  );
}






