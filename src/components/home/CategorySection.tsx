import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { SectionHead } from "@/components/shared/SectionHead";
import { FiArrowRight } from "@/components/shared/icons";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";
import { slugify } from "@/lib/slug";

/** One curated home row (themeJson.productSections) — heading + a category's products + a CTA to
 * that category's full page. Renders nothing if the category has no published products. */
export function CategorySection({
  index,
  title,
  categoryName,
  products,
  ctaLabel,
  alt = false,
}: {
  index: string;
  title: string;
  categoryName: string;
  products: Product[];
  ctaLabel?: string;
  /** alternate background so consecutive sections read as separate bands */
  alt?: boolean;
}) {
  if (products.length === 0) return null;
  const href = `/products/${slugify(categoryName)}`;
  const cta = ctaLabel?.trim() || `All ${categoryName}`;

  return (
    <section className={alt ? "bg-cream py-12 lg:py-14" : "bg-white py-12 lg:py-14"}>
      <Container>
        <SectionHead
          index={index}
          eyebrow={categoryName}
          title={title}
          right={
            <Link
              href={href}
              className="flex items-center gap-1.5 border-b-[1.5px] border-blue pb-0.5 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-blue"
            >
              {cta} <FiArrowRight size={13} />
            </Link>
          }
        />

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-9 flex justify-center lg:hidden">
          <Link
            href={href}
            className="border-[1.5px] border-navy px-7 py-3 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-navy transition-colors hover:bg-navy hover:text-white"
          >
            {cta}
          </Link>
        </div>
      </Container>
    </section>
  );
}
