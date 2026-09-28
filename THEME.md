# Storefront templates

The storefront is one deployment for every tenant. **How a shop looks is a template** —
WordPress-style: the SERVER `/shop` API is the stable data + action layer; a template
decides the markup and style. Templates ship one at a time.

## Who controls what

| Layer | Stored in | Edited by |
|---|---|---|
| **Template** (which design) | `web_stores.templateId` | Blue Ledger admin — dashboard → tenant → Online Store → *Change look* |
| **Brand colours** (3 picks) | `web_stores.themeColorsJson` | Blue Ledger admin — same modal |
| **Content** (logo, hero copy/images, contact, story rows…) | `web_stores.themeJson` | Shop owner — POS "Online Store" tab |

The POS endpoints (`/shop-admin/*`) cannot write `templateId` / `themeColorsJson`; only the
SUPER_ADMIN `PATCH /tenants/:id/shop` can.

## The standard colour system (every template)

An admin picks at most three colours; everything else is derived by `src/lib/palette.ts`:

- **primary** — the action colour: buttons, links, prices, highlights
- **secondary** — the *dark* structural colour: header/footer/hero bands, heading + body ink.
  Always forced to ≥ 10:1 against white, so light text on it and it as text both stay readable.
- **accent** — the pop colour: badges, stars, countdowns, CTA shadows, hover states

Derived tokens (hover, soft tint, readable-on-white "ink", text-on-colour) are CSS custom
properties `--brand-*`, put inline on `<html>` by `app/layout.tsx`. Neutrals and status colours
(`--ui-*`: page, surface, ink, line, success, danger…) belong to the template, not the admin.

**Rule for template code:** colour only through the Tailwind names in `globals.css`'s
`@theme inline` block — `bg-primary`, `text-on-primary`, `bg-secondary`, `text-on-secondary-body`,
`bg-accent`, `text-accent-ink`, `bg-surface`, `text-ink-muted`, `border-line`, `text-success`…
Never a raw hex, never `text-white` on a brand colour (use `text-on-primary` etc.) — otherwise the
template stops being re-colourable. Classic's legacy names (`navy`, `blue`, `amber`…) are aliases
kept for its old components only.

## Adding a template (checklist)

1. `src/templates/<id>/` — components implementing the `StorefrontTemplate` contract in
   `src/templates/types.ts` (Chrome, Home, Listing, ProductDetail, Checkout, NotFound). Routes stay
   untouched; they already fetch data and hand it over.
2. Its neutrals under `[data-template="<id>"] { --ui-page: …; }` and any base laws scoped the same
   way in `globals.css` (never unscoped — Classic's zero-radius law is scoped for this reason).
3. Fonts: its own `fonts.ts` with `next/font`; set `preload: false` so other templates' shops
   don't preload them. Expose them via `htmlClassName`.
4. Register it in `src/templates/registry.ts` (`pinnedColors: false`).
5. Deploy the storefront, **then** allow the id in SERVER `src/lib/storefront-templates.ts` and add
   it to NEXT/admin `src/lib/storefront-templates.ts` (name, description, defaults, role help).

## Dev overrides

`DEV_TEMPLATE=classic` and `DEV_THEME_COLORS={"primary":"#d71920","secondary":"#1b1b1f","accent":"#ffb400"}`
force the look without touching the DB (see `src/lib/env.ts`). Blank in production.

## Template 1 — "Classic" (Trylist)

Built to `TRYLIST-BUILD-SPEC.md` + the reference screenshots. Its components live in
`src/components/**` (they predate the template system) and are bound into the contract by
`src/templates/classic/index.ts`. It is the default/fallback template and `pinnedColors: true`:
its exact spec palette is the `:root` default in `globals.css`, so an un-recoloured store is
pixel-identical to before templates existed.

### Where things are

| Path | What |
|---|---|
| `src/app/globals.css` | Tailwind v4 `@theme` — all spec §1 colours, §2 fonts, §5 breakpoints, the zero-radius law, and the signature utilities (`.bg-grid`, `.ph-light/.ph-dark`, `.blk/.blk-sm`, drawer keyframes) |
| `src/app/layout.tsx` | `next/font/google` — Archivo + JetBrains Mono (spec §2) |
| `src/lib/products.ts` | mock data (spec §7) — 8 products, 5 categories, 3 cart lines, copy verbatim from the reference |
| `src/lib/money.ts` | `ksh()` — `KSH 78,900` formatting (spec §7) |
| `src/components/shared/` | `Container`, `Placeholder` (hatch block), `SectionHead`, `icons.tsx` |
| `src/components/layout/` | `TopBar` `Header` `Logo` `CategoryRibbon` `Footer` `MobileTabBar` `MobileMenu` |
| `src/components/home/` | `Hero` `DealTile` `TradeTile` `TrustBar` `CategoryGrid` `ProductGrid` `PromoTile` `Features` `Newsletter` |
| `src/components/product/` | `ProductCard` `Badge` `FavouriteButton` `StockLine` `Rating` `PriceRow` |
| `src/components/cart/` | `CartDrawer` `CartLineItem` `QtyStepper` `CartSummary` `FreeShipProgress` |
| `src/components/ClassicStorefront.tsx` | `"use client"` shell — owns cart-drawer / mobile-menu / favourites / cart-qty state (spec §0/§6) |

### Deliberate deviations from the spec

1. **Icons are inlined** (`src/components/shared/icons.tsx`), not `react-icons`.
   Feather / `react-icons/fi` / lucide share the same 24×24 stroke-2 geometry, so
   they render identically. Reason: `npm install` is unreliable on the build
   machine. The component names mirror `react-icons/fi` — swapping back is a
   one-line-per-icon import change.
2. **Tailwind config is CSS-first** (`@theme` in `globals.css`), not
   `tailwind.config.ts` — this project is Tailwind v4. Same tokens. The zero-radius
   law is enforced twice: every `--radius-*` token is `0px` **and**
   `*{border-radius:0 !important}` in `@layer base` (kills `rounded-full` too).
3. **Cart total in the header/drawer is derived from live cart state** (a
   consistent `KSH 120,100`), not the reference's standalone `KSH 138,400` header
   figure — the two reference screenshots disagree; internal consistency wins.
4. **`MobileMenu`** is added (not in the spec §4 inventory) so the Header's menu
   button has a target — spec §6 does call for a "mobile menu".
5. **Mobile product grid** shows the first 4 cards + a `SEE ALL →` link (matches
   reference #4); the promo tile, load-more button and filter chips are desktop-only.
6. **Features tiles** use the shorter mobile headings from reference #4 below `md`.
7. Files sit under `src/` (project convention); otherwise the structure matches
   spec §7.

### Wiring to real data — DONE (with mock-fill)

`src/app/page.tsx` is a server component. It calls `getStore()` + `getCatalog()` +
`getCategories()` (SERVER `/shop`, tenant resolved from the request `Host`), maps
the rows through `src/lib/adapter.ts`, and passes real props into
`<ClassicStorefront>`. Nothing in the component tree fetches.

**Real, from the API:** store name, currency, contact address/phone, product name,
price, category name, stock state, product images (once P3 uploads land).

**Kept as MOCK (not dropped — so we don't forget to build them):**

| Field | Where | TODO |
|---|---|---|
| star rating + review count | `products.ts` `mockRating()` / `mockReviews()` — deterministic per id | build a reviews feature, or a ratings column |
| `-22%` / `NEW` / `BUNDLE` badges | `adapter.ts` leaves `badge` undefined for real products | add product flags to the model |
| strike-through compare price | `adapter.ts` leaves `compareCents` undefined | add `Product.compareAtPriceCents` |

Every one is marked `TODO(...)` in `adapter.ts` / `products.ts`.

**Fallback:** if no live store resolves (e.g. `localhost:3200` with no
`DEV_STORE_DOMAIN`, or SERVER down), the page renders the Trylist **sample set**
with a `Preview · sample data` banner, so the theme is always viewable.

**Still to do:** cart is in-memory only — move to `localStorage`, then wire
"Checkout" to the P1 `online_orders` flow. Category-grid `inverted` tile is
hard-coded to index 2. Hero / TrustBar / Features / TopBar / Newsletter copy is
still the Classic-theme default (not yet driven by `web_stores.themeJson`).

### Point it at a real store (dev)

1. `cd SERVER && npm run dev` (needs the `20260906000000_ecommerce_p0` migration applied)
2. Provision a `web_stores` row for a tenant, set its plan `featureEcommerce = true`,
   `status = 'LIVE'`, `fulfilmentLocationId` = a real location, and publish a few
   products (`Product.publishedOnline = true`).
3. `cd NEXT/storefront`, set `DEV_STORE_DOMAIN` in `.env.local` to that store's
   `customDomain` (or `<subdomain>.localhost:3200`), `npm run dev`.

### Run

```bash
npm install
npm run dev   # http://localhost:3200
```

## Template 2 — "Adia" (ADIA Home Appliances)

`src/templates/adia/` — rounded retail look: light-grey page, white cards, Poppins headings + Inter
body, primary-gradient hero with an "UP TO x% OFF" roundel, trust bar, category row, Hot Deals
banner with a live end-of-week countdown, product rows, promo cards (story rows) and a Top Brands
strip. Uses only standard tokens, so it re-colours cleanly (e.g. red for ADIA, blue for another shop).

Content it reads (all POS-edited, shared with Classic): `brand`, `topBar.announcement` (strip shown
only when set), `hero.*`, `dealTile` (hero roundel + Hot Deals banner: first title line = heading,
further lines = subtitle), `categoryImages`, `productSections`, `story`, `contact`, plus the new
optional `brands` list (`{ name, logoUrl?, href? }[]`, POS editor pending).

Status: complete — every page is Adia-designed (chrome, home, listing, product detail, checkout, 404,
soft contact pop-up). The category bar shows only links that fit whole; the rest are in All Categories.

## Orders (every template)

Checkout places a REAL order: the browser posts to the same-origin `/api/orders` relay, which calls
SERVER `POST /shop/orders` with the storefront key + the shopper's IP (Netlify's
`x-nf-client-connection-ip`) for per-shopper spam limiting. SERVER re-prices everything; the order
lands in the shop's POS "Online Orders" inbox. Payment is pay-on-delivery for now. Shared logic:
`lib/use-place-order.ts` (templates only draw the form).

Listing filters (any template can use them): `?sort=featured|price-asc|price-desc|newest&min=&max=`
(whole currency units) — parsed/built only via `src/lib/listing-filters.ts`; SERVER `/shop/catalog`
sorts/filters by the shopper price and returns `priceRange` (bounds before the price filter) for
sliders. No brand filter: products have no brand field yet.
