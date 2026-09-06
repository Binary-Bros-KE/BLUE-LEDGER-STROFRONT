import Link from "next/link";
import { Carousel } from "@/components/shared/Carousel";
import { Container } from "@/components/shared/Container";
import { Placeholder } from "@/components/shared/Placeholder";
import { SectionHead } from "@/components/shared/SectionHead";
import { FiArrowRight } from "@/components/shared/icons";
import { slugify } from "@/lib/slug";
import type { Category } from "@/lib/products";

// Browse-by-category — a horizontal carousel (2 tiles per slide on phones, up to 4 on desktop).
// Every tile has an image on every breakpoint. `images` (themeJson.categoryImages, keyed by id)
// replaces the hatch placeholder when set.
export function CategoryGrid({
  categories,
  images = {},
}: {
  categories: Category[];
  images?: Record<string, string>;
}) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-white py-14">
      <Container>
        <SectionHead
          index="01"
          eyebrow="Browse by category"
          title="Start where the work is."
          right={
            <Link
              href="/products"
              className="flex items-center gap-1 border-b-[1.5px] border-blue pb-0.5 font-mono text-[11px] uppercase tracking-[1.6px] text-blue"
            >
              All {categories.length} categories <FiArrowRight size={13} />
            </Link>
          }
        />

        <div className="mt-9">
          <Carousel perView="2-3-4" ariaLabel="Product categories">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${slugify(cat.name)}`}
                className={`flex h-full flex-col border transition-colors ${
                  cat.inverted
                    ? "border-navy bg-navy hover:border-navy"
                    : "border-line bg-white hover:border-navy"
                }`}
              >
                {images[cat.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={images[cat.id]}
                    alt=""
                    className="ph-light h-[96px] w-full object-cover sm:h-[118px]"
                  />
                ) : (
                  <Placeholder
                    caption={cat.caption}
                    dark={cat.inverted}
                    className="h-[96px] w-full sm:h-[118px]"
                  />
                )}
                <div className="flex flex-1 items-center justify-between gap-2 p-3.5">
                  <span
                    className={`font-sans text-[13px] font-extrabold leading-tight sm:text-[15px] ${
                      cat.inverted ? "text-white" : "text-navy"
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span
                    className={`flex-none font-mono text-[10px] uppercase tracking-[1.2px] ${
                      cat.inverted ? "text-amber" : "text-slate"
                    }`}
                  >
                    {cat.count}
                  </span>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </Container>
    </section>
  );
}
