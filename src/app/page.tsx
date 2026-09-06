import type { Metadata } from "next";
import { StoreChrome } from "@/components/StoreChrome";
import { HomeSections, type HomeProductSection } from "@/components/home/HomeSections";
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
  let sections: HomeProductSection[] = [];

  if (!preview) {
    const wanted = shell.theme.productSections;
    const catName = (id: string) => shell.categories.find((c) => c.id === id)?.name ?? null;

    const [catalog, ...sectionResults] = await Promise.all([
      // Only need the default grid when no curated sections are configured.
      wanted.length > 0
        ? Promise.resolve({ products: [] as never[] })
        : getCatalog({ pageSize: 24 }).catch(() => ({ products: [] as never[] })),
      ...wanted.map((s) =>
        getCatalog({ categoryId: s.categoryId, pageSize: 8 })
          .then((page) => ({ s, items: page.products.map(toThemeProduct) }))
          .catch(() => ({ s, items: [] as ReturnType<typeof toThemeProduct>[] })),
      ),
    ]);

    products = catalog.products.map(toThemeProduct);
    sections = sectionResults.flatMap(({ s, items }) => {
      const name = catName(s.categoryId);
      if (!name || items.length === 0) return [];
      return [{ title: s.title, categoryName: name, ctaLabel: s.ctaLabel, products: items }];
    });
  } else {
    // Preview: fake a couple of curated rows from the sample data so the layout is visible.
    const byCat = new Map<string, typeof SAMPLE_PRODUCTS>();
    for (const p of SAMPLE_PRODUCTS) {
      const key = p.category.split(" · ")[0];
      byCat.set(key, [...(byCat.get(key) ?? []), p]);
    }
    sections = [...byCat.entries()].slice(0, 2).map(([name, items]) => ({
      title: name,
      categoryName: name,
      products: items,
    }));
  }

  return (
    <StoreChrome {...shell}>
      <HomeSections
        products={products}
        categories={shell.categories}
        theme={shell.theme}
        sections={sections}
      />
    </StoreChrome>
  );
}
