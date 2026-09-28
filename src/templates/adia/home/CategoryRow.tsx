import Link from "next/link";
import type { Category } from "@/lib/products";
import { slugify } from "@/lib/slug";
import { Container } from "../components/Container";
import { SectionHeader } from "./SectionHeader";

/** "Shop by Category" — swipeable row on phones, a 6-up grid on desktop. Images come from the
 * shop's category images (themeJson.categoryImages); a category without one shows its initial. */
export function CategoryRow({ categories, images }: { categories: Category[]; images: Record<string, string> }) {
  if (categories.length === 0) return null;

  return (
    <Container className="mt-10 lg:mt-12">
      <SectionHeader title="Shop by Category" href="/products" />
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-0">
        {categories.slice(0, 12).map((c) => (
          <Link
            key={c.id}
            href={`/products/${slugify(c.name)}`}
            className="group flex w-[40%] flex-none snap-start flex-col rounded-xl border border-line bg-surface p-2.5 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:w-[28%] lg:w-auto"
          >
            <span className="grid aspect-[4/3] place-items-center overflow-hidden rounded-lg bg-surface-alt">
              {images[c.id] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[c.id]}
                  alt=""
                  loading="lazy"
                  className="size-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="grid size-14 place-items-center rounded-full bg-primary-soft font-display text-[22px] font-bold text-primary-ink">
                  {c.name.charAt(0).toUpperCase()}
                </span>
              )}
            </span>
            <span className="mt-2.5 line-clamp-2 px-0.5 text-[13px] font-semibold leading-snug text-ink lg:text-[14px]">
              {c.name}
            </span>
            <span className="px-0.5 text-[12px] text-ink-muted">
              {c.count} {c.count === 1 ? "product" : "products"}
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
