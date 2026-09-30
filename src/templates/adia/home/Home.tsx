import type { Product } from "@/lib/products";
import type { HomeProps } from "../../types";
import { Container } from "../components/Container";
import { categoryHref, parseAdiaHome, type AdiaProductRow } from "../content";
import { BrandsMarquee } from "./BrandsMarquee";
import { CategoryGrid } from "./CategoryGrid";
import { Collections } from "./Collections";
import { Features } from "./Features";
import { HeroCarousel } from "./HeroCarousel";
import { HotDealsBand } from "./HotDealsBand";
import { Newsletter } from "./Newsletter";
import { ProductGrid } from "./ProductGrid";
import { PromoCards } from "./PromoCards";
import { SectionHead } from "./SectionHead";
import { Spaces } from "./Spaces";

/**
 * Adia home, top to bottom: hero → features → categories → Best Sellers → feature cards →
 * Hot Deals (red band) → feature cards → Latest Arrivals → What's Your Space? → Top Deals →
 * collections → brands → newsletter. (The black top strip + footer live in AdiaChrome.)
 * Every text, image and category pick comes from themeJson.adia (POS), with Adia defaults.
 */
export function Home({ categories, theme, rows = {} }: HomeProps) {
  const c = parseAdiaHome(theme.adia, categories);
  const images = theme.categoryImages;
  const rowHref = (r: AdiaProductRow, fallback: string) => (r.categoryId ? categoryHref(r.categoryId, categories) : fallback);

  return (
    // The red newsletter band is the last section: sit it flush on the footer (cancels the footer's top gap).
    <div className={c.newsletter.enabled ? "-mb-14" : "pb-2"}>
      <HeroCarousel slides={c.heroSlides} />
      <Features items={theme.trustBar} />
      <CategoryGrid section={c.categories} categories={categories} categoryImages={images} />
      <Row row={c.bestSellers} products={rows.bestSellers ?? []} href={rowHref(c.bestSellers, "/products")} />
      <PromoCards cards={c.promosA} />
      <HotDealsBand row={c.hotDeals} products={rows.hotDeals ?? []} href={rowHref(c.hotDeals, "/products")} />
      <PromoCards cards={c.promosB} />
      <Row row={c.latestArrivals} products={rows.latestArrivals ?? []} href={rowHref(c.latestArrivals, "/products?sort=newest")} />
      <Spaces section={c.spaces} categories={categories} categoryImages={images} />
      <Row row={c.topDeals} products={rows.topDeals ?? []} href={rowHref(c.topDeals, "/products")} />
      <Collections section={c.collections} />
      <BrandsMarquee section={c.brands} brands={theme.brands} />
      <Newsletter section={c.newsletter} whatsapp={c.socials.whatsapp ?? theme.contact.whatsappSalesNumber} />
    </div>
  );
}

function Row({ row, products, href }: { row: AdiaProductRow; products: Product[]; href: string }) {
  if (!row.enabled || products.length === 0) return null;
  return (
    <Container className="mt-12 lg:mt-16">
      <SectionHead title={row.title} subtitle={row.subtitle} href={href} cta={row.ctaLabel} />
      <ProductGrid products={products} />
    </Container>
  );
}
