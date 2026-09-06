import type { Category, Product } from "@/lib/products";
import type { TrylistTheme } from "@/lib/theme";
import { CategoryGrid } from "./CategoryGrid";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Newsletter } from "./Newsletter";
import { ProductGrid } from "./ProductGrid";
import { StoryRows } from "./StoryRows";
import { TrustBar } from "./TrustBar";

/** The home page's own content — everything between the header and footer. */
export function HomeSections({
  products,
  categories,
  theme,
}: {
  products: Product[];
  categories: Category[];
  theme: TrylistTheme;
}) {
  return (
    <>
      <Hero hero={theme.hero} />
      <TrustBar />
      <CategoryGrid categories={categories} images={theme.categoryImages} />
      <ProductGrid products={products} />
      <StoryRows rows={theme.story} />
      <Features />
      <Newsletter />
    </>
  );
}
