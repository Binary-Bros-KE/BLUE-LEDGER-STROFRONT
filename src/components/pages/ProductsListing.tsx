import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Container } from "@/components/shared/Container";
import { Pagination } from "@/components/shared/Pagination";
import { ProductCard } from "@/components/product/ProductCard";
import type { Category, Product } from "@/lib/products";
import { slugify } from "@/lib/slug";

export function ProductsListing({
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
}: {
  heading: string;
  trail: { label: string; href?: string }[];
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  basePath: string;
  categories: Category[];
  activeCategorySlug?: string;
  /** themeJson.categoryImages[categoryId] — a background image behind the header band. */
  heroImage?: string;
}) {
  return (
    <>
      {/* header band — plain cream, or a category background image with a navy scrim */}
      <div
        className={`relative isolate overflow-hidden border-b border-line ${heroImage ? "bg-navy" : "bg-cream"}`}
      >
        {heroImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-navy/68" />
          </>
        ) : null}
        <Container className={`py-10 ${heroImage ? "text-white [&_a]:text-white/75 [&_a:hover]:text-white" : ""}`}>
          <Breadcrumb trail={trail} />
          <h1
            className={`mt-3 font-sans text-[28px] font-black leading-[1.05] tracking-[-1px] sm:text-[36px] lg:text-[44px] ${
              heroImage ? "text-white" : "text-navy"
            }`}
          >
            {heading}
          </h1>
          <p
            className={`mt-2 font-mono text-[11px] uppercase tracking-[1.4px] ${
              heroImage ? "text-white/70" : "text-slate"
            }`}
          >
            {total} {total === 1 ? "product" : "products"}
          </p>
        </Container>
      </div>

      <section className="bg-white py-10">
        <Container>
          {/* category filter row */}
          {categories.length > 0 && (
            <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
              <Link
                href="/products"
                className={`flex-none px-3.5 py-[9px] font-mono text-[11px] uppercase tracking-[1.2px] ${
                  !activeCategorySlug ? "bg-navy text-white" : "border border-line text-navy hover:border-navy"
                }`}
              >
                All
              </Link>
              {categories.map((c) => {
                const slug = slugify(c.name);
                const active = slug === activeCategorySlug;
                return (
                  <Link
                    key={c.id}
                    href={`/products/${slug}`}
                    className={`flex-none whitespace-nowrap px-3.5 py-[9px] font-mono text-[11px] uppercase tracking-[1.2px] ${
                      active ? "bg-navy text-white" : "border border-line text-navy hover:border-navy"
                    }`}
                  >
                    {c.name} <span className={active ? "text-white/60" : "text-slate"}>{c.count}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {products.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 border border-dashed border-line text-center">
              <p className="font-sans text-[18px] font-black text-navy">Nothing here yet.</p>
              <p className="font-mono text-[11px] uppercase tracking-[1.2px] text-slate">
                Check back soon — or <Link href="/products" className="text-blue">browse everything</Link>.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <div className="mt-12">
                <Pagination page={page} totalPages={totalPages} basePath={basePath} />
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
