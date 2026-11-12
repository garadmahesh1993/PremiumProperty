# Premium Property social discovery

A Next.js property-discovery application with a visual social feed, app navigation, saved collections and a local property-post composer. Existing sample data, search routes and browser-local account workflows are preserved.

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

- `/` - property post feed with four-post URL pagination, neighbourhood shortcuts, swipeable galleries, saves, sharing and collections.
- App navigation - desktop sidebar and search/create top bar; mobile Home, Explore, Reels, Saved and Profile bottom bar.
- `/explore` - visual catalog, project discovery, URL filters, sorting, active chips, responsive filter dialog and browser-local saved/recent searches.
- `/buy`, `/rent`, `/commercial`, `/pg`, `/plots` - discovery with category defaults.
- `/property/pp-101` - full gallery, property facts and existing public business email/phone inquiry links. No online visit booking.
- `/saved` - browser-local saved properties and named private collections.
- `/profiles/premium-property`, `/profiles/aj-nova-reality` - editorial/platform-operator profiles; sample listings are not attributed to an individual seller.
- `/post-property` - six-step local draft with validation, photo previews, cover selection, live preview and recovery.
- `/reels`, `/messages` - clearly unavailable, with working gallery/contact alternatives.
- `/projects`, `/project/the-canopy` - existing sample projects.
- `/login`, `/signup`, `/account` - existing simulated sign-in and local profile/activity.
- `/services`, `/guides`, `/dashboard` - retained tools, guidance and illustrative broker workspace.

Implementation, research, design, testing and backend requirements are recorded in the five `docs/PREMIUM_PROPERTY_SOCIAL_*.md` reports. Run `npm test`, `npm run typecheck` and `npm run build` for checks. With a local server running, use `npm run test:social`; `QA_URL` selects its address. Browser tests require Playwright Chromium (`npx playwright install chromium`). `node scripts/social-final-review.cjs` and `npm run test:performance` default to a production preview at `http://127.0.0.1:3100`.

## Demo limitations

This remains a frontend demo. The original property/project content is fictional. Saves, collections, searches, account details and text drafts stay in this browser. Draft photo blobs are retained in this browser's IndexedDB; no media is uploaded or published. Sign-in is simulated and does not verify identity or send SMS. No server database, messaging, video, notifications, listing publication or visit-booking service is connected.

Google Places remains optional for global location suggestions; Photon/OpenStreetMap is the fallback. Inquiry links open the existing public business Gmail compose page or your phone handler; the app does not send or confirm a message. Shared listing media uses cached local sample photos with responsive Next Image delivery; some retained project/secondary-page images still use external URLs.

No deployment, commit or push is included in this work. Connect secure backend services and replace illustrative data with authorized real inventory before commercial use.
