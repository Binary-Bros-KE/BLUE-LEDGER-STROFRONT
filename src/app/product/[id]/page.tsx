import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreChrome } from "@/components/StoreChrome";
import { ProductDetail } from "@/components/pages/ProductDetail";
import { toThemeProduct } from "@/lib/adapter";
import { PRODUCTS as SAMPLE_PRODUCTS, type Product } from "@/lib/products";
import { getCatalog, getProduct, ShopApiError } from "@/lib/shop-api";
import { loadShell } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const p = await getProduct(id);
    return { title: p.name, description: p.description ?? `Buy ${p.name} online.` };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { shell, preview } = await loadShell();

  if (preview) {
    const sample = SAMPLE_PRODUCTS.find((p) => p.id === id) ?? SAMPLE_PRODUCTS[0];
    const related = SAMPLE_PRODUCTS.filter((p) => p.id !== sample.id).slice(0, 4);
    return (
      <StoreChrome {...shell}>
        <ProductDetail product={sample} related={related} categoryName={sample.category.split(" · ")[0]} />
      </StoreChrome>
    );
  }

  const item = await getProduct(id).catch((err: unknown) => {
    if (err instanceof ShopApiError && err.status === 404) notFound();
    throw err;
  });

  const product = toThemeProduct(item);

  let related: Product[] = [];
  if (item.categoryId) {
    try {
      const catalog = await getCatalog({ categoryId: item.categoryId, pageSize: 5 });
      related = catalog.products
        .filter((p) => p.id !== item.id)
        .slice(0, 4)
        .map(toThemeProduct);
    } catch {
      related = [];
    }
  }

  return (
    <StoreChrome {...shell}>
      <ProductDetail product={product} related={related} categoryName={item.categoryName} />
    </StoreChrome>
  );
}
