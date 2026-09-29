import type { Product } from "@/lib/products";
import { ProductCard } from "../components/ProductCard";

/** Home product section grid — 2 / 3 / 4 / 6 columns. The rows fetch 12 products, which divides
 * evenly into every one of those, so the last line is always full. */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
