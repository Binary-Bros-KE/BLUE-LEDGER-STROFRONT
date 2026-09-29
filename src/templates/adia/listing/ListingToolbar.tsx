"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiSliders, FiX } from "@/components/shared/icons";
import { listingHref, SORT_OPTIONS, type CatalogSort, type ListingFilters } from "@/lib/listing-filters";
import type { Category } from "@/lib/products";
import { useOverlay } from "@/lib/use-overlay";
import { FilterPanel } from "./FilterPanel";

export function SortSelect({ filters, basePath }: { filters: ListingFilters; basePath: string }) {
  const router = useRouter();
  return (
    <label className="relative flex items-center gap-2 text-[13px] text-ink-muted">
      <span className="hidden sm:inline">Sort by:</span>
      <span className="relative">
        <select
          value={filters.sort}
          onChange={(e) => router.push(listingHref(basePath, { ...filters, sort: e.target.value as CatalogSort }))}
          aria-label="Sort products"
          className="h-10 cursor-pointer appearance-none rounded-lg border border-line-strong bg-surface pr-9 pl-3 text-[14px] font-medium text-ink outline-none focus:border-primary"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <FiChevronDown size={15} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted" />
      </span>
    </label>
  );
}

/** Phones/tablets: a "Filters" button that opens the same panel as a bottom sheet. */
export function MobileFilters(props: {
  categories: Category[];
  activeCategorySlug?: string;
  filters: ListingFilters;
  priceRange: { minCents: number; maxCents: number } | null;
  brandFacets?: { name: string; count: number }[];
  basePath: string;
}) {
  const [open, setOpen] = useState(false);
  useOverlay(open, () => setOpen(false));
  const count =
    (props.filters.minPrice !== undefined || props.filters.maxPrice !== undefined ? 1 : 0) +
    (props.activeCategorySlug ? 1 : 0) +
    (props.filters.brand ? 1 : 0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 items-center gap-2 rounded-lg border border-line-strong bg-surface px-3.5 text-[14px] font-medium text-ink lg:hidden"
      >
        <FiSliders size={16} /> Filters
        {count ? (
          <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-on-primary">{count}</span>
        ) : null}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" aria-label="Close filters" onClick={() => setOpen(false)} className="animate-overlay absolute inset-0 bg-black/50" />
          <div className="animate-sheet absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface p-5 pb-8 shadow-2xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-strong" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-surface-alt text-ink"
            >
              <FiX size={17} />
            </button>
            <FilterPanel {...props} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
