"use client";

import Link from "next/link";
import { useMoney } from "@/lib/currency";
import type { ThemeDealTile } from "@/lib/theme";
import { FiZap } from "@/components/shared/icons";

const DEFAULT_TITLE = "Thermal printers\n25% off";

// Spec §4 — hero right-rail tile 1. Red ground. On mobile it's a compact full-width strip.
//
// Client request: replaced the countdown timer with a real price-discount feature — the shop owner
// sets a price + an offer price in the theme editor (DESKTOP's ThemePanel.tsx) and the discount
// badge below is calculated from those two numbers, never entered/stored separately, so it can
// never drift out of sync with what's actually being charged. "Deal of the week" itself stays a
// static label, per the same request — it's not part of dealTile at all.
export function DealTile({ dealTile = {} }: { dealTile?: ThemeDealTile }) {
  const money = useMoney();
  const title = dealTile.title?.trim() || DEFAULT_TITLE;
  const cta = {
    label: dealTile.ctaLabel?.trim() || "Buy Now",
    href: dealTile.ctaHref?.trim() || "/products",
  };

  const hasOffer =
    typeof dealTile.priceCents === "number" &&
    typeof dealTile.offerPriceCents === "number" &&
    dealTile.offerPriceCents > 0 &&
    dealTile.offerPriceCents < dealTile.priceCents;
  const discountPercent = hasOffer
    ? Math.round((1 - dealTile.offerPriceCents! / dealTile.priceCents!) * 100)
    : null;

  return (
    <div className="relative flex flex-col gap-3 bg-red p-6 text-white lg:flex-1">
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1.6px] text-white/85">
        <FiZap size={11} /> Deal of the week
      </span>

      <h3 className="whitespace-pre-line font-sans text-[20px] font-black leading-[1.1] lg:text-[29px]">{title}</h3>

      {(hasOffer || typeof dealTile.priceCents === "number") && (
        <div className="flex items-center gap-2.5">
          <span className="font-sans text-[20px] font-black leading-none">
            {money(hasOffer ? dealTile.offerPriceCents! : dealTile.priceCents!)}
          </span>
          {hasOffer && (
            <>
              <span className="font-mono text-[12px] text-white/70 line-through">{money(dealTile.priceCents!)}</span>
              <span className="grid h-6 place-items-center bg-red-900 px-2 font-mono text-[11px] font-bold uppercase tracking-[0.5px]">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
      )}

      <Link
        href={cta.href}
        className="mt-1 inline-flex w-fit items-center gap-2 bg-white px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-red transition-colors hover:bg-cream"
      >
        {cta.label}
      </Link>

      {dealTile.imageUrl ? (
        // Client request: absolutely positioned in the corner (not its own row) so it sits at the
        // same level as the copy above it instead of pushing the tile taller.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dealTile.imageUrl}
          alt=""
          className="absolute bottom-4 right-4 size-28 border border-white/20 object-cover lg:size-36"
        />
      ) : null}
    </div>
  );
}
