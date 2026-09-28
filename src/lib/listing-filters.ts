// Listing filters — the ONE definition of how sort + price live in the URL, shared by the routes
// (which turn them into /shop/catalog params) and every template's listing UI (which builds links).
//
//   /products/tvs?sort=price-asc&min=10000&max=50000&page=2
//
// Prices in the URL are whole currency units (what a shopper types); the API takes cents.

import type { Product } from "./products";

export type CatalogSort = "featured" | "price-asc" | "price-desc" | "newest";

export const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
];

export type ListingFilters = {
  sort: CatalogSort;
  /** whole currency units */
  minPrice?: number;
  maxPrice?: number;
};

function wholeUnits(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const n = Math.floor(Number(raw));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseListingFilters(sp: { sort?: string; min?: string; max?: string }): ListingFilters {
  const sort = SORT_OPTIONS.some((o) => o.value === sp.sort) ? (sp.sort as CatalogSort) : "featured";
  let minPrice = wholeUnits(sp.min);
  let maxPrice = wholeUnits(sp.max);
  // a reversed range is almost certainly a typo — swap rather than show nothing
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];
  return { sort, minPrice, maxPrice };
}

/** The /shop/catalog params for these filters. */
export function catalogParams(f: ListingFilters) {
  return {
    sort: f.sort,
    ...(f.minPrice !== undefined ? { minPriceCents: f.minPrice * 100 } : {}),
    ...(f.maxPrice !== undefined ? { maxPriceCents: f.maxPrice * 100 } : {}),
  };
}

export function hasActiveFilters(f: ListingFilters): boolean {
  return f.sort !== "featured" || f.minPrice !== undefined || f.maxPrice !== undefined;
}

/**
 * `basePath` (which may already carry `?q=…`) with these filters applied. Always drops `page` —
 * changing a filter must restart at page 1.
 */
export function listingHref(basePath: string, f: Partial<ListingFilters>): string {
  const [path, qs] = basePath.split("?");
  const params = new URLSearchParams(qs);
  params.delete("page");
  for (const k of ["sort", "min", "max"]) params.delete(k);
  if (f.sort && f.sort !== "featured") params.set("sort", f.sort);
  if (f.minPrice !== undefined) params.set("min", String(f.minPrice));
  if (f.maxPrice !== undefined) params.set("max", String(f.maxPrice));
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}

/** Preview mode (no live store): apply the same filters to the local sample products. */
export function filterSample(products: Product[], f: ListingFilters): Product[] {
  let out = products.filter(
    (p) =>
      (f.minPrice === undefined || p.priceCents >= f.minPrice * 100) &&
      (f.maxPrice === undefined || p.priceCents <= f.maxPrice * 100),
  );
  if (f.sort === "price-asc") out = [...out].sort((a, b) => a.priceCents - b.priceCents);
  if (f.sort === "price-desc") out = [...out].sort((a, b) => b.priceCents - a.priceCents);
  return out;
}

export function sampleRange(products: Product[]): { minCents: number; maxCents: number } | null {
  if (products.length === 0) return null;
  const prices = products.map((p) => p.priceCents);
  return { minCents: Math.min(...prices), maxCents: Math.max(...prices) };
}
