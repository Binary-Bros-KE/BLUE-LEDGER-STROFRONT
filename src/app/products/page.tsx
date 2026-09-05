import type { Metadata } from "next";
import { StoreChrome } from "@/components/StoreChrome";
import { ProductsListing } from "@/components/pages/ProductsListing";
import { toThemeProduct } from "@/lib/adapter";
import { PRODUCTS as SAMPLE_PRODUCTS } from "@/lib/products";
import { getCatalog } from "@/lib/shop-api";
import { loadShell } from "@/lib/store";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

export const metadata: Metadata = { title: "All products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { shell, preview } = await loadShell();

  let products = SAMPLE_PRODUCTS;
  let total = SAMPLE_PRODUCTS.length;
  if (!preview) {
    try {
      const catalog = await getCatalog({ page, pageSize: PAGE_SIZE });
      products = catalog.products.map(toThemeProduct);
      total = catalog.total;
    } catch {
      products = [];
      total = 0;
    }
  }

  return (
    <StoreChrome {...shell}>
      <ProductsListing
        heading="All products"
        trail={[{ label: "Home", href: "/" }, { label: "Products" }]}
        products={products}
        total={total}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePath="/products"
        categories={shell.categories}
      />
    </StoreChrome>
  );
}
