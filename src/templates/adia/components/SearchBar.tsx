"use client";

import Link from "next/link";
import { FiGrid, FiSearch, FiX } from "@/components/shared/icons";
import { useMoney } from "@/lib/currency";
import { useProductSearch } from "@/lib/use-product-search";

/** Rounded search field with a primary button and a live-suggestions dropdown. */
export function SearchBar({ autoFocus = false, placeholder }: { autoFocus?: boolean; placeholder?: string }) {
  const fmt = useMoney();
  const s = useProductSearch();

  return (
    <div ref={s.rootRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          s.goFullResults();
        }}
        className="flex h-11 overflow-hidden rounded-lg border border-line-strong bg-surface transition-colors focus-within:border-primary"
      >
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          value={s.q}
          onChange={(e) => s.setQ(e.target.value)}
          onFocus={() => s.setOpen(true)}
          onKeyDown={s.onKeyDown}
          type="text"
          placeholder={placeholder ?? "Search for products, brands and more…"}
          aria-label="Search products"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-4 text-[14px] text-ink outline-none placeholder:text-ink-faint"
        />
        {s.q ? (
          <button
            type="button"
            onClick={s.clear}
            aria-label="Clear search"
            className="grid w-9 flex-none place-items-center text-ink-faint transition-colors hover:text-ink"
          >
            <FiX size={15} />
          </button>
        ) : null}
        <button
          type="submit"
          aria-label="Search"
          className="grid w-12 flex-none place-items-center bg-primary text-on-primary transition-colors hover:bg-primary-hover"
        >
          <FiSearch size={18} />
        </button>
      </form>

      {s.showPanel ? (
        <div className="absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-line bg-surface py-2 shadow-xl">
          {s.loading && !s.results ? <p className="px-4 py-3 text-[13px] text-ink-muted">Searching…</p> : null}

          {s.results && !s.hasResults && !s.loading ? (
            <p className="px-4 py-3 text-[13px] text-ink-muted">No matches for &ldquo;{s.results.query}&rdquo;</p>
          ) : null}

          {s.results && s.results.categories.length > 0 ? (
            <div className="pb-1">
              <p className="px-4 pt-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                Categories
              </p>
              {s.results.categories.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/products/${c.slug}`}
                  onClick={s.close}
                  className={`flex items-center gap-3 px-4 py-2 ${
                    s.activeIndex === i ? "bg-surface-alt" : "hover:bg-surface-alt"
                  }`}
                >
                  <span className="grid size-8 flex-none place-items-center rounded-lg bg-primary-soft text-primary-ink">
                    <FiGrid size={14} />
                  </span>
                  <span className="flex-1 truncate text-[14px] font-medium text-ink">{c.name}</span>
                  <span className="flex-none text-[12px] text-ink-faint">{c.count} items</span>
                </Link>
              ))}
            </div>
          ) : null}

          {s.results && s.results.products.length > 0 ? (
            <div className="border-t border-line pt-1">
              <p className="px-4 pt-1.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                Products
              </p>
              {s.results.products.map((p, i) => {
                const idx = (s.results?.categories.length ?? 0) + i;
                return (
                  <Link
                    key={p.id}
                    href={`/product/${encodeURIComponent(p.id)}`}
                    onClick={s.close}
                    className={`flex items-center gap-3 px-4 py-2 ${
                      s.activeIndex === idx ? "bg-surface-alt" : "hover:bg-surface-alt"
                    }`}
                  >
                    <span className="size-11 flex-none overflow-hidden rounded-lg border border-line bg-surface">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt="" className="size-full object-contain p-0.5" />
                      ) : null}
                    </span>
                    <span className="line-clamp-2 min-w-0 flex-1 text-[13px] font-medium leading-snug text-ink">
                      {p.name}
                    </span>
                    <span className="flex-none font-display text-[13px] font-bold text-primary-ink">
                      {fmt(p.priceCents)}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : null}

          {s.hasResults ? (
            <button
              type="button"
              onClick={s.goFullResults}
              className="mt-1 flex w-full items-center justify-between border-t border-line px-4 pt-2.5 pb-1 text-[13px] font-semibold text-primary-ink hover:underline"
            >
              See all results for &ldquo;{s.q.trim()}&rdquo; <FiSearch size={14} />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
