import Link from "next/link";
import { FiArrowRight } from "@/components/shared/icons";
import type { Category } from "@/lib/products";
import { slugify } from "@/lib/slug";
import type { CategoriesProps } from "../../types";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Container } from "../components/Container";
import { ProductCard } from "../components/ProductCard";
import { SectionHead } from "../home/SectionHead";

const hrefOf = (c: Category) => `/products/${slugify(c.name)}`;
const units = (n: number) => `${n.toLocaleString("en-KE")} ${n === 1 ? "product" : "products"}`;

/**
 * Adia category landing page (/categories — the home "Top categories" View all): header band,
 * a photo tile for every category (biggest first), then a "Popular in …" row per category.
 */
export function Categories({ categories, categoryImages, rows, heroImage, storeName }: CategoriesProps) {
  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <Container className="pt-5 lg:pt-6">
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

      <div className="relative isolate mt-4 overflow-hidden rounded-2xl bg-[linear-gradient(120deg,var(--brand-primary-hover)_0%,var(--brand-primary)_100%)]">
        {heroImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </>
        ) : null}
        <div className="px-6 py-9 lg:px-10 lg:py-12">
          <h1 className="font-display text-[26px] font-bold leading-tight text-white lg:text-[34px]">Shop by category</h1>
          <p className="mt-1 max-w-xl text-[14px] text-white/85 lg:text-[15px]">
            Everything at {storeName}, in one place — {categories.length} {categories.length === 1 ? "category" : "categories"},{" "}
            {units(total)}.
          </p>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="mt-10 text-center text-[15px] text-ink-muted">
          No categories yet —{" "}
          <Link href="/products" className="font-semibold text-primary-ink hover:underline">
            browse all products
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-8 lg:grid-cols-4 lg:gap-5">
          {categories.map((c) => (
            <Tile key={c.id} category={c} image={categoryImages[c.id]} />
          ))}
        </div>
      )}

      {rows.map(({ category, products }) => (
        <section key={category.id} className="mt-12 lg:mt-16">
          <SectionHead title={`Popular in ${category.name}`} subtitle={units(category.count)} href={hrefOf(category)} cta="View all" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4 xl:grid-cols-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12 mb-4 flex justify-center lg:mt-16">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-[14px] font-semibold text-on-primary shadow-md transition-colors hover:bg-primary-hover"
        >
          Browse all products <FiArrowRight size={16} />
        </Link>
      </div>
    </Container>
  );
}

/** Photo tile (full-cover image, dark fade for the text) — warm textured backdrop + initial when the
 * category has no image, same look as the home "Top categories" tiles. */
function Tile({ category, image }: { category: Category; image?: string | undefined }) {
  return (
    <Link
      href={hrefOf(category)}
      className="group relative isolate block h-[150px] overflow-hidden rounded-2xl border border-line bg-[linear-gradient(135deg,#fbf6ef_0%,#f1e6d8_100%)] sm:h-[170px] lg:h-[200px]"
    >
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            loading="lazy"
            className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0)_100%)]" />
        </>
      ) : (
        <span aria-hidden="true" className="absolute -right-3 -top-6 -z-10 font-display text-[130px] font-extrabold leading-none text-primary/10 lg:text-[160px]">
          {category.name.charAt(0)}
        </span>
      )}
      <div className="flex h-full items-end justify-between gap-2 p-3 sm:p-4 lg:p-5">
        <div className="min-w-0">
          <h2 className={`line-clamp-2 font-display text-[14px] font-bold leading-snug [overflow-wrap:anywhere] sm:text-[15px] lg:text-[18px] ${image ? "text-white drop-shadow-sm" : "text-ink"}`}>
            {category.name}
          </h2>
          <p className={`mt-0.5 text-[12px] lg:text-[13px] ${image ? "text-white/85" : "text-ink-muted"}`}>{units(category.count)}</p>
        </div>
        <span className="grid size-8 flex-none place-items-center rounded-full bg-primary text-on-primary shadow-md transition-transform group-hover:translate-x-1 sm:size-9 lg:size-10">
          <FiArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
