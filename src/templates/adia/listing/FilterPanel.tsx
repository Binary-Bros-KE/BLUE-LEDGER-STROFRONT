"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMoney } from "@/lib/currency";
import { listingHref, type ListingFilters } from "@/lib/listing-filters";
import type { Category } from "@/lib/products";
import { slugify } from "@/lib/slug";

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-3 font-display text-[14px] font-semibold text-ink">{title}</h3>
      {children}
    </section>
  );
}

/** A "nice" slider step: ~100 stops across the range, rounded to 1/2/5 × 10ⁿ. */
function niceStep(span: number): number {
  const raw = Math.max(1, span / 100);
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

/** Dual-handle price range (two overlaid native range inputs) + exact min/max fields + Apply. */
function PriceFilter({
  bounds,
  filters,
  basePath,
  onApplied,
}: {
  bounds: { min: number; max: number };
  filters: ListingFilters;
  basePath: string;
  onApplied?: () => void;
}) {
  const router = useRouter();
  const fmt = useMoney();
  const step = niceStep(bounds.max - bounds.min);
  const lo = Math.floor(bounds.min / step) * step;
  const hi = Math.ceil(bounds.max / step) * step;

  // Raw strings, exactly as typed — never re-derived from numbers while the shopper is typing.
  const [minText, setMinText] = useState(String(filters.minPrice ?? lo));
  const [maxText, setMaxText] = useState(String(filters.maxPrice ?? hi));
  const minNum = Number(minText) || 0;
  const maxNum = Number(maxText) || 0;

  function apply() {
    const min = Math.max(0, Math.floor(Math.min(minNum, maxNum)));
    const max = Math.floor(Math.max(minNum, maxNum));
    router.push(
      listingHref(basePath, {
        sort: filters.sort,
        // the full range is "no price filter" — keep URLs clean
        minPrice: min > lo ? min : undefined,
        maxPrice: max < hi ? max : undefined,
      }),
    );
    onApplied?.();
  }

  const pct = (v: number) => ((Math.min(Math.max(v, lo), hi) - lo) / (hi - lo || 1)) * 100;
  const thumb =
    "pointer-events-none absolute inset-x-0 top-0 h-5 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow";

  return (
    <div>
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-2 h-1 rounded-full bg-line" />
        <div
          className="absolute top-2 h-1 rounded-full bg-primary"
          style={{ left: `${pct(Math.min(minNum, maxNum))}%`, right: `${100 - pct(Math.max(minNum, maxNum))}%` }}
        />
        <input
          type="range"
          min={lo}
          max={hi}
          step={step}
          value={Math.min(Math.max(minNum, lo), hi)}
          onChange={(e) => setMinText(String(Math.min(Number(e.target.value), maxNum)))}
          aria-label="Minimum price"
          className={thumb}
        />
        <input
          type="range"
          min={lo}
          max={hi}
          step={step}
          value={Math.min(Math.max(maxNum, lo), hi)}
          onChange={(e) => setMaxText(String(Math.max(Number(e.target.value), minNum)))}
          aria-label="Maximum price"
          className={thumb}
        />
      </div>
      <div className="mt-1 flex justify-between text-[12px] text-ink-faint">
        <span>{fmt(lo * 100)}</span>
        <span>{fmt(hi * 100)}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          inputMode="numeric"
          onFocus={(e) => e.target.select()}
          value={minText}
          onChange={(e) => setMinText(e.target.value.replace(/[^\d]/g, ""))}
          aria-label="Minimum price"
          className="h-10 w-full min-w-0 rounded-lg border border-line-strong bg-surface px-3 text-[14px] text-ink outline-none focus:border-primary"
        />
        <span className="text-ink-faint">–</span>
        <input
          inputMode="numeric"
          onFocus={(e) => e.target.select()}
          value={maxText}
          onChange={(e) => setMaxText(e.target.value.replace(/[^\d]/g, ""))}
          aria-label="Maximum price"
          className="h-10 w-full min-w-0 rounded-lg border border-line-strong bg-surface px-3 text-[14px] text-ink outline-none focus:border-primary"
        />
      </div>
      <button
        type="button"
        onClick={apply}
        className="mt-3 h-10 w-full rounded-lg bg-primary font-display text-[14px] font-semibold text-on-primary transition-colors hover:bg-primary-hover"
      >
        Apply price
      </button>
    </div>
  );
}

/**
 * Filters: Category (navigates — each category is its own URL, keeping the sort) and Price
 * (range + exact values). "Clear all" drops sort + price but keeps a search query.
 */
export function FilterPanel({
  categories,
  activeCategorySlug,
  filters,
  priceRange,
  basePath,
  onNavigate,
}: {
  categories: Category[];
  activeCategorySlug?: string;
  filters: ListingFilters;
  priceRange: { minCents: number; maxCents: number } | null;
  basePath: string;
  /** mobile sheet: close after a navigation */
  onNavigate?: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? categories : categories.slice(0, 8);
  const bounds = priceRange
    ? { min: Math.floor(priceRange.minCents / 100), max: Math.ceil(priceRange.maxCents / 100) }
    : null;
  const filtered = filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.sort !== "featured";

  const row = (active: boolean) =>
    `flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[14px] transition-colors ${
      active ? "bg-primary-soft font-semibold text-primary-ink" : "text-ink hover:bg-surface-alt"
    }`;
  const dot = (active: boolean) =>
    `grid size-4 flex-none place-items-center rounded-full border ${active ? "border-primary" : "border-line-strong"}`;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-[17px] font-bold text-ink">Filters</h2>
        {filtered ? (
          <Link
            href={listingHref(basePath, {})}
            onClick={onNavigate}
            className="text-[13px] font-semibold text-primary-ink hover:underline"
          >
            Clear all
          </Link>
        ) : null}
      </div>

      {categories.length > 0 ? (
        <Group title="Category">
          <ul className="flex flex-col gap-0.5">
            <li>
              <Link href={listingHref("/products", { sort: filters.sort })} onClick={onNavigate} className={row(!activeCategorySlug)}>
                <span className="flex items-center gap-2.5">
                  <span className={dot(!activeCategorySlug)}>
                    {!activeCategorySlug ? <span className="size-2 rounded-full bg-primary" /> : null}
                  </span>
                  All products
                </span>
              </Link>
            </li>
            {shown.map((c) => {
              const slug = slugify(c.name);
              const active = slug === activeCategorySlug;
              return (
                <li key={c.id}>
                  <Link href={listingHref(`/products/${slug}`, { sort: filters.sort })} onClick={onNavigate} className={row(active)}>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className={dot(active)}>{active ? <span className="size-2 rounded-full bg-primary" /> : null}</span>
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="flex-none text-[12px] text-ink-faint">({c.count})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {categories.length > 8 ? (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-2 px-2 text-[13px] font-semibold text-primary-ink hover:underline"
            >
              {showAll ? "Show less" : `Show ${categories.length - 8} more`}
            </button>
          ) : null}
        </Group>
      ) : null}

      {bounds && bounds.max > bounds.min ? (
        <Group title="Price Range">
          {/* keyed on the URL values so Back/Forward re-seeds the fields */}
          <PriceFilter
            key={`${filters.minPrice ?? ""}-${filters.maxPrice ?? ""}-${bounds.min}-${bounds.max}`}
            bounds={bounds}
            filters={filters}
            basePath={basePath}
            onApplied={onNavigate}
          />
        </Group>
      ) : null}
    </div>
  );
}
