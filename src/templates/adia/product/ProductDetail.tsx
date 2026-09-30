"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FiCheck,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiHeadphones,
  FiHeart,
  FiShield,
  FiShoppingBag,
  FiTruck,
} from "@/components/shared/icons";
import { useCart } from "@/lib/cart";
import { useVariantChoice } from "@/lib/variant-choice";
import { useMoney } from "@/lib/currency";
import type { Product } from "@/lib/products";
import { slugify } from "@/lib/slug";
import { productOrderMessage } from "@/lib/whatsapp-order";
import type { ProductDetailProps } from "../../types";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { QtyStepper } from "../components/CartDrawer";
import { Container } from "../components/Container";
import { ProductCard, Stars } from "../components/ProductCard";
import { WhatsAppButton } from "../components/WhatsAppButton";

/** "Screen Size: 55 inches" → ["Screen Size", "55 inches"]; a line without a short label stays whole. */
function splitSpec(line: string): [string, string] | [string] {
  const i = line.indexOf(":");
  if (i > 0 && i <= 40 && line.slice(i + 1).trim()) return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  return [line.trim()];
}

function allSpecs(product: Product): string[] {
  const c = product.content;
  if (!c) return [];
  return [...c.quickSpecs, ...c.blocks.filter((b) => b.type === "specs").flatMap((b) => b.items)].filter((s) => s.trim());
}

/** One row of option chips (Size: S M L …) — values nothing can be bought in are crossed out. */
function VariantChips({ vc }: { vc: ReturnType<typeof useVariantChoice> }) {
  if (!vc.hasVariants) return null;
  return (
    <div className="mt-5 space-y-4">
      {vc.options.map((option) => (
        <div key={option.name}>
          <p className="text-[13px] font-semibold text-ink">
            {option.name}
            {vc.selected[option.name] ? <span className="font-normal text-ink-muted">: {vc.selected[option.name]}</span> : null}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {option.values.map((value) => {
              const on = vc.selected[option.name] === value;
              const ok = vc.available(option.name, value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => vc.choose(option.name, value)}
                  disabled={!ok && !on}
                  aria-pressed={on}
                  className={`min-w-12 rounded-lg border-2 px-3.5 py-2 text-[14px] font-semibold transition-colors ${
                    on
                      ? "border-primary bg-primary-soft text-primary-ink"
                      : ok
                        ? "border-line-strong text-ink hover:border-primary"
                        : "cursor-not-allowed border-line text-ink-faint line-through"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function StockPill({ product }: { product: Product }) {
  const tone =
    product.stockState === "out_of_stock"
      ? "bg-danger"
      : product.stockState === "low"
        ? "bg-accent"
        : product.stockState === "made_to_order"
          ? "bg-ink-faint"
          : "bg-success";
  const label =
    product.stockState === "out_of_stock"
      ? "Out of stock"
      : product.stockState === "low"
        ? "Low stock — order soon"
        : product.stockState === "made_to_order"
          ? "Available to order"
          : "In stock";
  return (
    <span className="flex items-center gap-2 text-[14px] font-medium text-ink">
      <span className={`size-2.5 rounded-full ${tone}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function Gallery({ product }: { product: Product }) {
  const images = product.images ?? [];
  const [active, setActive] = useState(0);
  const discount =
    product.compareCents && product.compareCents > product.priceCents
      ? Math.round((1 - product.priceCents / product.compareCents) * 100)
      : null;
  const go = (d: number) => setActive((i) => (i + d + images.length) % images.length);

  return (
    <div>
      <div className="relative grid aspect-square place-items-center overflow-hidden rounded-xl border border-line bg-surface">
        {discount ? (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-primary px-2.5 py-1 font-display text-[13px] font-bold text-on-primary">
            -{discount}%
          </span>
        ) : null}
        {images[active] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[active]} alt={product.name} className="size-full object-contain p-4" />
        ) : (
          <span className="px-6 text-center text-[14px] font-medium text-ink-faint">{product.name}</span>
        )}
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink shadow-md hover:text-primary-ink"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink shadow-md hover:text-primary-ink"
            >
              <FiChevronRight size={18} />
            </button>
          </>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
          {images.slice(0, 8).map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`size-[72px] flex-none overflow-hidden rounded-lg border-2 bg-surface transition-colors ${
                i === active ? "border-primary" : "border-line hover:border-line-strong"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="size-full object-contain p-1" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ProductDetail({ product, related, categoryName, storeName }: ProductDetailProps) {
  const fmt = useMoney();
  const router = useRouter();
  const { favourites, toggleFavourite, addToCart } = useCart();
  const vc = useVariantChoice(product);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const stockState = vc.stock ?? product.stockState;
  const soldOut = stockState === "out_of_stock";
  const needsChoice = !vc.choice;
  const favourite = favourites.has(product.id);
  const catSlug = categoryName ? slugify(categoryName) : null;
  const specs = allSpecs(product);
  const prose = product.content?.blocks.filter((b) => b.type !== "specs" && b.body) ?? [];
  const showWholesale = product.wholesalePriceCents != null && (product.wholesaleMinQuantity ?? 0) > 1;
  const compareCents = vc.compareCents;
  const save = compareCents && compareCents > vc.priceCents ? compareCents - vc.priceCents : null;

  function handleAdd() {
    if (!vc.choice) return;
    addToCart(product, qty, vc.choice);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  }

  function buyNow() {
    if (!vc.choice) return;
    addToCart(product, qty, vc.choice);
    router.push("/checkout");
  }

  return (
    <Container className="pt-5 lg:pt-6">
      <Breadcrumbs
        trail={[
          { label: "Home", href: "/" },
          ...(categoryName && catSlug ? [{ label: categoryName, href: `/products/${catSlug}` }] : [{ label: "Products", href: "/products" }]),
          { label: product.name },
        ]}
      />

      {/* ── main: gallery + buy box ───────────────────────────────────────── */}
      <section className="mt-4 grid gap-6 rounded-2xl border border-line bg-surface p-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:p-8">
        <Gallery product={product} />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium">
            {product.brand ? (
              <Link href={`/products?brand=${encodeURIComponent(product.brand)}`} className="text-ink hover:text-primary-ink">
                <span className="text-ink-muted">Brand:</span> {product.brand}
              </Link>
            ) : null}
            {catSlug ? (
              <Link href={`/products/${catSlug}`} className="text-primary-ink hover:underline">
                {categoryName}
              </Link>
            ) : null}
          </div>
          <h1 className="mt-1 font-display text-[22px] font-bold leading-snug text-ink lg:text-[28px]">{product.name}</h1>
          <div className="mt-2">
            <Stars rating={product.rating} reviews={product.reviews} />
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {vc.isFromPrice ? <span className="text-[15px] font-medium text-ink-muted">From</span> : null}
            <span className={`font-display text-[30px] font-bold leading-none lg:text-[34px] ${soldOut ? "text-ink-faint" : "text-primary-ink"}`}>
              {fmt(vc.priceCents)}
            </span>
            {save ? <span className="text-[16px] text-ink-faint line-through">{fmt(compareCents as number)}</span> : null}
            {product.unitOfMeasure ? <span className="text-[13px] text-ink-muted">/ {product.unitOfMeasure}</span> : null}
          </div>
          {save ? <p className="mt-1.5 text-[13px] font-semibold text-success">You save {fmt(save)}</p> : null}

          <div className="mt-4">
            <StockPill product={{ ...product, stockState }} />
          </div>

          {showWholesale ? (
            <div className="mt-4 rounded-lg border border-accent/50 bg-accent-soft px-4 py-3">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-accent-ink">Bulk price</p>
              <p className="mt-0.5 text-[14px] font-semibold text-ink">
                Buy {product.wholesaleMinQuantity}+ at {fmt(product.wholesalePriceCents as number)} each
              </p>
            </div>
          ) : null}

          {product.description ? (
            <p className="mt-5 text-[15px] leading-relaxed whitespace-pre-line text-ink-muted">{product.description}</p>
          ) : null}

          {product.content && product.content.quickSpecs.length > 0 ? (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {product.content.quickSpecs.slice(0, 8).map((s, i) => (
                <li key={i} className="flex gap-2 text-[14px] leading-snug text-ink">
                  <FiCheck size={16} className="mt-0.5 flex-none text-success" />
                  {s}
                </li>
              ))}
            </ul>
          ) : null}

          <VariantChips vc={vc} />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!soldOut ? <QtyStepper qty={qty} onChange={(q) => setQty(Math.max(1, q))} /> : null}
            <button
              type="button"
              onClick={handleAdd}
              disabled={soldOut || needsChoice}
              aria-live="polite"
              className={`h-12 min-w-[180px] flex-1 rounded-lg font-display text-[15px] font-semibold transition-colors ${
                soldOut || needsChoice
                  ? "cursor-not-allowed bg-surface-alt text-ink-faint"
                  : added
                    ? "bg-success text-white"
                    : "bg-primary text-on-primary hover:bg-primary-hover"
              }`}
            >
              {soldOut ? "Out of stock" : needsChoice ? (vc.prompt ?? "Choose an option") : added ? "Added to cart ✓" : "Add to Cart"}
            </button>
          </div>
          <div className="mt-3 flex gap-3">
            {!soldOut && !needsChoice ? (
              <button
                type="button"
                onClick={buyNow}
                className="h-12 flex-1 rounded-lg border-2 border-primary font-display text-[15px] font-semibold text-primary-ink transition-colors hover:bg-primary-soft"
              >
                Buy Now
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => toggleFavourite(product.id)}
              aria-pressed={favourite}
              aria-label={favourite ? "Remove from saved items" : "Save for later"}
              className={`grid size-12 flex-none place-items-center rounded-lg border-2 transition-colors ${
                favourite ? "border-primary text-primary-ink" : "border-line-strong text-ink-muted hover:text-primary-ink"
              }`}
            >
              {favourite ? <FaHeart size={18} /> : <FiHeart size={18} />}
            </button>
          </div>
          <WhatsAppButton
            className="mt-3"
            label={soldOut ? "Ask about it on WhatsApp" : "Order on WhatsApp"}
            message={(origin) =>
              productOrderMessage({
                name: product.name,
                options: vc.selected,
                qty: soldOut ? undefined : qty,
                price: `${vc.isFromPrice ? "From " : ""}${fmt(vc.priceCents)}`,
                url: origin ? `${origin}/product/${encodeURIComponent(product.id)}` : undefined,
              })
            }
          />

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-line pt-5 text-center">
            {[
              { icon: <FiShield size={20} />, label: "Genuine products" },
              { icon: <FiTruck size={20} />, label: "Fast delivery" },
              { icon: <FiShoppingBag size={20} />, label: "Pick up or delivery" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 text-[12px] font-medium text-ink-muted">
                <span className="text-primary-ink">{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── specs + why buy ─────────────────────────────────────────────── */}
      {specs.length > 0 || prose.length > 0 ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-2xl border border-line bg-surface p-5 lg:p-7">
            {specs.length > 0 ? (
              <>
                <h2 className="font-display text-[18px] font-bold text-ink lg:text-[20px]">Key Specifications</h2>
                <dl className="mt-4 overflow-hidden rounded-lg border border-line">
                  {specs.map((s, i) => {
                    const parts = splitSpec(s);
                    return (
                      <div key={i} className={`grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-2.5 text-[14px] ${i % 2 ? "bg-surface" : "bg-surface-alt"}`}>
                        {parts.length === 2 ? (
                          <>
                            <dt className="text-ink-muted">{parts[0]}</dt>
                            <dd className="font-medium text-ink">{parts[1]}</dd>
                          </>
                        ) : (
                          <dd className="col-span-2 text-ink">{parts[0]}</dd>
                        )}
                      </div>
                    );
                  })}
                </dl>
              </>
            ) : null}

            {prose.map((b, i) => (
              <article key={i} className={specs.length > 0 || i > 0 ? "mt-7" : ""}>
                {b.heading ? <h2 className="font-display text-[18px] font-bold text-ink">{b.heading}</h2> : null}
                <p
                  className={`${b.heading ? "mt-2" : ""} text-[15px] leading-relaxed whitespace-pre-line ${
                    b.type === "notes" ? "text-ink-faint italic" : "text-ink-muted"
                  }`}
                >
                  {b.body}
                </p>
              </article>
            ))}
          </div>

          <WhyBuy storeName={storeName} />
        </section>
      ) : (
        <div className="mt-6 lg:max-w-[340px]">
          <WhyBuy storeName={storeName} />
        </div>
      )}

      {/* ── related ─────────────────────────────────────────────────────── */}
      {related.length > 0 ? (
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="font-display text-[20px] font-bold text-ink lg:text-[24px]">Related Products</h2>
            {catSlug ? (
              <Link href={`/products/${catSlug}`} className="text-[14px] font-semibold text-primary-ink hover:underline">
                View All
              </Link>
            ) : null}
          </div>
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0">
            {related.slice(0, 10).map((p) => (
              <div key={p.id} className="w-[46%] flex-none snap-start sm:w-[31%] lg:w-auto">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}

function WhyBuy({ storeName }: { storeName?: string }) {
  const points = [
    { icon: <FiCheckCircle size={18} />, text: "100% genuine products" },
    { icon: <FiCheckCircle size={18} />, text: "Competitive prices" },
    { icon: <FiHeadphones size={18} />, text: "Dedicated customer support" },
    { icon: <FiShoppingBag size={18} />, text: "Pick up in shop or get it delivered" },
  ];
  return (
    <aside className="h-fit rounded-2xl border border-primary/25 bg-primary-soft p-5 lg:p-6">
      <h2 className="font-display text-[17px] font-bold text-ink">Why buy from {storeName || "us"}?</h2>
      <ul className="mt-4 flex flex-col gap-3">
        {points.map((p) => (
          <li key={p.text} className="flex items-center gap-2.5 text-[14px] text-ink">
            <span className="text-primary-ink">{p.icon}</span>
            {p.text}
          </li>
        ))}
      </ul>
    </aside>
  );
}
