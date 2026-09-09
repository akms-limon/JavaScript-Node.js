# Eagle Creek Golf Club — Stay & Play Landing Page

A pixel-fidelity recreation of a "Stay & Play" golf course landing page, built with **raw HTML5 and CSS3 only** (no frameworks).

## 🔗 Live Links
- **Live Preview:** *[Live Link](https://akms-limon.github.io/HTML-CSS/)*
- **Repository:** *[GitHub repo link](https://github.com/akms-limon/HTML-CSS)*

## 📁 Project Structure
```
├── index.html   # Semantic HTML markup
├── styles.css   # Tokens, layout, components, responsive rules
├── icons/       # UI icons
├── images/      # Gallery & property photos
└── README.md
```

## 🧱 Structure & Approach

- **Semantic HTML5**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` used per meaning, not generic `<div>`s. Each content block is its own `<section>`, repeating cards as `<article>`.
- **Layout**: `main-grid` (CSS Grid) with scrollable content on the left and a **sticky booking `<aside>`** on the right (desktop only). Flexbox/Grid only — no floats.
- **Design tokens**: colors, spacing scale, radius, shadows, and fonts defined once in `:root`.
- **CSS order**: tokens → reset → layout primitives → components (in page order) → responsive breakpoints at the bottom.
- **Naming**: BEM-inspired (e.g. `.property-card__photo`). No ID selectors, no `!important`.
- **Icons**: Lucide (CDN) for UI icons; static images for decorative stat/course icons.

## 📱 Breakpoints Used

| Breakpoint | Range | Behavior |
|---|---|---|
| **Desktop** | 1280px+ | Two-column layout, sticky aside, 3-col grids, full nav. |
| **Small Desktop** | 1024–1279px | Same structure, tighter spacing, 2-col golf-highlights. |
| **Tablet** | 768–1279px | Hamburger nav, single-column grid, aside hidden (inline summary card instead), map moves above list. |
| **Mobile** | ≤767px | Fully stacked, single hero image + dots, only first card shown per list, compact footer (2 columns). |

`min-width: 0` on flex/grid children and `max-width: 100%` on images prevent horizontal scroll at all sizes.

## ♿ Accessibility

- Single `<h1>`, logical `h2`→`h4` hierarchy.
- Descriptive `alt` text on meaningful images; `aria-hidden` on decorative ones.
- `aria-current="page"` on active breadcrumb/pagination items.
- `:focus-visible` states kept on interactive elements.
- Map uses `role="img"` + `aria-label`; form fields use proper `<label for>`.

## ⚠️ Assumptions & Limitations

- Markup/styling only — buttons aren't wired to JS (HTML/CSS-only scope).
- Prices, review counts, and some review text are placeholders from the design brief.
- Fonts/icons load from CDNs; needs internet for exact rendering.
- Map is a live Google Maps iframe, so its look depends on Google's rendering.
- Uses modern CSS (Grid, `clamp()`, container queries, `aspect-ratio`) — no legacy browser (IE) support.

## ✅ Run Locally

1. Clone the repo.
2. Open `index.html` in a browser, or serve via `npx serve` / Live Server (recommended for the map & fonts).
3. Test at 375px / 768px / 1024px+ using dev tools.
