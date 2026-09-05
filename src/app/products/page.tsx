import type { Metadata } from "next";
import { StoreChrome } from "@/components/StoreChrome";
import { ProductsListing } from "@/components/pages/ProductsListing";
import { toThemeProduct } from "@/lib/adapter";
import { PRODUCTS as SAMPLE_PRODUCTS, type Product } from "@/lib/products";
import { getCatalog } from "@/lib/shop-api";
import { loadShell } from "@/lib/store";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

export const metadata: Metadata = { title: "All products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q: qParam } = await searchParams;
  const q = (qParam ?? "").trim();
  const page = Math.max(1, Number(pageParam) || 1);

  const { shell, preview } = await loadShell();

  let products: Product[] = [];
  let total = 0;

  if (preview) {
    products = q
      ? SAMPLE_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
      : SAMPLE_PRODUCTS;
    total = products.length;
  } else {
    try {
      const catalog = await getCatalog({ page, pageSize: PAGE_SIZE, ...(q ? { search: q } : {}) });
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
        heading={q ? `Results for “${q}”` : "All products"}
        trail={
          q
            ? [{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Search" }]
            : [{ label: "Home", href: "/" }, { label: "Products" }]
        }
        products={products}
        total={total}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePath={q ? `/products?q=${encodeURIComponent(q)}` : "/products"}
        categories={shell.categories}
      />
    </StoreChrome>
  );
}
