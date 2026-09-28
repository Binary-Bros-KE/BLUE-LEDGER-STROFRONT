/** Where the Blue Ledger SERVER is reachable — the `/shop` API lives there. */
export const SHOP_API_URL = process.env.SHOP_API_URL ?? "http://localhost:4000";

/**
 * Shared secret sent as `X-Storefront-Key` on every /shop call (server-side only — never exposed to
 * the browser). Must equal SERVER's STOREFRONT_API_KEY. It exempts this deployment from the /shop
 * rate limit: every shopper's request reaches SERVER from here, so without it all shoppers of all
 * shops would share one per-IP bucket. Blank = no exemption (works, just limited).
 */
export const STOREFRONT_API_KEY = process.env.STOREFRONT_API_KEY?.trim() ?? "";

/**
 * When the store can't be loaded (no store at this domain, SERVER down, …) dev renders the Trylist
 * SAMPLE catalogue so the templates are always viewable. Production must NEVER do that — a real
 * shop's customers would see another business's fake products — so there it's an error page.
 * On in `next dev`; for `next start` testing set STOREFRONT_SAMPLE_PREVIEW=1.
 */
export const ALLOW_SAMPLE_PREVIEW =
  process.env.NODE_ENV !== "production" || process.env.STOREFRONT_SAMPLE_PREVIEW === "1";

/**
 * DEV / PREVIEW ONLY. When set, every `/shop` call is made as if the request had arrived at this
 * domain, regardless of the real `Host`. Point it at your dev tenant's `web_stores.customDomain`
 * (or `<subdomain>.localhost:3200`) so `localhost:3200` resolves to a real store. Blank in
 * production — the genuine incoming `Host` is used.
 */
export const DEV_STORE_DOMAIN = process.env.DEV_STORE_DOMAIN?.trim() ?? "";

/**
 * DEV / PREVIEW ONLY — force the look without touching the database:
 *   DEV_TEMPLATE=classic
 *   DEV_THEME_COLORS={"primary":"#d71920","secondary":"#1b1b1f","accent":"#ffb400"}
 * Applied on top of whatever the store (or the sample preview) resolves to. Blank in production.
 */
export const DEV_TEMPLATE = process.env.DEV_TEMPLATE?.trim() ?? "";
export const DEV_THEME_COLORS = process.env.DEV_THEME_COLORS?.trim() ?? "";
