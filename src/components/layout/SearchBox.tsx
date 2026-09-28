"use client";

import Link from "next/link";
import { FiChevronDown, FiGrid, FiSearch, FiX } from "@/components/shared/icons";
import { useMoney } from "@/lib/currency";
import { useProductSearch } from "@/lib/use-product-search";

export function SearchBox({
  variant = "bar",
  autoFocus = false,
}: {
  variant?: "bar" | "compact";
  autoFocus?: boolean;
}) {
  const fmt = useMoney();
  const { q, setQ, clear, setOpen, loading, results, activeIndex, rootRef, onKeyDown, goFullResults, hasResults, showPanel } =
    useProductSearch();
  const submitW = variant === "bar" ? "w-[52px]" : "w-11";

  return (
    <div ref={rootRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          goFullResults();
        }}
        className="flex h-11 border-[1.5px] border-navy"
      >
        {variant === "bar" && (
          <span className="hidden w-[120px] flex-none items-center justify-between gap-1 border-r-[1.5px] border-navy px-4 font-mono text-[11px] uppercase tracking-[1.2px] text-slate xl:flex">
            All <FiChevronDown size={12} />
          </span>
        )}
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          type="text"
          placeholder={variant === "bar" ? 'Search products — "thermal printer"' : "Search products…"}
          aria-label="Search products"
          autoComplete="off"
          className="min-w-0 flex-1 bg-white px-3 font-mono text-[13px] text-navy outline-none placeholder:text-slate"
        />
        {q && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="grid w-9 flex-none place-items-center text-slate transition-colors hover:text-navy"
          >
            <FiX size={14} />
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className={`grid ${submitW} flex-none place-items-center bg-navy text-amber`}
        >
          <FiSearch size={variant === "bar" ? 18 : 16} />
        </button>
      </form>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-50 max-h-[72vh] overflow-y-auto border-[1.5px] border-t-0 border-navy bg-white">
          {loading && !results && (
            <div className="px-4 py-3 font-mono text-[11px] uppercase tracking-[1.2px] text-slate">Searching…</div>
          )}

          {results && !hasResults && !loading && (
            <div className="px-4 py-4 font-mono text-[11px] uppercase tracking-[1.2px] text-slate">
              No matches for &ldquo;{results.query}&rdquo;
            </div>
          )}

          {results && results.categories.length > 0 && (
            <div>
              <div className="border-b border-line bg-cream px-4 py-2 font-mono text-[10px] uppercase tracking-[1.6px] text-slate">
                Categories
              </div>
              {results.categories.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/products/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 ${activeIndex === i ? "bg-cream" : "hover:bg-cream"}`}
                >
                  <span className="grid size-8 flex-none place-items-center bg-navy text-amber">
                    <FiGrid size={14} />
                  </span>
                  <span className="flex-1 truncate font-sans text-[13px] font-bold text-navy">{c.name}</span>
                  <span className="flex-none font-mono text-[10px] uppercase tracking-[1.2px] text-slate">
                    Category · {c.count}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {results && results.categories.length > 0 && results.products.length > 0 && (
            <div className="h-[2px] bg-navy" aria-hidden="true" />
          )}

          {results && results.products.length > 0 && (
            <div>
              <div className="border-y border-line bg-cream px-4 py-2 font-mono text-[10px] uppercase tracking-[1.6px] text-slate">
                Products
              </div>
              {results.products.map((p, i) => {
                const idx = results.categories.length + i;
                return (
                  <Link
                    key={p.id}
                    href={`/product/${encodeURIComponent(p.id)}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 ${activeIndex === idx ? "bg-cream" : "hover:bg-cream"}`}
                  >
                    <span className="size-10 flex-none border border-line">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt="" className="ph-light size-full object-cover" />
                      ) : (
                        <span className="ph-light flex size-full items-center justify-center font-mono text-[7px] uppercase text-slate">
                          IMG
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-sans text-[13px] font-bold text-navy">{p.name}</span>
                      <span className="block truncate font-mono text-[9px] uppercase tracking-[1.2px] text-slate">
                        {p.category}
                      </span>
                    </span>
                    <span className="flex-none font-sans text-[13px] font-black text-navy">{fmt(p.priceCents)}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {hasResults && (
            <button
              type="button"
              onClick={goFullResults}
              className="flex w-full items-center justify-between border-t border-line bg-white px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-blue transition-colors hover:bg-cream"
            >
              See all results for &ldquo;{q.trim()}&rdquo; <FiSearch size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
