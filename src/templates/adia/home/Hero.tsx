import Link from "next/link";
import { ContactButton } from "@/components/contact/ContactButton";
import { FiArrowRight, FiShoppingBag } from "@/components/shared/icons";
import type { TrylistTheme } from "@/lib/theme";
import { Container } from "../components/Container";
import { dealPercent } from "../deal";

const DEFAULT_HEADLINE = "Make Home\nBetter";
const DEFAULT_SUB = "Top home appliances for modern homes — genuine products with official warranty.";

/** The last line of the headline is the punchline — set bigger and heavier (the reference's "Better"). */
function splitHeadline(text: string): { lead: string[]; punch: string } {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) return { lead: lines.slice(0, -1), punch: lines[lines.length - 1] };
  const words = text.trim().split(/\s+/);
  if (words.length > 2) return { lead: [words.slice(0, -1).join(" ")], punch: words[words.length - 1] };
  return { lead: [], punch: text.trim() };
}

/**
 * Rounded primary-gradient banner: headline + sub + CTAs on the left, the hero product shot on the
 * right with an "UP TO x% OFF" roundel when the shop has a deal configured. All copy/images come
 * from the shop's content (themeJson.hero / dealTile), with appliance-store defaults.
 */
export function Hero({ hero, deal }: { hero: TrylistTheme["hero"]; deal: TrylistTheme["dealTile"] }) {
  const { lead, punch } = splitHeadline(hero.headline?.trim() || DEFAULT_HEADLINE);
  const sub = hero.sub?.trim() || DEFAULT_SUB;
  const primary = {
    label: hero.primaryCta?.label?.trim() || "Shop Now",
    href: hero.primaryCta?.href?.trim() || "/products",
  };
  const secondaryHref = hero.secondaryCta?.href?.trim();
  const secondaryLabel = hero.secondaryCta?.label?.trim();
  const pct = dealPercent(deal);
  const secondaryCls =
    "inline-flex items-center justify-center rounded-lg border border-on-primary/60 px-6 py-3 font-display text-[14px] font-semibold text-on-primary transition-colors hover:bg-on-primary/10";

  return (
    <Container className="pt-4 lg:pt-6">
      <section className="relative isolate overflow-hidden rounded-2xl bg-[linear-gradient(120deg,var(--brand-primary)_0%,var(--brand-primary-hover)_100%)]">
        {hero.backgroundImageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.backgroundImageUrl} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-primary/75" />
          </>
        ) : (
          <>
            <span aria-hidden="true" className="absolute -top-24 -right-16 -z-10 size-[420px] rounded-full bg-on-primary/[0.07]" />
            <span aria-hidden="true" className="absolute -bottom-32 left-1/3 -z-10 size-[360px] rounded-full bg-black/[0.06]" />
          </>
        )}

        <div className="grid items-center gap-6 px-6 py-9 sm:px-10 lg:min-h-[400px] lg:grid-cols-[1fr_1.15fr] lg:px-14 lg:py-12">
          <div className="max-w-[520px]">
            <h1 className="font-display leading-[1.02] text-on-primary">
              {lead.map((l) => (
                <span key={l} className="block text-[34px] font-semibold tracking-[-0.5px] sm:text-[44px] lg:text-[52px]">
                  {l}
                </span>
              ))}
              <span className="block text-[44px] font-extrabold tracking-[-1px] sm:text-[58px] lg:text-[72px]">{punch}</span>
            </h1>
            <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-on-primary-soft lg:text-[17px]">{sub}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={primary.href}
                className="inline-flex items-center gap-2 rounded-lg bg-surface px-6 py-3 font-display text-[14px] font-semibold text-primary-ink shadow-md transition-transform hover:-translate-y-0.5"
              >
                {primary.label} <FiArrowRight size={16} />
              </Link>
              {secondaryLabel ? (
                secondaryHref && secondaryHref !== "#" ? (
                  <Link href={secondaryHref} className={secondaryCls}>
                    {secondaryLabel}
                  </Link>
                ) : (
                  <ContactButton className={secondaryCls}>{secondaryLabel}</ContactButton>
                )
              ) : null}
            </div>
          </div>

          <div className="relative flex min-h-[200px] items-center justify-center lg:min-h-[330px]">
            {hero.shotImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.shotImageUrl}
                alt=""
                className="max-h-[340px] w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.25)]"
              />
            ) : (
              // No hero image uploaded yet: a quiet decorative mark — never setup instructions, this is
              // the public site.
              <div aria-hidden="true" className="relative grid h-[200px] w-full place-items-center lg:h-[320px]">
                <span className="absolute size-[180px] rounded-full bg-on-primary/10 lg:size-[280px]" />
                <span className="absolute size-[120px] rounded-full bg-on-primary/10 lg:size-[190px]" />
                <FiShoppingBag size={72} strokeWidth={1.5} className="relative text-on-primary/80 lg:size-[104px]" />
              </div>
            )}
            {pct ? (
              <div className="absolute top-0 right-0 grid size-24 -rotate-6 place-items-center rounded-full bg-surface text-center shadow-xl lg:size-32">
                <span className="leading-none">
                  <span className="block font-display text-[11px] font-bold uppercase text-ink lg:text-[13px]">Up to</span>
                  <span className="block font-display text-[30px] font-extrabold text-primary-ink lg:text-[42px]">{pct}%</span>
                  <span className="block font-display text-[12px] font-bold uppercase text-ink lg:text-[14px]">Off</span>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </Container>
  );
}
