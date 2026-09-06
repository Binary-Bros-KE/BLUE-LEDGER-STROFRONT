// Maps SERVER `/shop` responses onto the "Classic" theme's component shapes.
// Real data drives everything the API has; MOCK generators fill rating / review count so the
// reviews feature isn't silently dropped (see src/lib/products.ts).

import { mockRating, mockReviews } from "./products";
import type { Category, Product, StockState } from "./products";
import type { CatalogItem, ShopCategory } from "./types";

function stockLabel(stock: StockState): string {
  switch (stock) {
    case "in_stock":
      return "IN STOCK";
    case "low":
      return "LOW STOCK";
    case "out_of_stock":
      return "OUT OF STOCK";
    case "made_to_order":
      return "MADE TO ORDER";
  }
}

export function toThemeProduct(item: CatalogItem): Product {
  const categoryLabel = (item.categoryName ?? "SHOP").toUpperCase();
  return {
    id: item.id,
    name: item.name,
    category: categoryLabel,
    priceCents: item.priceCents,
    // TODO(catalog): no compare-at price in the API — add Product.compareAtPriceCents to show a
    // strike-through. Left undefined for real products.
    compareCents: undefined,
    // TODO(reviews): MOCK — no ratings/reviews in the data model yet. Not real numbers.
    rating: mockRating(item.id),
    reviews: mockReviews(item.id),
    stockState: item.stock,
    stockLabel: stockLabel(item.stock),
    // TODO(catalog): no NEW/BUNDLE/TOP-RATED product flags in the API yet.
    badge: undefined,
    imageCaption: `[ ${categoryLabel || "PRODUCT"} ]`,
    images: item.images.map((i) => i.url),
    description: item.description,
    unitOfMeasure: item.unitOfMeasure,
    wholesalePriceCents: item.wholesalePriceCents,
    wholesaleMinQuantity: item.wholesaleMinQuantity,
    content: item.content,
  };
}

export function toThemeCategory(cat: ShopCategory, index: number): Category {
  return {
    id: cat.id,
    name: cat.name,
    count: cat.count,
    caption: `[ ${cat.name.toUpperCase()} ]`,
    // Spec §4 — the 3rd tile is the inverted navy one.
    inverted: index === 2,
  };
}
