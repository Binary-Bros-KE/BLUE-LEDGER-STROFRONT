"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Placeholder } from "@/components/shared/Placeholder";
import { FiMaximize2 } from "@/components/shared/icons";
import { Badge } from "./Badge";
import { FavouriteButton } from "./FavouriteButton";
import { PriceRow } from "./PriceRow";
import { Rating } from "./Rating";
import { StockLine } from "./StockLine";

/**
 * Spec §4 — the centrepiece. White, 1px solid line, no radius, no shadow.
 * Hover (spec §6): border line→navy, ADD TO CART→blue, quick-view square gains the amber offset
 * block. No lift, no scale. 140ms.
 * Responsive (spec §5): full card ≥ lg (172px thumb, rating, quick-view). Below lg it's the
 * compact card — 110px thumb, 13px name, 16px price, full-width ADD TO CART, no quick-view / rating.
 */
export function ProductCard({ product }: { product: Product }) {
  const { favourites, toggleFavourite, addToCart } = useCart();
  const favourite = favourites.has(product.id);
  const soldOut = product.stockState === "out_of_stock";
  const image = product.images?.[0];
  const href = `/product/${encodeURIComponent(product.id)}`;

  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (addedTimer.current) clearTimeout(addedTimer.current);
  }, []);

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="group flex flex-col border border-line bg-white transition-colors duration-[140ms] hover:border-navy">
      {/* 1 — top zone: badge + favourite, then the image / hatch block */}
      <div className="relative p-3.5">
        {product.badge ? (
          <div className="absolute left-3.5 top-3.5 z-10">
            <Badge {...product.badge} />
          </div>
        ) : null}
        <div className="absolute right-3.5 top-3.5 z-10">
          <FavouriteButton
            active={favourite}
            onToggle={() => toggleFavourite(product.id)}
            size={32}
            label={favourite ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}
          />
        </div>
        <Link href={href} className="block" aria-label={product.name}>
          {image ? (
            // TODO(images): switch to next/image + images.remotePatterns once R2 hosting is wired.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={product.name}
              className="ph-light h-[110px] w-full object-cover lg:h-[172px]"
              loading="lazy"
            />
          ) : (
            <Placeholder caption={product.imageCaption} className="h-[110px] lg:h-[172px]" />
          )}
        </Link>
      </div>

      {/* 2 — body */}
      <div className="flex flex-1 flex-col gap-[9px] px-4 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-slate">{product.category}</span>

        <h3 className="font-sans text-[13px] font-extrabold leading-[1.25] [text-wrap:pretty] lg:text-[16px]">
          <Link href={href} className={soldOut ? "text-slate-dim hover:text-slate-dim" : "text-navy hover:text-blue"}>
            {product.name}
          </Link>
        </h3>

        <div className="hidden lg:block">
          <Rating rating={product.rating} reviews={product.reviews} muted={soldOut} />
        </div>

        <PriceRow priceCents={product.priceCents} compareCents={product.compareCents} muted={soldOut} />

        <StockLine state={product.stockState} label={product.stockLabel} />

        {/* action row */}
        <div className="mt-1 flex items-stretch gap-2">
          <button
            type="button"
            onClick={handleAdd}
            aria-live="polite"
            className={`flex h-11 flex-1 items-center justify-center px-3 font-mono text-[11px] font-bold uppercase tracking-[1.4px] transition-colors duration-[140ms] ${
              soldOut
                ? "border-[1.5px] border-slate-dim text-slate-dim"
                : added
                  ? "bg-green text-white"
                  : "bg-navy text-white group-hover:bg-blue"
            }`}
          >
            {soldOut ? "NOTIFY ME" : added ? "Added!" : "ADD TO CART"}
          </button>

          <Link
            href={href}
            aria-label={`View ${product.name}`}
            className={`hidden h-11 w-11 flex-none place-items-center border-[1.5px] transition-shadow duration-[140ms] lg:grid ${
              soldOut
                ? "border-slate-dim text-slate-dim"
                : "border-navy text-navy group-hover:shadow-[4px_4px_0_var(--color-amber)]"
            }`}
          >
            <FiMaximize2 size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
