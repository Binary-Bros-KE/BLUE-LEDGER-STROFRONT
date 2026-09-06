import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Placeholder } from "@/components/shared/Placeholder";
import { SectionHead } from "@/components/shared/SectionHead";
import { FiArrowRight } from "@/components/shared/icons";
import { slugify } from "@/lib/slug";
import type { Category } from "@/lib/products";

// Spec §4 — white, 56px 40px. 5 columns, 18px gap. One inverted navy tile. Mobile: 2 columns,
// no thumbs (padded name/count rows), navy tile kept.
// `images` (web_stores.themeJson.categoryImages, keyed by category id) replaces the hatch
// placeholder on a tile when set.
export function CategoryGrid({
  categories,
  images = {},
}: {
  categories: Category[];
  images?: Record<string, string>;
}) {
  if (categories.length === 0) return null;
  const shown = categories.slice(0, 5);

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

        <div className="mt-9 grid grid-cols-2 gap-[18px] md:grid-cols-3 lg:grid-cols-5">
          {shown.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${slugify(cat.name)}`}
              className={`flex flex-col border transition-colors ${
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
                  className="hidden h-[118px] w-full object-cover md:block"
                />
              ) : (
                <Placeholder
                  caption={cat.caption}
                  dark={cat.inverted}
                  className="hidden h-[118px] md:flex"
                />
              )}
              <div className="flex items-center justify-between gap-2 p-3.5">
                <span className={`font-sans text-[15px] font-extrabold ${cat.inverted ? "text-white" : "text-navy"}`}>
                  {cat.name}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[1.2px] ${
                    cat.inverted ? "text-amber" : "text-slate"
                  }`}
                >
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
