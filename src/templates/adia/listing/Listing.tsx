import Link from "next/link";
import { FiX } from "@/components/shared/icons";
import { listingHref } from "@/lib/listing-filters";
import type { ListingProps } from "../../types";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Container } from "../components/Container";
import { Pager } from "../components/Pager";
import { ProductCard } from "../components/ProductCard";
import { FilterPanel } from "./FilterPanel";
import { MobileFilters, SortSelect } from "./ListingToolbar";

/**
 * Adia product listing (all products, a category, or search results): breadcrumb + title + count,
 * filter sidebar (sheet on phones), sort, active-filter chips, 3-up grid, pager.
 */
export function Listing({
  heading,
  trail,
  products,
  total,
  page,
  totalPages,
  basePath,
  categories,
  activeCategorySlug,
  heroImage,
  filters = { sort: "featured" },
  priceRange = null,
}: ListingProps) {
  const panel = { categories, activeCategorySlug, filters, priceRange, basePath };
  const hasPrice = filters.minPrice !== undefined || filters.maxPrice !== undefined;
  const units = (n: number) => n.toLocaleString("en-KE");

  return (
    <Container className="pt-5 lg:pt-6">
      <Breadcrumbs trail={trail} />

      {heroImage ? (
        <div className="relative isolate mt-4 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="px-6 py-9 lg:px-10 lg:py-12">
            <h1 className="font-display text-[26px] font-bold leading-tight text-white lg:text-[34px]">{heading}</h1>
            <p className="mt-1 text-[14px] text-white/80">
              {total} {total === 1 ? "product" : "products"}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-[140px] rounded-xl border border-line bg-surface p-5">
            <FilterPanel {...panel} />
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {heroImage ? (
              <span className="text-[14px] text-ink-muted">
                Showing {products.length} of {total}
              </span>
            ) : (
              <h1 className="font-display text-[22px] font-bold text-ink lg:text-[26px]">
                {heading} <span className="text-[14px] font-medium text-ink-muted">({total} {total === 1 ? "product" : "products"})</span>
              </h1>
            )}
            <div className="flex items-center gap-2">
              <MobileFilters {...panel} />
              <SortSelect filters={filters} basePath={basePath} />
            </div>
          </div>

          {hasPrice ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={listingHref(basePath, { sort: filters.sort })}
                className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary-soft px-3 py-1 text-[13px] font-medium text-primary-ink"
              >
                Price: {filters.minPrice !== undefined ? units(filters.minPrice) : "0"} –{" "}
                {filters.maxPrice !== undefined ? units(filters.maxPrice) : "any"}
                <FiX size={13} aria-label="Remove price filter" />
              </Link>
            </div>
          ) : null}

          {products.length === 0 ? (
            <div className="mt-5 flex min-h-[260px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong bg-surface p-8 text-center">
              <p className="font-display text-[18px] font-semibold text-ink">No products found</p>
              <p className="text-[14px] text-ink-muted">
                {hasPrice ? "Try widening the price range, or " : "Check back soon, or "}
                <Link href="/products" className="font-semibold text-primary-ink hover:underline">
                  browse everything
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-5">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="mt-10">
                <Pager page={page} totalPages={totalPages} basePath={basePath} />
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
