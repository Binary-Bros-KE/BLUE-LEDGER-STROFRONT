"use client";

import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "@/components/shared/icons";
import type { Product } from "@/lib/products";
import { ProductCard } from "../components/ProductCard";

/** A horizontally scrolling row of product cards (~5 visible on desktop) with arrow buttons. */
export function ProductRail({ products, onDark = false }: { products: Product[]; onDark?: boolean }) {
  const track = useRef<HTMLDivElement | null>(null);
  const scroll = (dir: number) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };
  const arrow = `absolute top-[38%] z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full shadow-lg transition lg:grid ${
    onDark ? "bg-white text-ink hover:bg-surface-alt" : "border border-line bg-surface text-ink hover:border-primary hover:text-primary-ink"
  }`;

  return (
    <div className="relative">
      <div
        ref={track}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:gap-4 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <div key={p.id} className="w-[46%] flex-none snap-start sm:w-[31%] lg:w-[calc((100%-4rem)/5)]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      {products.length > 5 ? (
        <>
          <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left" className={`${arrow} -left-5`}>
            <FiChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Scroll right" className={`${arrow} -right-5`}>
            <FiChevronRight size={20} />
          </button>
        </>
      ) : null}
    </div>
  );
}
