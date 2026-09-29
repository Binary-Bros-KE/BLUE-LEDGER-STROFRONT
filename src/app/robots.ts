import type { MetadataRoute } from "next";
import { getStore } from "@/lib/shop-api";
import { siteOrigin } from "@/lib/site-url";

// Per shop (one deployment serves every tenant) — never cached across hosts.
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const store = await getStore().catch(() => null);
  if (!store) {
    // No live shop at this address — nothing to index.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  const origin = await siteOrigin(store);
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/checkout", "/api/"] },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
