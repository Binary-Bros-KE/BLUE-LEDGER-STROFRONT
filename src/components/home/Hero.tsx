import Link from "next/link";
import { ContactButton } from "@/components/contact/ContactButton";
import { Container } from "@/components/shared/Container";
import { Diamond, FiPlay } from "@/components/shared/icons";
import type { TrylistTheme } from "@/lib/theme";

// A single static banner: the theme's background image under a navy overlay, the shop's name and
// the two hero buttons. Client request (2026-11-26): the old split hero (headline copy, product
// shot, deal + trade tiles) was too busy — that content now lives in FeatureCards, below the first
// product row. Without a background image the banner falls back to the engineering-grid navy.

export function Hero({ hero = {}, storeName }: { hero?: TrylistTheme["hero"]; storeName?: string }) {
  const primary = {
    label: hero.primaryCta?.label?.trim() || "Shop the catalogue",
    href: hero.primaryCta?.href?.trim() || "/products",
  };
  const secondaryHref = hero.secondaryCta?.href?.trim();
  const secondary = {
    label: hero.secondaryCta?.label?.trim() || "Talk to sales",
    // no real link configured → the button opens the Contact pop-up
    href: secondaryHref && secondaryHref !== "#" ? secondaryHref : null,
  };
  const secondaryClass =
    "inline-flex items-center justify-center border-[1.5px] border-cream px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[1.2px] text-cream transition-colors hover:bg-cream hover:text-navy sm:px-6 sm:py-3.5 sm:text-[11px] sm:tracking-[1.6px]";

  return (
    <section
      className={`relative isolate flex min-h-[255px] items-center overflow-hidden sm:min-h-[315px] lg:min-h-[375px] ${
        hero.backgroundImageUrl ? "bg-navy" : "bg-grid"
      }`}
    >
      {hero.backgroundImageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.backgroundImageUrl} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
          {/* darker on the text side, so the copy stays readable over any photo */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/90 via-navy/65 to-navy/20" />
        </>
      ) : null}

      <Container className="py-8 lg:py-10">
        <div className="flex max-w-[620px] flex-col">
          <span className="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1px] text-amber lg:text-[12px]">
            <Diamond size={8} /> Authorised dealer · Up to 12-month warranty
          </span>

          <h1 className="mt-5 font-sans text-[36px] uppercase font-black leading-[0.95] tracking-[-1.2px] text-ink-on-navy [text-wrap:balance] sm:text-[48px] lg:text-[60px] lg:tracking-[-2px]">
            {storeName?.trim() || "Shop online"}
            <span className="text-amber">.</span>
          </h1>

          <div className="mt-6 flex flex-wrap gap-3 lg:mt-8">
            <Link
              href={primary.href}
              className="blk inline-flex items-center justify-center gap-2 bg-blue px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[1.2px] text-on-primary sm:px-6 sm:py-3.5 sm:text-[11px] sm:tracking-[1.6px]"
            >
              <FiPlay size={11} /> {primary.label}
            </Link>
            {secondary.href ? (
              <Link href={secondary.href} className={secondaryClass}>
                {secondary.label}
              </Link>
            ) : (
              <ContactButton className={secondaryClass}>{secondary.label}</ContactButton>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
