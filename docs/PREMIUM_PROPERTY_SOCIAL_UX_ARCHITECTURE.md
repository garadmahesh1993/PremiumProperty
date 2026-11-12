# Premium Property: social UX architecture

## Audit and preserved architecture

The initial rendered homepage was inspected at localhost:3000; it returned HTTP 200 and already included uncommitted social-feed work. [The observed starting render](before-desktop.png) records that state. Existing search, details, account, simulated sign-in, six-step listing wizard and responsive styles were reviewed. The retained traditional pages used a marketing-page hierarchy, while the new feed navigation still linked to missing social routes. This implementation completes and integrates that work. Existing secondary-page photographs sometimes rely on external requests; shared feed/gallery media now uses cached local assets.

This is Next.js 16.4.1 App Router, React 19.3.0 and TypeScript. Installed Next documentation was consulted before implementation. Fourteen fictional properties and three fictional projects are defined in `lib/demo-data.ts`. There are no listing APIs, server database, authenticated account backend, SMS provider, video storage or messaging service. The existing phone sign-in is explicitly simulated.

The original dataset and existing browser storage keys are preserved. At this execution's first Git check, the working tree already included changes to layout, homepage, header/footer, listing card, package files, social components, local image assets and scripts, in addition to `.idea/` and `PremiumProperty.iml`. These pre-existing changes were preserved. Concurrent edits from another process were observed; additional styles were kept in `app/social-experience.css` instead of replacing that process's page stylesheet. IDE files remain outside the implementation scope.

## Research and application

- [NN/g: infinite scrolling](https://www.nngroup.com/articles/infinite-scrolling-tips/): the feed uses four-post pages with explicit navigation, rather than endlessly adding DOM nodes. URL pagination and normal browser history preserve orientation.
- [Pinterest: boards](https://help.pinterest.com/en/article/create-a-board): saving and organizing are separate actions. Premium Property supports private local collections without implying Pinterest branding or account synchronization.
- [Baymard: applied filter overview](https://baymard.com/research-articles/how-to-design-applied-filters): selected criteria remain visible as removable chips. Counts, sorting and URL criteria refer to actual inventory.
- [W3C: native modal dialogs](https://www.w3.org/WAI/WCAG22/Techniques/html/H102): image viewing, search and collection dialogs use `showModal()`, focus containment, Escape and focus restoration.
- [W3C: combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): the existing debounced Google/Photon location suggestions retain keyboard selection and active-option semantics.
- [web.dev: image loading](https://web.dev/learn/performance/lazy-load-images-and-iframe-elements): first-post media is eager; lower media is lazy and sized responsively. Space is reserved before image loading.

The social reference is a media-led feed with compact identity headers, direct actions, and collection-based discovery. No external platform branding, likes, comments, followers, ratings or popularity counts were copied or fabricated.

## Information architecture

Desktop: fixed top bar, left application navigation, centre property feed and an optional right rail of actual sample projects and locality shortcuts. Mobile: top search/create actions, full-width property posts and a five-item bottom bar with safe-area padding.

Main routes are Home, Explore, Reels, Saved, Messages and Profile. Post Property remains prominent. Reels and Messages explain unavailable infrastructure and direct visitors to supported galleries/contact methods. Existing buy/rent/category, project, guides/tools, legal and broker routes remain available.

## Components and persistence

- `SocialChrome` and `SocialShell`: navigation and content layout.
- `PropertyPost`, `PropertyTile`, `MediaGallery`, `Photo`: feed, visual grids, shared gallery and image failure recovery.
- `SocialProvider`: saves, collections, local notifications and collection dialogs, retaining the existing favorites event.
- `SocialExplore`: catalogue/project discovery and URL-backed criteria; pure filtering/sorting lives in `lib/social/search.ts`.
- `PropertyComposer`: six-step authoring, validation, media decoding, cover selection and recovery.
- Local storage retains text drafts, profile stub, saves, collections and activity. IndexedDB `premiumproperty-drafts`, version 1, store `media`, key `current`, retains draft photo blobs on this device.

Public profiles use the existing platform/operator identities. Per-listing owner or agent attribution is absent, so posts are identified as collection entries. Posting dates, genuine identity verification and amenities are not invented.
