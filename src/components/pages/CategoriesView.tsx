import Link from "next/link";
import { CategoryTile } from "@/components/home/CategoryTile";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Container } from "@/components/shared/Container";
import { SectionHead } from "@/components/shared/SectionHead";
import { FiArrowRight } from "@/components/shared/icons";
import { slugify } from "@/lib/slug";
import type { CategoriesProps } from "@/templates/types";

const units = (n: number) => `${n.toLocaleString("en-KE")} ${n === 1 ? "product" : "products"}`;

/** Classic category landing page (/categories — the home page's "All N categories" link): the same
 * header band as the product listing, a tile for every category (biggest first), then a
 * "Popular in …" product row per category. */
export function CategoriesView({ categories, categoryImages, rows, heroImage, storeName }: CategoriesProps) {
  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <>
      {/* header band — plain cream, or the theme's default header image with a navy scrim */}
      <div className={`relative isolate overflow-hidden border-b border-line ${heroImage ? "bg-navy" : "bg-cream"}`}>
        {heroImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-navy/68" />
          </>
        ) : null}
        <Container className={`py-10 ${heroImage ? "text-white [&_a]:text-white/75 [&_a:hover]:text-white" : ""}`}>
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Categories" }]} onDark={Boolean(heroImage)} />
          <h1
            className={`mt-3 font-sans text-[28px] font-black leading-[1.05] tracking-[-1px] sm:text-[36px] lg:text-[44px] ${
              heroImage ? "text-white" : "text-navy"
            }`}
          >
            All categories
          </h1>
          <p className={`mt-2 font-mono text-[11px] uppercase tracking-[1.4px] ${heroImage ? "text-white/70" : "text-slate"}`}>
            {storeName} · {categories.length} {categories.length === 1 ? "category" : "categories"} · {units(total)}
          </p>
        </Container>
      </div>

      <section className="bg-white py-10 lg:py-12">
        <Container>
          {categories.length === 0 ? (
            <p className="py-10 text-center font-mono text-[12px] text-slate">
              No categories yet —{" "}
              <Link href="/products" className="font-bold text-blue underline">
                browse all products
              </Link>
              .
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-[18px] xl:grid-cols-6">
              {categories.map((c) => (
                <CategoryTile key={c.id} category={c} image={categoryImages[c.id]} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {rows.map(({ category, products }, i) => {
        const href = `/products/${slugify(category.name)}`;
        return (
          <section key={category.id} className={i % 2 === 0 ? "bg-cream py-12" : "bg-white py-12"}>
            <Container>
              <SectionHead
                index={String(i + 1).padStart(2, "0")}
                eyebrow={units(category.count)}
                title={`Popular in ${category.name}`}
                right={
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 border-b-[1.5px] border-blue pb-0.5 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-blue"
                  >
                    View all <FiArrowRight size={13} />
                  </Link>
                }
              />
              <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-5 xl:grid-cols-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </Container>
          </section>
        );
      })}

      <div className="flex justify-center border-t border-line bg-white py-12">
        <Link
          href="/products"
          className="border-[1.5px] border-navy px-7 py-3 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-navy transition-colors hover:bg-navy hover:text-white"
        >
          Browse all products
        </Link>
      </div>
    </>
  );
}
