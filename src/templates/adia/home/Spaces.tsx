import Link from "next/link";
import { FiArrowRight } from "@/components/shared/icons";
import type { Category } from "@/lib/products";
import { categoryHref, type AdiaHome } from "../content";
import { Container } from "../components/Container";
import { SectionHead } from "./SectionHead";

/** "What's Your Space?" — up to four room cards (photo on top, name + what's in it below), each
 * opening the category the shop picked for it. */
export function Spaces({
  section,
  categories,
  categoryImages,
}: {
  section: AdiaHome["spaces"];
  categories: Category[];
  categoryImages: Record<string, string>;
}) {
  if (!section.enabled || section.items.length === 0) return null;
  const cols = section.items.length >= 4 ? "lg:grid-cols-4" : section.items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <Container className="mt-12 lg:mt-16">
      <SectionHead title={section.title} subtitle={section.subtitle} />
      <div className={`grid grid-cols-2 gap-4 lg:gap-5 ${cols}`}>
        {section.items.map((s, i) => {
          const image = s.imageUrl ?? (s.categoryId ? categoryImages[s.categoryId] : undefined);
          return (
            <Link key={`${s.title}-${i}`} href={categoryHref(s.categoryId, categories)} className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-shadow hover:shadow-lg">
              <div className="relative aspect-[16/11] overflow-hidden bg-[linear-gradient(135deg,#f6ede2_0%,#e9dccb_100%)]">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
                ) : (
                  <span aria-hidden="true" className="absolute inset-0 grid place-items-center font-display text-[80px] font-extrabold text-primary/15">
                    {s.title.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <h3 className="font-display text-[15px] font-bold text-ink lg:text-[17px]">{s.title}</h3>
                  {s.subtitle ? <p className="mt-0.5 line-clamp-2 text-[12px] text-ink-muted lg:text-[13px]">{s.subtitle}</p> : null}
                </div>
                <span className="grid size-9 flex-none place-items-center rounded-full bg-primary text-on-primary transition-transform group-hover:translate-x-1">
                  <FiArrowRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
