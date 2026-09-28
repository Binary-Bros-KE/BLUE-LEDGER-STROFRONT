import type { Product } from "@/lib/products";
import { Container } from "../components/Container";
import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "./SectionHeader";

/** A titled product grid — 2-up on phones, 3 on tablets, 4 on desktop (max 8 products). */
export function ProductSection({
  title,
  href,
  cta,
  products,
}: {
  title: string;
  href: string;
  cta?: string;
  products: Product[];
}) {
  if (products.length === 0) return null;
  return (
    <Container className="mt-10 lg:mt-12">
      <SectionHeader title={title} href={href} cta={cta} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </Container>
  );
}
