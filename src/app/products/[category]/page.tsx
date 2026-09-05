import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreChrome } from "@/components/StoreChrome";
import { ProductsListing } from "@/components/pages/ProductsListing";
import { toThemeProduct } from "@/lib/adapter";
import { CATEGORIES as SAMPLE_CATEGORIES, PRODUCTS as SAMPLE_PRODUCTS, type Product } from "@/lib/products";
import { getCatalog, getCategories } from "@/lib/shop-api";
import { slugify } from "@/lib/slug";
import { loadShell } from "@/lib/store";

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
  searchParams: Promise<{ page?: string }>;
}) {
  const { category: slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { shell, preview } = await loadShell();

  // Preview mode: match against the sample categories, filter the sample products by name.
  if (preview) {
    const match = SAMPLE_CATEGORIES.find((c) => slugify(c.name) === slug);
    if (!match) notFound();
    const filtered = SAMPLE_PRODUCTS.filter((p) => slugify(p.category.split(" · ")[0]) === slug);
    const products = filtered.length ? filtered : SAMPLE_PRODUCTS;
    return (
      <StoreChrome {...shell}>
        <ProductsListing
          heading={match.name}
          trail={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: match.name }]}
          products={products}
          total={products.length}
          page={1}
          totalPages={1}
          basePath={`/products/${slug}`}
          categories={shell.categories}
          activeCategorySlug={slug}
        />
      </StoreChrome>
    );
  }

  const category = shell.categories.find((c) => slugify(c.name) === slug);
  if (!category) notFound();

  let products: Product[] = [];
  let total = 0;
  try {
    const catalog = await getCatalog({ categoryId: category.id, page, pageSize: PAGE_SIZE });
    products = catalog.products.map(toThemeProduct);
    total = catalog.total;
  } catch {
    products = [];
    total = 0;
  }

  return (
    <StoreChrome {...shell}>
      <ProductsListing
        heading={category.name}
        trail={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: category.name }]}
        products={products}
        total={total}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePath={`/products/${slug}`}
        categories={shell.categories}
        activeCategorySlug={slug}
      />
    </StoreChrome>
  );
}
