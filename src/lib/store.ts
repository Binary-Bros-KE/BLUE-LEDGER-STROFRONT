import type { StoreShell } from "@/components/StoreChrome";
import { toThemeCategory } from "./adapter";
import { CATEGORIES as SAMPLE_CATEGORIES, PRODUCTS as SAMPLE_PRODUCTS } from "./products";
import { getCategories, getStore, ShopApiError } from "./shop-api";

/**
 * Resolves the header/footer/chrome data for the current request's tenant. On failure (no live
 * store at this host — e.g. localhost without DEV_STORE_DOMAIN, or SERVER down) it returns the
 * Trylist sample so the theme is always viewable. Every page calls this, then fetches its own
 * catalogue / product on top.
 */
export async function loadShell(): Promise<{ shell: StoreShell; preview: boolean }> {
  try {
    const [store, categories] = await Promise.all([getStore(), getCategories()]);
    return {
      shell: {
        storeName: store.name,
        currency: store.currency,
        address: store.contact.address,
        phone: store.contact.phone,
        categories: categories.map(toThemeCategory),
      },
      preview: false,
    };
  } catch (err) {
    const status = err instanceof ShopApiError ? err.status : "no response";
    console.warn(`[storefront] /shop shell unavailable (${status}) — sample data`);
    return {
      shell: {
        storeName: "TRYLIST",
        currency: "KSH",
        categories: SAMPLE_CATEGORIES,
        preview: true,
        seedLines: SAMPLE_PRODUCTS.slice(0, 3).map((p, i) => ({
          id: p.id,
          name: p.name.split(" — ")[0],
          unitPriceCents: p.priceCents,
          qty: i === 1 ? 2 : 1,
        })),
      },
      preview: true,
    };
  }
}
