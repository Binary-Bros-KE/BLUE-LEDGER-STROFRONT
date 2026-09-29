import { headers } from "next/headers";
import type { StorePayload } from "./types";

/**
 * The origin this shop should be KNOWN by — used for canonical URLs, Open Graph URLs, the sitemap and
 * robots.txt. A shop with a verified custom domain is also reachable on its `<sub>.shops…` preview
 * address; pointing every canonical at the custom domain stops search engines treating the two as
 * duplicate sites. Without one, it's the host the request actually came in on.
 */
export async function siteOrigin(store?: StorePayload | null): Promise<string> {
  if (store?.customDomain && store.domainStatus === "LIVE") return `https://${store.customDomain}`;
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3200").split(",")[0].trim();
  const proto = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  return `${proto}://${host}`;
}
