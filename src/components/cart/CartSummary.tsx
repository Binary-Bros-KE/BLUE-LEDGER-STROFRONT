"use client";

import type { ReactNode } from "react";
import { useMoney } from "@/lib/currency";

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-slate">{label}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.5px] text-navy">{value}</span>
    </div>
  );
}

// Spec §4 — compact cream block: subtotal / delivery / VAT on tight rows, hairline, then TOTAL.
export function CartSummary({
  subtotalCents,
  vatCents,
  totalCents,
}: {
  subtotalCents: number;
  vatCents: number;
  totalCents: number;
}) {
  const fmt = useMoney();
  return (
    <div className="space-y-1 border-t border-cream-line bg-cream px-4 py-3">
      <Row label="Subtotal" value={fmt(subtotalCents)} />
      <Row label="Delivery · Nairobi" value={<span className="text-green">FREE</span>} />
      <Row label="VAT (16%) incl." value={fmt(vatCents)} />
      <div className="!mt-2 flex items-center justify-between border-t border-cream-line pt-2">
        <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-navy">Total</span>
        <span className="font-sans text-[19px] font-black leading-none text-navy">{fmt(totalCents)}</span>
      </div>
    </div>
  );
}
