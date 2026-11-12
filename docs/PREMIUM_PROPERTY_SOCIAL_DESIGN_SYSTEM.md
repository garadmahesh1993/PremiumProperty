# Premium Property: social design system

The product is an application for visual property discovery. Photography occupies most of a property post; introductory copy is short and functional. There is no marketing hero before the feed.

## Foundations

| Token          | Purpose                                           |
| -------------- | ------------------------------------------------- |
| `--sp-ink`     | Navy headings, navigation and primary information |
| `--sp-teal`    | Interactive emerald accent and primary actions    |
| `--sp-gold`    | Restrained neighbourhood/photo accents            |
| `--sp-bg`      | Warm, pale application background                 |
| `--sp-surface` | White post and form surfaces                      |
| `--sp-muted`   | Supporting text with checked contrast             |
| `--sp-line`    | Quiet structural borders                          |

Current values: navy `#142b35`, emerald `#087769`, warm canvas `#f7f7f3`, secondary text `#596b71`, white `#ffffff`, border `#e2e7e6`, gold `#a08551`. Gold is a decorative accent, not essential small text. Light mode is implemented consistently; dark mode is deferred.

System sans-serif typography avoids font network requests. Page titles are approximately 26–38 px, post titles 16–18 px, prices 22–26 px and normal form controls 14–16 px. Supporting metadata is smaller and does not carry the primary property decision.

Cards use restrained 9–14 px rounding, clear borders and minimal shadows. Feed photos use a stable ratio; galleries open to a contained full-screen view. Property tiles provide a denser visual catalogue. Save/share/contact controls have separate targets and never depend on clicking an entire nested card.

## Navigation and interaction

- Desktop side navigation; compact mobile bottom navigation with safe-area insets.
- Persistent search and property creation access.
- Saved states use icon fill, text/state updates and toast feedback.
- Native dialogs handle focus and background interaction.
- Media supports previous/next, full-screen viewing, keyboard arrows and swipe.
- Reduced motion disables nonessential transitions. No autoplay media is introduced.
- Every new action navigates, changes local state, invokes a real contact destination, or explains unavailability.

Legacy secondary pages retain their behavior and receive compatible application navigation. Styles are scoped with `sp-` names and live in the social CSS files; the original global stylesheet remains available to the retained workspace and secondary routes.
