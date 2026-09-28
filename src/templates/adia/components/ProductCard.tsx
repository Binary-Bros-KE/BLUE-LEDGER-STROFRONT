"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaHeart, FaStar, FiHeart } from "@/components/shared/icons";
import { useCart } from "@/lib/cart";
import { useMoney } from "@/lib/currency";
import type { Product } from "@/lib/products";

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex items-center gap-[1px] text-accent-ink" aria-label={`${rating.toFixed(1)} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar key={i} size={12} className={i < filled ? "" : "opacity-25"} />
        ))}
      </span>
      {reviews !== undefined ? <span className="text-[12px] text-ink-faint">({reviews})</span> : null}
    </div>
  );
}

/** "-20%" when there's a compare-at price, else the product's own badge label. */
function badgeFor(product: Product): string | null {
  if (product.compareCents && product.compareCents > product.priceCents) {
    return `-${Math.round((1 - product.priceCents / product.compareCents) * 100)}%`;
  }
  return product.badge?.label ?? null;
}

/**
 * Adia product tile: rounded white card, discount/badge chip, wishlist heart, contained photo,
 * 2-line name, primary price (+ struck compare price), stars, full-width Add to Cart.
 */
export function ProductCard({ product }: { product: Product }) {
  const fmt = useMoney();
  const { favourites, toggleFavourite, addToCart } = useCart();
  const favourite = favourites.has(product.id);
  const soldOut = product.stockState === "out_of_stock";
  const image = product.images?.[0];
  const href = `/product/${encodeURIComponent(product.id)}`;
  const badge = badgeFor(product);

  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="group relative flex flex-col rounded-xl border border-line bg-surface p-3 transition-shadow duration-200 hover:shadow-lg lg:p-4">
      {badge ? (
        <span className="absolute top-3 left-3 z-10 rounded-md bg-primary px-2 py-1 font-display text-[11px] font-bold leading-none text-on-primary">
          {badge}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => toggleFavourite(product.id)}
        aria-pressed={favourite}
        aria-label={favourite ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
        className={`absolute top-3 right-3 z-10 grid size-8 place-items-center rounded-full bg-surface shadow-sm transition-colors ${
          favourite ? "text-primary-ink" : "text-ink-faint hover:text-primary-ink"
        }`}
      >
        {favourite ? <FaHeart size={15} /> : <FiHeart size={15} />}
      </button>

      <Link href={href} aria-label={product.name} className="block">
        <div className="grid aspect-square place-items-center overflow-hidden rounded-lg bg-surface">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="size-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <span className="grid size-full place-items-center rounded-lg bg-surface-alt px-3 text-center text-[11px] font-medium text-ink-faint">
              {product.name}
            </span>
          )}
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col gap-1.5">
        <h3 className="line-clamp-2 min-h-[2.6em] text-[13px] font-medium leading-snug lg:text-[14px]">
          <Link href={href} className={soldOut ? "text-ink-faint" : "text-ink hover:text-primary-ink"}>
            {product.name}
          </Link>
        </h3>

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className={`font-display text-[15px] font-bold lg:text-[16px] ${soldOut ? "text-ink-faint" : "text-primary-ink"}`}>
            {fmt(product.priceCents)}
          </span>
          {product.compareCents && product.compareCents > product.priceCents ? (
            <span className="text-[12px] text-ink-faint line-through">{fmt(product.compareCents)}</span>
          ) : null}
        </div>

        <Stars rating={product.rating} reviews={product.reviews} />

        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          aria-live="polite"
          className={`mt-auto h-10 rounded-lg font-display text-[13px] font-semibold transition-colors ${
            soldOut
              ? "cursor-not-allowed bg-surface-alt text-ink-faint"
              : added
                ? "bg-success text-white"
                : "bg-primary text-on-primary hover:bg-primary-hover"
          }`}
        >
          {soldOut ? "Out of stock" : added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
