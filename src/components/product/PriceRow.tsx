"use client";

import { useMoney } from "@/lib/currency";

// Spec §4 — Archivo 900 21px navy price (16px mobile) + mono 12px slate line-through compare price.
export function PriceRow({
  priceCents,
  compareCents,
  muted = false,
  compact = false,
}: {
  priceCents: number;
  compareCents?: number;
  muted?: boolean;
  compact?: boolean;
}) {
  const fmt = useMoney();
  return (
    <div className="flex items-baseline gap-2">
      <span
        className={`font-sans font-black leading-none ${compact ? "text-[16px]" : "text-[16px] md:text-[21px]"} ${
          muted ? "text-slate-dim" : "text-navy"
        }`}
      >
        {fmt(priceCents)}
      </span>
      {compareCents ? (
        <span className="font-mono text-[12px] text-slate line-through">{fmt(compareCents)}</span>
      ) : null}
    </div>
  );
}
