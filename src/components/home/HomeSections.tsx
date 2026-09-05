import type { Category, Product } from "@/lib/products";
import { CategoryGrid } from "./CategoryGrid";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Newsletter } from "./Newsletter";
import { ProductGrid } from "./ProductGrid";
import { TrustBar } from "./TrustBar";

/** The home page's own content — everything between the header and footer. */
export function HomeSections({ products, categories }: { products: Product[]; categories: Category[] }) {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryGrid categories={categories} />
      <ProductGrid products={products} />
      <Features />
      <Newsletter />
    </>
  );
}
