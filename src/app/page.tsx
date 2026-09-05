import type { Metadata } from "next";
import { ClassicStorefront } from "@/components/ClassicStorefront";
import { toThemeCategory, toThemeProduct } from "@/lib/adapter";
import { CATEGORIES as SAMPLE_CATEGORIES, PRODUCTS as SAMPLE_PRODUCTS } from "@/lib/products";
import { getCatalog, getCategories, getStore, ShopApiError } from "@/lib/shop-api";

// Tenant-specific, resolved from the request domain — never statically prerendered.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const store = await getStore();
    return { title: store.name, description: `Shop online at ${store.name}.` };
  } catch {
    return { title: "TRYLIST" };
  }
}

export default async function Page() {
  try {
    const [store, catalog, categories] = await Promise.all([
      getStore(),
      getCatalog({ pageSize: 24 }),
      getCategories(),
    ]);

    return (
      <ClassicStorefront
        storeName={store.name}
        currency={store.currency}
        address={store.contact.address}
        phone={store.contact.phone}
        products={catalog.products.map(toThemeProduct)}
        categories={categories.map(toThemeCategory)}
      />
    );
  } catch (err) {
    // No live store at this host (the default at localhost:3200 without DEV_STORE_DOMAIN set), or
    // SERVER is unreachable → render the Trylist sample so the theme is always viewable.
    const status = err instanceof ShopApiError ? err.status : "no response";
    console.warn(`[storefront] /shop unavailable (${status}) — rendering sample data`);

    return (
      <ClassicStorefront
        storeName="TRYLIST"
        currency="KSH"
        products={SAMPLE_PRODUCTS}
        categories={SAMPLE_CATEGORIES}
        preview
      />
    );
  }
}
