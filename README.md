# Blue Ledger Storefront (`NEXT/storefront`)

The multi-tenant e-commerce storefront for Blue Ledger POS clients. One Next.js
deployment serves every client's shop; the tenant is resolved per request from
the domain. Full design: [`../../ECOMMERCE-ARCHITECTURE.md`](../../ECOMMERCE-ARCHITECTURE.md).

## Status — P0 scaffold

| Part | State |
|---|---|
| `src/lib/env.ts`, `shop-api.ts`, `types.ts` | real — typed client for the SERVER `/shop` API, tenant resolved from `Host` |
| SERVER `/shop/store`, `/shop/catalog`, `/shop/product/:id` | real (read-only catalog) |
| `src/app/page.tsx` | **throwaway diagnostic** — prints whatever `/shop` returns so you can confirm the pipeline works |
| Real storefront UI | **not started** — waiting on the client's design |

## Run it

```bash
npm install
cp .env.example .env.local     # then edit
npm run dev                    # http://localhost:3200
```

`.env.local`:

- `SHOP_API_URL` — where the Blue Ledger SERVER is (`http://localhost:4000` in dev).
- `DEV_STORE_DOMAIN` — dev only. `localhost:3200` matches no real store, so set
  this to your dev tenant's `web_stores.customDomain` (or
  `<subdomain>.localhost:3200`) and every request resolves to that store.

## How tenant resolution works

1. A request hits this app at `acmehardware.co.ke` (or the preview
   `acme.<STOREFRONT_BASE_DOMAIN>`).
2. `src/lib/shop-api.ts` reads the incoming `Host` and sends it to the SERVER as
   the `X-Shop-Domain` header on every `/shop/*` call.
3. SERVER `middleware/shop-tenant.ts#resolveLiveStore` matches that against
   `web_stores.customDomain` / `.subdomain`, checks the plan has
   `featureEcommerce` and the license is usable, and scopes all data reads to
   that tenant via RLS.

Nothing tenant-specific is ever configured or deployed in this repo.
