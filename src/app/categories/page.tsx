import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { toThemeProduct } from "@/lib/adapter";
import { PRODUCTS as SAMPLE_PRODUCTS, type Product } from "@/lib/products";
import { getCatalog, getStore } from "@/lib/shop-api";
import { pageOpenGraph } from "@/lib/seo";
import { loadShell } from "@/lib/store";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

/** products shown per category row — divides into the 2 / 3 / 6-column grid evenly */
const ROW_SIZE = 6;
/** categories that get a product row (every category still gets a tile) */
const MAX_ROWS = 12;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const store = await getStore();
    const description = `Browse every category at ${store.name} — find what you need and order online.`;
    return {
      title: "All categories",
      description,
      alternates: { canonical: "/categories" },
      openGraph: pageOpenGraph(store, { url: "/categories", title: "All categories", description }),
    };
  } catch {
    return { title: "All categories" };
  }
}

/** Category landing page: a tile per category, then a short "popular in" row for each. Templates
 * without their own Categories page keep the old behaviour (all products). */
export default async function CategoriesPage() {
  const { shell, preview } = await loadShell();
  const T = getTemplate(shell.templateId);
  if (!T.Categories) redirect("/products");

  // Biggest categories first — that's what a shopper scanning the page expects to see first.
  const categories = [...shell.categories].filter((c) => preview || c.count > 0).sort((a, b) => b.count - a.count);

  const rows = await Promise.all(
    categories.slice(0, MAX_ROWS).map(async (category) => {
      let products: Product[] = [];
      if (preview) {
        products = SAMPLE_PRODUCTS.filter((p) => p.category.split(" · ")[0] === category.name).slice(0, ROW_SIZE);
      } else {
        products = await getCatalog({ categoryId: category.id, pageSize: ROW_SIZE })
          .then((page) => page.products.map(toThemeProduct))
          .catch(() => []);
      }
      return { category, products };
    }),
  );

  return (
    <T.Chrome {...shell}>
      <T.Categories
        categories={categories}
        categoryImages={shell.theme.categoryImages}
        rows={rows.filter((r) => r.products.length > 0)}
        heroImage={shell.theme.headerImageUrl}
        storeName={shell.storeName}
      />
    </T.Chrome>
  );
}
