import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { StoreChrome } from "@/components/StoreChrome";
import { ProductDetail } from "@/components/pages/ProductDetail";
import { toThemeProduct } from "@/lib/adapter";
import { PRODUCTS as SAMPLE_PRODUCTS, type Product } from "@/lib/products";
import { getCatalog, getProduct, ShopApiError } from "@/lib/shop-api";
import { loadShell } from "@/lib/store";
import type { CatalogItem } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Prefer the curated description; fall back to the first paragraph block, then the quick specs. */
function metaDescription(p: CatalogItem): string {
  if (p.description?.trim()) return p.description.trim().slice(0, 300);
  const para = p.content.blocks.find((b) => b.type !== "specs" && b.body)?.body;
  if (para) return para.trim().slice(0, 300);
  if (p.content.quickSpecs.length) return p.content.quickSpecs.join(" · ").slice(0, 300);
  return `Buy ${p.name} online.`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const p = await getProduct(id);
    return { title: p.name, description: metaDescription(p) };
  } catch {
    return { title: "Product" };
  }
}

/** Product structured data for rich results — commerce fields (price/availability) plus the specs
 * as additionalProperty so the on-page list is machine-readable too. */
function productJsonLd(p: CatalogItem, currency: string, url: string | null) {
  const specs = [
    ...p.content.quickSpecs,
    ...p.content.blocks.filter((b) => b.type === "specs").flatMap((b) => b.items),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    ...(p.description ? { description: p.description } : {}),
    ...(p.images.length ? { image: p.images.map((i) => i.url) } : {}),
    ...(p.categoryName ? { category: p.categoryName } : {}),
    ...(specs.length
      ? { additionalProperty: specs.slice(0, 30).map((s) => ({ "@type": "PropertyValue", name: s })) }
      : {}),
    offers: {
      "@type": "Offer",
      price: (p.priceCents / 100).toFixed(2),
      priceCurrency: currency || "KES",
      availability:
        p.stock === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      ...(url ? { url } : {}),
    },
  };
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

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const canonical = host ? `https://${host}/product/${encodeURIComponent(item.id)}` : null;

  return (
    <StoreChrome {...shell}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(item, shell.currency, canonical)) }}
      />
      <ProductDetail product={product} related={related} categoryName={item.categoryName} />
    </StoreChrome>
  );
}
