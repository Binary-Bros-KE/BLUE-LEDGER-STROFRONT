import Link from "next/link";
import { FiArrowRight } from "@/components/shared/icons";
import type { AdiaPromoCard } from "../content";
import { Container } from "../components/Container";

const TONE = {
  light: { card: "bg-[linear-gradient(135deg,#fdf7f0_0%,#f3e7d7_100%)]", title: "text-ink", sub: "text-ink-muted", fade: "#f3e7d7" },
  dark: { card: "bg-[linear-gradient(135deg,#0f1b3d_0%,#1c2c5c_100%)]", title: "text-white", sub: "text-white/75", fade: "#1c2c5c" },
  brand: { card: "bg-[linear-gradient(135deg,var(--brand-primary-hover)_0%,var(--brand-primary)_100%)]", title: "text-on-primary", sub: "text-on-primary-soft", fade: "var(--brand-primary)" },
} as const;

/** A row of up to three feature cards ("Jikoni Upgrade", "Big Screen Weekend"…) — image on the
 * right fading into the card colour, badge, title, subtitle and a link. */
export function PromoCards({ cards }: { cards: AdiaPromoCard[] }) {
  if (cards.length === 0) return null;
  const cols = cards.length === 1 ? "" : cards.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <Container className="mt-12 lg:mt-16">
      <div className={`grid gap-4 lg:gap-5 ${cols}`}>
        {cards.map((c, i) => {
          const t = TONE[c.tone];
          return (
            <Link key={`${c.title}-${i}`} href={c.cta.href} className={`group relative isolate block h-[200px] overflow-hidden rounded-2xl shadow-sm lg:h-[220px] ${t.card}`}>
              {c.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.imageUrl} alt="" loading="lazy" className="absolute inset-y-0 right-0 -z-10 h-full w-[58%] object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                  <span aria-hidden="true" className="absolute inset-y-0 right-[30%] -z-10 w-[30%]" style={{ background: `linear-gradient(90deg, ${t.fade} 0%, transparent 100%)` }} />
                </>
              ) : (
                <span aria-hidden="true" className="absolute -right-10 -bottom-16 -z-10 size-56 rounded-full border-[28px] border-white/10" />
              )}
              <div className="flex h-full max-w-[62%] flex-col justify-center p-6">
                <h3 className={`font-display text-[20px] font-bold leading-tight lg:text-[24px] ${t.title}`}>{c.title}</h3>
                {c.subtitle ? <p className={`mt-1.5 text-[13px] lg:text-[14px] ${t.sub}`}>{c.subtitle}</p> : null}
                {c.badge ? (
                  <span className="mt-3 w-fit rounded-full bg-primary px-3.5 py-1.5 font-display text-[13px] font-bold text-on-primary shadow-sm">{c.badge}</span>
                ) : null}
                <span className={`mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold ${t.title}`}>
                  {c.cta.label} <FiArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
