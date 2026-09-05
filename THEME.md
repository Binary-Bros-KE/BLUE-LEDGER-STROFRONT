# Storefront themes

The storefront is one deployment for every tenant. **How a shop looks is a theme** —
WordPress-style: the SERVER `/shop` API is the stable data + action layer; a theme
decides the markup and style. Themes ship one at a time.

## Theme 1 — "Classic" (Trylist)

Built to `TRYLIST-BUILD-SPEC.md` + the reference screenshots. Currently the whole
app **is** this theme (`src/app/page.tsx` → `<ClassicStorefront>`). When theme 2
lands, the shared shell moves up and each theme becomes a module selected by
`web_stores.themeJson.theme`.

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
