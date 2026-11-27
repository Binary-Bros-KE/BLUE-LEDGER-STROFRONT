import type { MetadataRoute } from "next";
import { getCatalog, getCategories, getStore } from "@/lib/shop-api";
import { siteOrigin } from "@/lib/site-url";
import { slugify } from "@/lib/slug";
import { isProductMerchantReady, realImageUrls } from "@/lib/merchant-ready";
import { productPath } from "@/lib/product-url";

// Per shop (one deployment serves every tenant) — never cached across hosts.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 60; // SERVER /shop/catalog's max
const MAX_PRODUCTS = 5000; // well past any real catalogue; keeps one sitemap file bounded

/** Home, all-products, every category and every merchant-ready product of THIS shop (lib/merchant-ready.ts —
 * a product joins automatically once it has a photo, a price and a description). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const store = await getStore().catch(() => null);
  if (!store) return [];
  const origin = await siteOrigin(store);

  const entries: MetadataRoute.Sitemap = [
    { url: `${origin}/`, changeFrequency: "daily", priority: 1 },
    { url: `${origin}/products`, changeFrequency: "daily", priority: 0.8 },
    { url: `${origin}/categories`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const categories = await getCategories().catch(() => []);
  for (const c of categories) {
    if (c.count > 0) entries.push({ url: `${origin}/products/${slugify(c.name)}`, changeFrequency: "daily", priority: 0.7 });
  }

  for (let page = 1; (page - 1) * PAGE_SIZE < MAX_PRODUCTS; page++) {
    const batch = await getCatalog({ page, pageSize: PAGE_SIZE }).catch(() => null);
    if (!batch || batch.products.length === 0) break;
    for (const p of batch.products) {
      if (!isProductMerchantReady(p)) continue;
      entries.push({
        url: origin + productPath(p),
        ...(p.updatedAt ? { lastModified: p.updatedAt } : {}),
        changeFrequency: "weekly",
        priority: 0.6,
        images: realImageUrls(p).slice(0, 1),
      });
    }
    if (page * PAGE_SIZE >= batch.total) break;
  }

  return entries;
}
