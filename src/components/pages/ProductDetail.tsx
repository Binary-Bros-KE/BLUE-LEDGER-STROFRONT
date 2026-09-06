"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QtyStepper } from "@/components/cart/QtyStepper";
import { FavouriteButton } from "@/components/product/FavouriteButton";
import { ProductCard } from "@/components/product/ProductCard";
import { Rating } from "@/components/product/Rating";
import { StockLine } from "@/components/product/StockLine";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Container } from "@/components/shared/Container";
import { Placeholder } from "@/components/shared/Placeholder";
import { FiArrowRight, FiPlay } from "@/components/shared/icons";
import { useCart } from "@/lib/cart";
import { useMoney } from "@/lib/currency";
import type { Product } from "@/lib/products";
import { slugify } from "@/lib/slug";

export function ProductDetail({
  product,
  related,
  categoryName,
}: {
  product: Product;
  related: Product[];
  categoryName: string | null;
}) {
  const fmt = useMoney();
  const { favourites, toggleFavourite, addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (addedTimer.current) clearTimeout(addedTimer.current);
  }, []);

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1600);
  }

  const soldOut = product.stockState === "out_of_stock";
  const favourite = favourites.has(product.id);
  const images = product.images ?? [];
  const catSlug = categoryName ? slugify(categoryName) : null;
  const showWholesale =
    product.wholesalePriceCents != null && (product.wholesaleMinQuantity ?? 0) > 1;

  return (
    <>
      <div className="border-b border-line bg-cream">
        <Container className="py-8">
          <Breadcrumb
            trail={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              ...(categoryName && catSlug ? [{ label: categoryName, href: `/products/${catSlug}` }] : []),
              { label: product.name },
            ]}
          />
        </Container>
      </div>

      <section className="bg-white py-10 lg:py-14">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
            {/* gallery */}
            <div>
              <div className="border border-navy/20 bg-white shadow-[10px_10px_0_rgba(22,32,74,0.10)]">
                {images[activeImg] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={images[activeImg]}
                    alt={product.name}
                    className="ph-light aspect-square w-full object-cover"
                  />
                ) : (
                  <Placeholder caption={product.imageCaption} className="aspect-square w-full" />
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex gap-3">
                  {images.slice(0, 5).map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`size-16 flex-none border ${i === activeImg ? "border-navy" : "border-line"}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="ph-light size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* info */}
            <div className="flex flex-col">
              <span className="font-mono text-[11px] uppercase tracking-[1.6px] text-slate">
                {catSlug ? (
                  <Link href={`/products/${catSlug}`} className="text-slate hover:text-navy">
                    {categoryName}
                  </Link>
                ) : (
                  product.category
                )}
              </span>

              <h1 className="mt-2 font-sans text-[26px] font-black leading-[1.1] tracking-[-0.8px] text-navy sm:text-[32px]">
                {product.name}
              </h1>

              <div className="mt-3">
                <Rating rating={product.rating} reviews={product.reviews} muted={soldOut} />
              </div>

              <div className="mt-5 flex items-baseline gap-3">
                <span className={`font-sans text-[30px] font-black leading-none ${soldOut ? "text-slate-dim" : "text-navy"}`}>
                  {fmt(product.priceCents)}
                </span>
                {product.compareCents ? (
                  <span className="font-mono text-[14px] text-slate line-through">{fmt(product.compareCents)}</span>
                ) : null}
                {product.unitOfMeasure ? (
                  <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-slate">
                    / {product.unitOfMeasure}
                  </span>
                ) : null}
              </div>

              <div className="mt-3">
                <StockLine state={product.stockState} label={product.stockLabel} />
              </div>

              {showWholesale ? (
                <div className="mt-4 border border-cream-line bg-cream px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[1.6px] text-amber-ink">Bulk price</span>
                  <p className="mt-1 font-sans text-[14px] font-bold text-navy">
                    {product.wholesaleMinQuantity}+ units @ {fmt(product.wholesalePriceCents as number)} each
                  </p>
                </div>
              ) : null}

              {product.description ? (
                <p className="mt-5 max-w-[46ch] font-sans text-[14px] leading-[1.8] whitespace-pre-line text-navy/75">
                  {product.description}
                </p>
              ) : null}

              {product.content && product.content.quickSpecs.length > 0 ? (
                <section className="mt-6" aria-label="Quick specifications">
                  <h2 className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-slate">
                    Quick specs
                  </h2>
                  <ul className="mt-3 max-w-[46ch] space-y-1.5">
                    {product.content.quickSpecs.map((s, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 font-sans text-[13px] leading-[1.6] text-navy/80"
                      >
                        <span aria-hidden="true" className="mt-[7px] size-1.5 flex-none bg-amber" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* actions */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {!soldOut && (
                  <QtyStepper qty={qty} onDec={() => setQty((q) => Math.max(1, q - 1))} onInc={() => setQty((q) => q + 1)} />
                )}
                <button
                  type="button"
                  onClick={() => (soldOut ? undefined : handleAdd())}
                  aria-live="polite"
                  className={`blk inline-flex h-12 items-center justify-center gap-2 px-8 font-mono text-[12px] font-bold uppercase tracking-[1.6px] transition-colors ${
                    soldOut
                      ? "border-[1.5px] border-slate-dim text-slate-dim"
                      : added
                        ? "bg-green text-white"
                        : "bg-navy text-white hover:bg-blue"
                  }`}
                >
                  {!soldOut && <FiPlay size={11} />}
                  {soldOut ? "Notify me" : added ? "Added!" : "Add to cart"}
                </button>
                <FavouriteButton
                  active={favourite}
                  onToggle={() => toggleFavourite(product.id)}
                  size={48}
                  label={favourite ? "Remove from favourites" : "Add to favourites"}
                />
              </div>

              <p className="mt-6 font-mono text-[10px] uppercase leading-[1.7] tracking-[1.2px] text-slate">
                M-Pesa · Card · Trade invoice · Delivered countrywide
              </p>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-white pb-16 pt-10">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-sans text-[22px] font-black leading-[1.1] tracking-[-0.7px] text-navy md:text-[28px]">
                You might also like.
              </h2>
              {catSlug && (
                <Link
                  href={`/products/${catSlug}`}
                  className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[1.4px] text-blue"
                >
                  More {categoryName} <FiArrowRight size={13} />
                </Link>
              )}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {product.content && product.content.blocks.length > 0 ? (
        <section className="border-t border-line bg-cream py-14" aria-label="Product details">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-10">
              {product.content.blocks.map((b, i) => (
                <article key={i}>
                  {b.heading ? (
                    <h2 className="font-sans text-[20px] font-black leading-[1.15] tracking-[-0.4px] text-navy md:text-[24px]">
                      {b.heading}
                    </h2>
                  ) : null}
                  {b.type === "specs" ? (
                    <ul className={`${b.heading ? "mt-4" : ""} space-y-2`}>
                      {b.items.map((s, j) => (
                        <li
                          key={j}
                          className="flex gap-3 border-b border-cream-line pb-2 font-sans text-[14px] leading-[1.6] text-navy/80 last:border-b-0"
                        >
                          <span aria-hidden="true" className="mt-[8px] size-1.5 flex-none bg-blue" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      className={`${b.heading ? "mt-4" : ""} font-sans text-[14px] leading-[1.9] whitespace-pre-line ${
                        b.type === "notes" ? "text-navy/60 italic" : "text-navy/80"
                      }`}
                    >
                      {b.body}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
