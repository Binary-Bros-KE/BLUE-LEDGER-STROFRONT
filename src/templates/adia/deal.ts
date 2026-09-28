import type { TrylistTheme } from "@/lib/theme";

/** The discount the shop's deal content advertises (price vs offer price) — never stored, always
 * derived, so it can't drift from the prices themselves. null when no valid offer is set. */
export function dealPercent(deal: TrylistTheme["dealTile"]): number | null {
  const { priceCents: p, offerPriceCents: o } = deal;
  if (typeof p !== "number" || typeof o !== "number" || o <= 0 || o >= p) return null;
  return Math.round((1 - o / p) * 100);
}
