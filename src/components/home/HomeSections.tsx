import { Fragment } from "react";
import type { Category, Product } from "@/lib/products";
import type { TrylistTheme } from "@/lib/theme";
import { CategoryGrid } from "./CategoryGrid";
import { CategorySection } from "./CategorySection";
import { FeatureCards } from "./FeatureCards";
import { Hero } from "./Hero";
import { Newsletter } from "./Newsletter";
import { ProductGrid } from "./ProductGrid";
import { SectionDivider } from "./SectionDivider";
import { StoryRows } from "./StoryRows";
import { TrustBar } from "./TrustBar";

export type HomeProductSection = {
  title: string;
  categoryName: string;
  ctaLabel?: string;
  products: Product[];
};

/** The home page's own content — everything between the header and footer. */
export function HomeSections({
  products,
  categories,
  theme,
  sections,
  storeName,
}: {
  products: Product[];
  categories: Category[];
  theme: TrylistTheme;
  /** Curated category rows (themeJson.productSections, resolved + fetched in page.tsx). */
  sections: HomeProductSection[];
  storeName?: string;
}) {
  const curated = sections.filter((s) => s.products.length > 0);

  return (
    <>
      <Hero hero={theme.hero} storeName={storeName} />
      <CategoryGrid categories={categories} images={theme.categoryImages} />

      {curated.length > 0 ? (
        curated.map((s, i) => (
          <Fragment key={`${s.categoryName}-${i}`}>
            <CategorySection
              index={String(i + 2).padStart(2, "0")}
              title={s.title}
              categoryName={s.categoryName}
              ctaLabel={s.ctaLabel}
              products={s.products}
              alt={i % 2 === 1}
            />
            {/* the promo cards sit right after the first product row */}
            {i === 0 ? <FeatureCards theme={theme} /> : null}
            {i > 0 && i < curated.length - 1 ? <SectionDivider label={storeName} /> : null}
          </Fragment>
        ))
      ) : (
        <>
          <ProductGrid products={products} />
          <FeatureCards theme={theme} />
        </>
      )}

      <StoryRows rows={theme.story} />
      <TrustBar items={theme.trustBar} />
      <Newsletter />
    </>
  );
}
