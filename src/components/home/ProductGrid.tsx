import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { SectionHead } from "@/components/shared/SectionHead";
import { FiArrowRight, FiChevronDown } from "@/components/shared/icons";
import { ProductCard } from "@/components/product/ProductCard";
import { GRID_FILTERS, type Product } from "@/lib/products";
import { PromoTile } from "./PromoTile";

// Spec §4 — white, 52px 40px 60px. Grid repeat(4,1fr), 7 cards + blue promo tile, then a centred
// "LOAD 24 MORE PRODUCTS". Mobile (spec §5 + reference #4): 2 columns, compact cards, first 4 only,
// "SEE ALL →" in the header instead of the filter chips, no promo tile, no load-more.
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section className="bg-white pb-[60px] pt-[52px]">
      <Container>
        <SectionHead
          index="02"
          eyebrow="In stock now"
          title="Popular this week."
          right={
            <>
              <div className="hidden items-center gap-2 lg:flex">
                {GRID_FILTERS.map((f, i) => (
                  <button
                    key={f}
                    type="button"
                    className={`px-3.5 py-[9px] font-mono text-[11px] uppercase tracking-[1.2px] ${
                      i === 0 ? "bg-navy text-white" : "border border-line text-navy hover:border-navy"
                    }`}
                  >
                    {f}
                  </button>
                ))}
                <button
                  type="button"
                  className="flex items-center gap-1 border border-line px-3.5 py-[9px] font-mono text-[11px] uppercase tracking-[1.2px] text-navy hover:border-navy"
                >
                  Sort: Popular <FiChevronDown size={11} />
                </button>
              </div>
              <Link
                href="/products"
                className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[1.4px] text-blue lg:hidden"
              >
                See all <FiArrowRight size={13} />
              </Link>
            </>
          }
        />

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          <div className="hidden lg:contents">
            {products.slice(4, 7).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            <PromoTile />
          </div>
        </div>

        <div className="mt-10 hidden justify-center lg:flex">
          <Link
            href="/products"
            className="border-[1.5px] border-navy px-8 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Browse all products
          </Link>
        </div>
      </Container>
    </section>
  );
}
