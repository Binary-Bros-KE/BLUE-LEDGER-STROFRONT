import Link from "next/link";
import { Carousel } from "@/components/shared/Carousel";
import { Container } from "@/components/shared/Container";
import { SectionHead } from "@/components/shared/SectionHead";
import { FiArrowRight } from "@/components/shared/icons";
import type { Category } from "@/lib/products";
import { CategoryTile } from "./CategoryTile";

// Browse-by-category — a horizontal carousel (2 tiles per slide on phones, 5 on laptops, 6 on wide
// screens) — sized so a two-word name like "Best Sellers" plus its count fits on one line.
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
    // almost no bottom padding: the next section's own top padding is the gap (client request —
    // the categories → first product row gap was twice what it should be)
    <section className="bg-white pb-1 pt-14 lg:pb-0">
      <Container>
        <SectionHead
          index="01"
          eyebrow="Browse by category"
          title="Start where the work is."
          right={
            <Link
              href="/categories"
              className="flex items-center gap-1 border-b-[1.5px] border-blue pb-0.5 font-mono text-[11px] uppercase tracking-[1.6px] text-blue"
            >
              All {categories.length} categories <FiArrowRight size={13} />
            </Link>
          }
        />

        <div className="mt-9">
          <Carousel perView="2-3-5-6" ariaLabel="Product categories">
            {categories.map((cat) => (
              <CategoryTile key={cat.id} category={cat} image={images[cat.id]} />
            ))}
          </Carousel>
        </div>
      </Container>
    </section>
  );
}
