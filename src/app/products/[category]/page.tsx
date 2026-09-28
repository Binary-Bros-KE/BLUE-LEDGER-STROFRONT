import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toThemeProduct } from "@/lib/adapter";
import { catalogParams, filterSample, listingHref, parseListingFilters, sampleRange } from "@/lib/listing-filters";
import { CATEGORIES as SAMPLE_CATEGORIES, PRODUCTS as SAMPLE_PRODUCTS, type Product } from "@/lib/products";
import { getCatalog, getCategories } from "@/lib/shop-api";
import { slugify } from "@/lib/slug";
import { loadShell } from "@/lib/store";
import type { CatalogPage } from "@/lib/types";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  try {
    const match = (await getCategories()).find((c) => slugify(c.name) === category);
    return { title: match ? match.name : "Category" };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; sort?: string; min?: string; max?: string }>;
}) {
  const { category: slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const filters = parseListingFilters(sp);
  const rawBase = `/products/${slug}`;

  const { shell, preview } = await loadShell();
  const T = getTemplate(shell.templateId);

  // Preview mode: match against the sample categories, filter the sample products by name.
  if (preview) {
    const match = SAMPLE_CATEGORIES.find((c) => slugify(c.name) === slug);
    if (!match) notFound();
    const inCat = SAMPLE_PRODUCTS.filter((p) => slugify(p.category.split(" · ")[0]) === slug);
    const base = inCat.length ? inCat : SAMPLE_PRODUCTS;
    const products = filterSample(base, filters);
    return (
      <T.Chrome {...shell}>
        <T.Listing
          heading={match.name}
          trail={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: match.name }]}
          products={products}
          total={products.length}
          page={1}
          totalPages={1}
          basePath={listingHref(rawBase, filters)}
          categories={shell.categories}
          activeCategorySlug={slug}
          heroImage={shell.theme.categoryImages[match.id] || shell.theme.headerImageUrl}
          filters={filters}
          priceRange={sampleRange(base)}
        />
      </T.Chrome>
    );
  }

  const category = shell.categories.find((c) => slugify(c.name) === slug);
  if (!category) notFound();

  let products: Product[] = [];
  let total = 0;
  let priceRange: CatalogPage["priceRange"] = null;
  try {
    const catalog = await getCatalog({ categoryId: category.id, page, pageSize: PAGE_SIZE, ...catalogParams(filters) });
    products = catalog.products.map(toThemeProduct);
    total = catalog.total;
    priceRange = catalog.priceRange ?? null;
  } catch {
    products = [];
    total = 0;
  }

  return (
    <T.Chrome {...shell}>
      <T.Listing
        heading={category.name}
        trail={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: category.name }]}
        products={products}
        total={total}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePath={listingHref(rawBase, filters)}
        categories={shell.categories}
        activeCategorySlug={slug}
        heroImage={shell.theme.categoryImages[category.id] || shell.theme.headerImageUrl}
        filters={filters}
        priceRange={priceRange}
      />
    </T.Chrome>
  );
}
