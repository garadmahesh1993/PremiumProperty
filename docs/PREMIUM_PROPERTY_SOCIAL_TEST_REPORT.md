# Premium Property: validation report

## Method

The running local application is exercised in an isolated Chromium browser context. Tests do not send emails, place phone calls, upload media to a server, publish listings or modify a real browser profile. Test account details and photos are local fixtures.

Commands:

```sh
npm run typecheck
npm test
npm run build
npm run test:social
node scripts/social-final-review.cjs
npm run test:performance
```

`QA_URL` selects an already running server. Browser scripts use Playwright's Chromium channel. The browser suite writes `docs/social-qa-results.json` and screenshots under `docs/screenshots/`. The unit-test command uses Node's built-in TypeScript stripping (run under Node 24.11.0 here). The additional final-review script writes `social-final-review-results.json`. Use `npx playwright install chromium` if its executable is missing.

For concurrent local editing/building, use an isolated production output. In PowerShell, set `$env:PP_SOCIAL_QA='1'` before both `npm run build` and `npm run start -- --hostname 127.0.0.1 --port 3100`. This selects ignored `.next-social-validation/`; default development and production outputs remain `.next/` and `.next-production/`. A concurrent rebuild of the shared production directory caused 404 asset requests during one intermediate run. That run was stopped, the output was isolated, and verification was repeated against a consistent build.

## Current verification

- TypeScript: passed.
- Production build: passed, including existing and new routes.
- Pure search unit tests: 8 passed, 0 failed.
- Main-route viewport checks: all 90 combinations passed at 320, 360, 375, 390, 430, 768, 1024, 1280 and 1440 px in the initial complete sweep.
- Browser regression suite at `http://localhost:3000`: 116 passed, 0 failed. This includes 10 functional scenarios, 90 main-page/viewport checks and 16 retained-route checks. No browser page errors were observed. Raw result: [social-qa-results.json](social-qa-results.json).
- Automated accessibility: zero violations in 21 axe scans against WCAG 2 A/AA, 2.1 AA and 2.2 AA tags: ten primary pages at 390px and 1440px, plus the mobile filter dialog. This does not certify full WCAG conformance.
- Final targeted review: 27 additional viewport checks after the discovery/profile/account refinements, and zero violations in 23 additional axe scans. This includes every composer step at both widths, gallery/collection/filter dialogs and the final discovery/profile/account/detail pages. Gallery and filter Tab loops remained inside the modal; Escape returned focus. Raw result: [social-final-review-results.json](social-final-review-results.json).
- `git diff --check`: passed. Git emits informational Windows line-ending warnings. Node emits a non-fatal module-type warning while running the search tests; test execution succeeds.

## Functional coverage

Feed galleries and pagination; URL restoration; saved-property persistence; collection creation/membership; catalogue and project search; filtering/sorting; mobile dialogs; detail facts and public contact destinations; local sign-in return path; incomplete-draft prevention; invalid image recovery; photo/cover persistence; sharing; reduced motion; storage-failure feedback; legacy-route rendering.

Early runs found and corrected gallery arrow-key handling from the dialog heading, modal Tab wrapping and low-contrast inherited labels. Tests were also corrected to use the datalist input's accessible label, the redesigned detail selector, independent hydrated page state, separate sale/rent price sorting, and an explicit clipboard fallback. The final production suite has no failed cases. Native sharing is checked through its payload handoff; an operating-system share sheet is not automated. No test sends a real email or makes a phone call.

## Manual visual and keyboard review

Desktop/mobile feed, discovery, operator profile and composer screenshots were visually inspected. Mobile discovery spacing was tightened to bring its property media higher. Gallery arrow keys, Escape/focus restoration and dialog Tab containment are exercised through browser automation. Touch swipe handling exists in the gallery but has not been validated on a physical touch device. Full screen-reader testing, Safari/Firefox, physical touch-device testing, zoom/text-spacing checks and moderated usability sessions remain follow-up work; automated scans alone do not establish complete WCAG conformance. Route checks confirm successful rendering and overflow behavior, not exhaustive regression coverage of every retained calculator/workspace action.

## Screenshots

- [Desktop feed](screenshots/feed-1440.png)
- [Mobile feed](screenshots/feed-390.png)
- [Desktop discovery](screenshots/explore-1440.png)
- [Mobile discovery](screenshots/explore-390.png)
- [Mobile property creation](screenshots/post-property-390.png)
- [Saved collections](screenshots/saved-1440.png)
- [Public profile](screenshots/profiles-1440.png)
- [Mobile discovery grid](screenshots/explore-grid-390.png)
- [Property details](screenshots/property-1440.png)
- [Mobile photo creation](screenshots/composer-photos-390.png)
- [Mobile complete draft review](screenshots/composer-review-390.png)

## Performance

Measured with PerformanceObserver/navigation/resource timing in headless Chromium against `next start` on loopback, with fresh browser contexts and no CPU/network throttling. Image optimization/server caches may already be warm. Three loads each at 390px and 1440px. Raw values and environment are in [social-performance-results.json](social-performance-results.json). INP was not measured. A separate throttled Lighthouse measurement is recorded below. These are local lab observations, not production readiness or field Core Web Vitals claims.

| Feed measurement, median of 3 | 390px | 1440px |
| --- | --- | --- |
| LCP | 308 ms | 340 ms |
| CLS | 0 | 0 |
| TTFB | 4 ms | 5 ms |
| Resource transfer | 342,772 bytes | 476,164 bytes |
| Rendered posts | 4 | 4 |
| DOM elements | 593 | 596 |

The resource snapshot includes observed image and route-prefetch requests during the sample window; it is not a total transfer budget for an entire browsing session. No baseline-versus-final performance improvement is claimed.


### Final production-build Lighthouse check

A separate mobile Lighthouse run against the local `next start` server on port 3001 used Lighthouse mobile network/CPU simulation. The navigation-prefetch adjustment was included. All requested resources loaded successfully and no console errors were reported.

| Metric | Observed result |
| --- | --- |
| Performance score | 91 / 100 |
| Accessibility score | 100 / 100 |
| Best practices score | 100 / 100 |
| Largest Contentful Paint | 3.5 s |
| Total Blocking Time | 80 ms |
| Cumulative Layout Shift | 0 |

Raw report: [lighthouse-feed-mobile.json](lighthouse-feed-mobile.json). These scores apply to the measured local feed load, not the entire platform or production users. LCP still needs further optimization before claiming a good field experience; image delivery, critical styles and actual hosting/network behavior should be measured in the next phase. Earlier observer measurements above were unthrottled and are not directly comparable.

The final production smoke check also passed feed hydration/saving, URL-filtered discovery and gallery keyboard interaction, with no failed resources or runtime errors: [production-smoke-results.json](production-smoke-results.json).
