"use client";

import type { ReactNode } from "react";
import { useMoney } from "@/lib/currency";

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="font-mono text-[11px] uppercase tracking-[1.4px] text-slate">{label}</span>
      <span className="font-mono text-[12px] uppercase tracking-[1px] text-navy">{value}</span>
    </div>
  );
}

// Spec §4 — cream: SUBTOTAL, DELIVERY · NAIROBI (green FREE), VAT (16%) INCLUSIVE, rule, TOTAL
// (Archivo 900 26px).
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
    <div className="bg-cream px-6 py-5">
      <Row label="Subtotal" value={fmt(subtotalCents)} />
      <Row label="Delivery · Nairobi" value={<span className="text-green">FREE</span>} />
      <Row label="VAT (16%) inclusive" value={fmt(vatCents)} />
      <div className="my-3 h-px w-full bg-cream-line" />
      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] uppercase tracking-[1.4px] text-navy">Total</span>
        <span className="font-sans text-[26px] font-black leading-none text-navy">{fmt(totalCents)}</span>
      </div>
    </div>
  );
}
