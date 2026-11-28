import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { toThemeProduct } from "@/lib/adapter";
import { PRODUCTS as SAMPLE_PRODUCTS, type Product } from "@/lib/products";
import { isProductMerchantReady, lowestPriceCents, productDescription, realImageUrls } from "@/lib/merchant-ready";
import { productPath } from "@/lib/product-url";
import { getCatalog, getProduct, getStore, ShopApiError } from "@/lib/shop-api";
import { pageOpenGraph } from "@/lib/seo";
import { siteOrigin } from "@/lib/site-url";
import { loadShell } from "@/lib/store";
import { getTemplate } from "@/templates/registry";
import type { CatalogItem } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Visible price as Google expects it: a plain decimal string, no symbols or separators. */
const price = (cents: number) => (cents / 100).toFixed(2);

/** Meta description: the product's plain-text description, else its quick specs. */
function metaDescription(p: CatalogItem): string {
  const text = productDescription(p);
  if (text) return text.slice(0, 300);
  if (p.content.quickSpecs.length) return p.content.quickSpecs.join(" · ").slice(0, 300);
  return `Buy ${p.name} online.`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const [p, store] = await Promise.all([getProduct(id), getStore()]);
    const description = metaDescription(p);
    const url = productPath(p);
    const images = realImageUrls(p).slice(0, 4).map((u) => ({ url: u, alt: p.name }));
    const ready = isProductMerchantReady(p);
    return {
      title: p.name,
      description,
      alternates: { canonical: url },
      // Incomplete products stay browsable but out of Google until they have a photo, a price and a
      // description (lib/merchant-ready.ts) — they flip to indexable on the next request after that.
      ...(ready ? {} : { robots: { index: false, follow: true } }),
      openGraph: pageOpenGraph(store, { url, title: p.name, description, images }),
      twitter: {
        card: images.length ? "summary_large_image" : "summary",
        title: p.name,
        description,
        ...(images.length ? { images: images.map((i) => i.url) } : {}),
      },
    };
  } catch {
    return { title: "Product" };
  }
}

/** schema.org availability. Only stock actually on hand is InStock — a made-to-order item isn't ready
 * to ship, so it's reported as OutOfStock (never InStock), as Merchant Center requires. */
function availability(stock: CatalogItem["stock"]): string {
  return stock === "in_stock" || stock === "low" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
}

/** Product structured data (only for merchant-ready products): name = the page's <h1>, the real
 * photos, a plain-text description, the stable product id as sku/productID (survives a rename that
 * changes the slug), the brand (else the shop's name), and an Offer whose price and availability
 * match what the page shows. No aggregateRating — the site has no real reviews yet. */
function productJsonLd(p: CatalogItem, currency: string, url: string, storeName: string) {
  const specs = [
    ...p.content.quickSpecs,
    ...p.content.blocks.filter((b) => b.type === "specs").flatMap((b) => b.items),
  ];
  const common = {
    priceCurrency: currency || "KES",
    availability: availability(p.stock),
    itemCondition: "https://schema.org/NewCondition",
    url,
  };
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: p.name,
    image: realImageUrls(p),
    description: productDescription(p),
    sku: p.id,
    productID: p.id,
    ...(p.categoryName ? { category: p.categoryName } : {}),
    brand: { "@type": "Brand", name: p.brand?.trim() || storeName },
    ...(specs.length
      ? { additionalProperty: specs.slice(0, 30).map((s) => ({ "@type": "PropertyValue", name: s })) }
      : {}),
    // Shared-stock variants are one product at several prices ("From …" on the page) → an
    // AggregateOffer with the range. A separate-stock variant's page is its own product → one Offer.
    offers:
      p.variants?.mode === "shared" && p.variantSummary
        ? {
            "@type": "AggregateOffer",
            lowPrice: price(p.variantSummary.minPriceCents),
            highPrice: price(p.variantSummary.maxPriceCents),
            offerCount: p.variantSummary.count,
            ...common,
          }
        : { "@type": "Offer", price: price(p.priceCents), ...common },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { shell, preview } = await loadShell();
  const T = getTemplate(shell.templateId);

  if (preview) {
    const sample = SAMPLE_PRODUCTS.find((p) => p.id === id) ?? SAMPLE_PRODUCTS[0];
    const related = SAMPLE_PRODUCTS.filter((p) => p.id !== sample.id).slice(0, 4);
    return (
      <T.Chrome {...shell}>
        <T.ProductDetail product={sample} related={related} categoryName={sample.category.split(" · ")[0]} />
      </T.Chrome>
    );
  }

  const item = await getProduct(id).catch((err: unknown) => {
    if (err instanceof ShopApiError && err.status === 404) notFound();
    throw err;
  });

  // Old id URLs (/product/product_83574a81-…) and any non-canonical spelling permanently redirect
  // to the slug URL, so search engines and shared links move over to /product/<slug>.
  if (item.slug && decodeURIComponent(id) !== item.slug) permanentRedirect(productPath(item));

  const product = toThemeProduct(item);

  let related: Product[] = [];
  if (item.categoryId) {
    try {
      const catalog = await getCatalog({ categoryId: item.categoryId, pageSize: 13 });
      related = catalog.products
        .filter((p) => p.id !== item.id)
        .slice(0, 12)
        .map(toThemeProduct);
    } catch {
      related = [];
    }
  }

  const canonical = `${await siteOrigin(await getStore().catch(() => null))}${productPath(item)}`;

  return (
    <T.Chrome {...shell}>
      {/* Open Graph product price — `property=` (Next's metadata `other` can only emit `name=`); React
          hoists these <meta> tags into <head>. */}
      <meta property="product:price:amount" content={price(lowestPriceCents(item))} />
      <meta property="product:price:currency" content={shell.currency || "KES"} />
      {/* Server-rendered in the initial HTML, and only for merchant-ready products */}
      {isProductMerchantReady(item) ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(item, shell.currency, canonical, shell.storeName)) }}
        />
      ) : null}
      <T.ProductDetail
        product={product}
        related={related}
        categoryName={item.categoryName}
        storeName={shell.storeName}
        headerImage={
          (item.categoryId ? shell.theme.categoryImages[item.categoryId] : undefined) ||
          shell.theme.headerImageUrl
        }
      />
    </T.Chrome>
  );
}
