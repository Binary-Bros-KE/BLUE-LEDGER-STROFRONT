import Link from "next/link";
import { FiArrowRight } from "@/components/shared/icons";
import type { AdiaHome } from "../content";
import { Container } from "../components/Container";
import { SectionHead } from "./SectionHead";

/** "Better Together" — up to three wide cards (image left; title, save-badge, prices, link right).
 * Each links wherever the shop points it, typically a category. Prices are free text on purpose:
 * the shop writes exactly what it wants shown ("KSh 99,999"), nothing is computed. */
export function Collections({ section }: { section: AdiaHome["collections"] }) {
  if (!section.enabled || section.items.length === 0) return null;
  return (
    <Container className="mt-12 lg:mt-16">
      <SectionHead title={section.title} subtitle={section.subtitle} href={section.ctaHref} cta={section.ctaLabel} />
      <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
        {section.items.map((c, i) => (
          <Link key={`${c.title}-${i}`} href={c.cta.href} className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-sm transition-shadow hover:shadow-lg">
            <div className="grid size-32 flex-none place-items-center overflow-hidden rounded-xl bg-surface-alt lg:size-36">
              {c.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.imageUrl} alt="" loading="lazy" className="size-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.05]" />
              ) : (
                <span aria-hidden="true" className="font-display text-[56px] font-extrabold text-primary/15">{c.title.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-[16px] font-bold leading-snug text-ink">{c.title}</h3>
              {c.subtitle ? <p className="mt-0.5 line-clamp-2 text-[12px] text-ink-muted">{c.subtitle}</p> : null}
              {c.badge ? <span className="mt-2 inline-block rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-on-primary">{c.badge}</span> : null}
              {c.oldPriceText ? <p className="mt-2 text-[12px] text-ink-faint line-through">{c.oldPriceText}</p> : null}
              {c.priceText ? <p className="font-display text-[18px] font-bold text-primary-ink">{c.priceText}</p> : null}
              <span className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-semibold text-primary-ink">
                {c.cta.label} <FiArrowRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
