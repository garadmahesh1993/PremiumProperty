# Premium Property: social design system

The product is an application for visual property discovery. Photography occupies most of a property post; introductory copy is short and functional. There is no marketing hero before the feed.

## Foundations

| Token          | Purpose                                           |
| -------------- | ------------------------------------------------- |
| `--pp-navy`    | Navy headings, branding and primary information   |
| `--pp-blue`    | Blue navigation, links and secondary actions       |
| `--pp-orange`  | Orange primary actions, selected accents and saves |
| `--pp-orange-bright` | Decorative icon accents on navy surfaces      |
| `--sp-bg`      | Warm, pale application background                 |
| `--sp-surface` | White post and form surfaces                      |
| `--sp-muted`   | Supporting text with checked contrast             |
| `--sp-line`    | Quiet structural borders                          |

Current orange-and-blue theme: navy `#142b49`, blue `#244d7c`, rich orange `#b84b20`, decorative orange `#e8894c`, warm canvas `#f8f7f4`, secondary text `#58677a`, white `#ffffff`, border `#dfe5ed`. Primary orange buttons with white text have approximately 5.17:1 contrast. The brighter orange is reserved for decoration on dark surfaces. Light mode is implemented consistently; dark mode is deferred.

`app/premium-theme.css` supplies semantic palette tokens and the shared branded states. Existing `--sp-teal`/`--teal` names remain as compatibility aliases to blue, while `--sp-accent` points to orange. Older green surface and text literals have been recolored across retained pages as well as the feed. Orange marks primary calls to action and active feed accents; blue anchors navigation, property information and the brand. The favicon uses the same navy/orange identity.

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
