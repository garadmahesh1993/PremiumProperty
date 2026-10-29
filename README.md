# PremiumProperty frontend demo

A responsive Next.js frontend for a real-estate discovery and broker workflow concept. The interface follows the supplied visual references' teal/orange palette, clean white surfaces, rounded cards, and restrained typography while retaining the PremiumProperty identity.

## Run in IntelliJ IDEA

1. Install Node.js LTS and restart IntelliJ IDEA.
2. Choose **File → Open** and open this `premiumproperty` folder (the folder containing `package.json`).
3. Open IntelliJ's **Terminal** panel.
4. Run `npm install` once.
5. Run `npm run dev`.
6. Open the local URL printed in the terminal, usually `http://localhost:3000`.
7. Stop the server with **Ctrl+C** in that terminal.

Edit route pages in `app/`, shared interface components in `components/`, and styles in `app/globals.css`. Development mode reloads saved changes.


## Code organization

- `app/` contains the Next.js routes and the global stylesheet.
- `components/layout/` contains the shared site header, footer, and information-page frame.
- `components/search/` contains the home search and the shared property search experience.
- `components/property/` contains listing cards and saved-property controls.
- `components/discovery/` contains the featured discovery section.
- `lib/demo-data.ts` contains the local property and project data used by the frontend.

## Google Places setup (optional)

1. In Google Cloud Console, create a project, enable billing, and enable Maps JavaScript API and Places API (New).
2. Create an API key restricted to your website referrers (for local development, `http://localhost:3000/*` and `http://localhost:3001/*`) and restrict it to the Maps JavaScript API and Places API.
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to that restricted key. Restart `npm run dev`.
4. The homepage autocomplete then uses Google Places, with session tokens and Google Maps attribution. Without a configured key, the existing Photon/OpenStreetMap place suggestions remain as a fallback.

The key is visible in browser requests, so website/API restrictions are essential. Add public terms and privacy pages that meet Google Maps Platform requirements before production launch.

## Main routes and interactions

- `/` — responsive home page with Buy, Rent, Commercial, PG/Co-living and Plots search tabs, city suggestions, search and listing links.
- Header — Location city menu and hover-open For Buyers, For Tenants, For Sellers, Services, and News & Guides menus. The menus also work by keyboard focus and by tap on small screens.
- `/explore` — results page with purpose, category, property type, city, keyword, bedroom/BHK, budget, furnishing and verification filters; sorting, demo-map toggle, shortlist and saved searches.
- `/property/pp-101` — property details, saved property control and enquiry/site-visit demo actions.
- `/projects` and `/project/the-canopy` — project directory and detail page.
- `/post-property` — six-step property draft.
- `/login` — simulated phone/code sign-in; no SMS is sent.
- `/account` — saved homes and searches stored in this browser.
- `/dashboard` — sample broker workspace.
- `/services` — EMI calculator, affordability links, indicative price planner and printable demo rent receipt.
- `/guides` — buying, renting, selling and neighbourhood checklists.

## Demo limitations

This is a frontend demo. Property and project content is fictional. Favorites, saved searches, the account stub and listing draft are stored locally in the current browser. The sign-in code is simulated; no SMS, real account, server, property database, file upload, notification, or messaging service is connected. Google Places is available for homepage suggestions when configured; Photon/OpenStreetMap is used without a Google key. Enquiry and site-visit actions show a local demo confirmation only. Replace the demo data and connect a secure backend before using this as a live property service.

Sample photos load from Unsplash and need an internet connection.



