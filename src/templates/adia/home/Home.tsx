import { slugify } from "@/lib/slug";
import type { HomeProps } from "../../types";
import { Brands } from "./Brands";
import { CategoryRow } from "./CategoryRow";
import { Hero } from "./Hero";
import { HotDeals } from "./HotDeals";
import { ProductSection } from "./ProductSection";
import { Promos } from "./Promos";
import { TrustBar } from "./TrustBar";

/** Adia home: hero → trust bar → categories → hot deals → product rows → promos → brands. */
export function Home({ products, categories, theme, sections }: HomeProps) {
  const curated = sections.filter((s) => s.products.length > 0);

  return (
    <div className="pb-4">
      <Hero hero={theme.hero} deal={theme.dealTile} />
      <TrustBar items={theme.trustBar} />
      <CategoryRow categories={categories} images={theme.categoryImages} />
      <HotDeals deal={theme.dealTile} />

      {curated.length > 0 ? (
        curated.map((s, i) => (
          <ProductSection
            key={`${s.categoryName}-${i}`}
            title={s.title}
            href={`/products/${slugify(s.categoryName)}`}
            cta={s.ctaLabel?.trim() || "View All"}
            products={s.products}
          />
        ))
      ) : (
        <ProductSection title="Featured Products" href="/products" products={products} />
      )}

      <Promos rows={theme.story} />
      <Brands brands={theme.brands} />
    </div>
  );
}
