/** Where the Blue Ledger SERVER is reachable — the `/shop` API lives there. */
export const SHOP_API_URL = process.env.SHOP_API_URL ?? "http://localhost:4000";

/**
 * DEV / PREVIEW ONLY. When set, every `/shop` call is made as if the request had arrived at this
 * domain, regardless of the real `Host`. Point it at your dev tenant's `web_stores.customDomain`
 * (or `<subdomain>.localhost:3200`) so `localhost:3200` resolves to a real store. Blank in
 * production — the genuine incoming `Host` is used.
 */
export const DEV_STORE_DOMAIN = process.env.DEV_STORE_DOMAIN?.trim() ?? "";
