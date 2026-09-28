import type { Metadata } from "next";
import { toThemeProduct } from "@/lib/adapter";
import { catalogParams, filterSample, listingHref, parseListingFilters, sampleRange } from "@/lib/listing-filters";
import { PRODUCTS as SAMPLE_PRODUCTS, type Product } from "@/lib/products";
import { getCatalog } from "@/lib/shop-api";
import { loadShell } from "@/lib/store";
import type { CatalogPage } from "@/lib/types";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

export const metadata: Metadata = { title: "All products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; sort?: string; min?: string; max?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page) || 1);
  const filters = parseListingFilters(sp);

  const { shell, preview } = await loadShell();
  const T = getTemplate(shell.templateId);

  let products: Product[] = [];
  let total = 0;
  let priceRange: CatalogPage["priceRange"] = null;

  if (preview) {
    const matched = q
      ? SAMPLE_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
      : SAMPLE_PRODUCTS;
    priceRange = sampleRange(matched);
    products = filterSample(matched, filters);
    total = products.length;
  } else {
    try {
      const catalog = await getCatalog({
        page,
        pageSize: PAGE_SIZE,
        ...(q ? { search: q } : {}),
        ...catalogParams(filters),
      });
      products = catalog.products.map(toThemeProduct);
      total = catalog.total;
      priceRange = catalog.priceRange ?? null;
    } catch {
      products = [];
      total = 0;
    }
  }

  const rawBase = q ? `/products?q=${encodeURIComponent(q)}` : "/products";

  return (
    <T.Chrome {...shell}>
      <T.Listing
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
        basePath={listingHref(rawBase, filters)}
        categories={shell.categories}
        heroImage={shell.theme.headerImageUrl}
        filters={filters}
        priceRange={priceRange}
      />
    </T.Chrome>
  );
}
