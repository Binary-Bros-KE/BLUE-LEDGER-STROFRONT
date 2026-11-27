import type { CatalogItem } from "./types";

/** Minimum plain-text description length before a product is offered to Google. */
const MIN_DESCRIPTION_CHARS = 20;

/** Tags stripped, entities and whitespace collapsed — what a crawler sees as the description. */
export function plainText(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** The product's description as plain text — the curated description, else its first paragraph block. */
export function productDescription(p: Pick<CatalogItem, "description" | "content">): string {
  const own = plainText(p.description);
  if (own) return own;
  const para = p.content.blocks.find((b) => b.type !== "specs" && b.body)?.body;
  return plainText(para);
}

/** Real product photos only: an http(s) URL that isn't a generic placeholder image. */
export function realImageUrls(p: Pick<CatalogItem, "images">): string[] {
  return p.images
    .map((i) => i.url?.trim() ?? "")
    .filter((url) => /^https?:\/\//i.test(url) && !/placeholder|no[-_]?image|default[-_]?image/i.test(url));
}

/** Lowest price a shopper can pay (variants included), in cents. */
export function lowestPriceCents(p: Pick<CatalogItem, "priceCents" | "variantSummary">): number {
  return p.variantSummary ? p.variantSummary.minPriceCents : p.priceCents;
}

/**
 * Whether a product is complete enough for Google (Merchant Center, Shopping, search): a real photo,
 * a price above zero, a title and a plain-text description of at least 20 characters. Incomplete
 * products stay fully browsable, but are kept out of the sitemap, get `noindex, follow` and no Product
 * schema — and become indexable on the very next request once the shop adds what's missing (every
 * page is rendered per request).
 */
export function isProductMerchantReady(p: CatalogItem): boolean {
  return (
    p.name.trim().length > 0 &&
    lowestPriceCents(p) > 0 &&
    realImageUrls(p).length > 0 &&
    productDescription(p).length >= MIN_DESCRIPTION_CHARS
  );
}
