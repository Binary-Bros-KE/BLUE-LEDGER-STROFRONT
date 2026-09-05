import type { Metadata } from "next";
import { StoreChrome } from "@/components/StoreChrome";
import { HomeSections } from "@/components/home/HomeSections";
import { toThemeProduct } from "@/lib/adapter";
import { PRODUCTS as SAMPLE_PRODUCTS } from "@/lib/products";
import { getCatalog, getStore } from "@/lib/shop-api";
import { loadShell } from "@/lib/store";

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
  const { shell, preview } = await loadShell();

  let products = SAMPLE_PRODUCTS;
  if (!preview) {
    try {
      const catalog = await getCatalog({ pageSize: 24 });
      products = catalog.products.map(toThemeProduct);
    } catch {
      products = [];
    }
  }

  return (
    <StoreChrome {...shell}>
      <HomeSections products={products} categories={shell.categories} />
    </StoreChrome>
  );
}
