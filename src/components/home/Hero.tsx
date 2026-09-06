import Link from "next/link";
import { ContactButton } from "@/components/contact/ContactButton";
import { Placeholder } from "@/components/shared/Placeholder";
import { Diamond, FiPlay } from "@/components/shared/icons";
import type { TrylistTheme } from "@/lib/theme";
import { DealTile } from "./DealTile";
import { TradeTile } from "./TradeTile";

// Spec §4 — desktop grid `1fr 372px`. Left = bg-grid, holds the copy column + the hero-shot panel.
// Right rail = deal tile + trade tile stacked. Mobile: everything stacks; trade tile drops.
//
// Every text/image slot is theme-overridable (web_stores.themeJson.hero); when a field is unset
// the stock Trylist copy/placeholder below is used.

const DEFAULT_HEADLINE = "BUILT FOR\nTHE SHOP\nFLOOR";
const DEFAULT_SUB =
  "Laptops, POS hardware, printers and networking kit — stocked in Nairobi, delivered countrywide, and set up by people who actually run tills.";

export function Hero({
  hero = {},
  dealTile,
  tradeTile
}: {
  hero?: TrylistTheme["hero"];
  dealTile?: TrylistTheme["dealTile"];
  tradeTile?: TrylistTheme["tradeTile"];
}) {
  const headline = hero.headline?.trim() || DEFAULT_HEADLINE;
  const sub = hero.sub?.trim() || DEFAULT_SUB;
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
  const usingDefaultHeadline = !hero.headline?.trim();
  const secondaryClass =
    "inline-flex items-center justify-center border-[1.5px] border-cream px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-cream transition-colors hover:bg-cream hover:text-navy";

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_372px]">
      {/* LEFT — engineering-grid navy panel (optionally over a background image) */}
      <div className="relative isolate overflow-hidden bg-grid px-4 py-10 sm:px-8 lg:px-11 lg:py-[52px]">
        {hero.backgroundImageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.backgroundImageUrl}
              alt=""
              className="absolute inset-0 -z-10 size-full object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-navy/78" />
          </>
        ) : null}

        <div className="flex flex-col gap-9 lg:flex-row lg:items-stretch lg:gap-10">
          {/* copy column */}
          <div className="flex max-w-[520px] flex-col">
            <span className="inline-flex w-fit items-center gap-1 border border-dashed border-amber px-1.5 py-[3px] font-mono text-[6px] uppercase tracking-[1px] text-amber">
              <Diamond size={5} /> Authorised dealer · 12-month warranty
            </span>

            <h1 className="mt-6 font-sans text-[40px] font-black leading-[0.95] tracking-[-1.4px] text-ink-on-navy [text-wrap:balance] whitespace-pre-line sm:text-[52px] lg:text-[62px] lg:tracking-[-2px]">
              {usingDefaultHeadline ? (
                <>
                  BUILT FOR
                  <br />
                  THE SHOP
                  <br />
                  FLOOR<span className="text-amber">.</span>
                </>
              ) : (
                headline
              )}
            </h1>

            <p className="mt-6 max-w-[420px] font-mono text-[13px] leading-[1.6] text-body-on-navy">{sub}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={primary.href}
                className="blk inline-flex items-center justify-center gap-2 bg-blue px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-white"
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

            <div className="mt-auto pt-10">
              <span className="font-mono text-[11px] uppercase tracking-[1.4px] text-meta-on-navy">
                2,400+ SKUS · Same-day dispatch · M-Pesa · Card
              </span>
            </div>
          </div>

          {/* hero shot */}
          <div
            className={`flex min-h-[150px] flex-1 lg:min-h-0 ${hero.shotImageUrl ? "" : "border border-navy-600"}`}
          >
            {hero.shotImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.shotImageUrl} alt="" className="size-full flex-1 object-cover" />
            ) : (
              <Placeholder dark caption="[ HERO PRODUCT SHOT ]" className="w-full flex-1" />
            )}
          </div>
        </div>
      </div>

      {/* RIGHT rail — on mobile these fall into normal flow below the panel above */}
      <div className="flex flex-col">
        <DealTile dealTile={dealTile} />
        <TradeTile tradeTile={tradeTile} />
      </div>
    </section>
  );
}
