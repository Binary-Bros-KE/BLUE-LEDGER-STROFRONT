"use client";

import { FiMinus, FiPlus } from "@/components/shared/icons";

// Spec §4 — 1px solid line, 28px −, 32px value cell with side hairlines, 28px +.
export function QtyStepper({ qty, onDec, onInc }: { qty: number; onDec: () => void; onInc: () => void }) {
  return (
    <div className="flex items-stretch border border-line">
      <button
        type="button"
        onClick={onDec}
        aria-label="Decrease quantity"
        className="grid h-8 w-7 place-items-center text-navy transition-colors hover:bg-cream"
      >
        <FiMinus size={12} />
      </button>
      <span className="grid h-8 w-8 place-items-center border-x border-line font-sans text-[13px] font-bold text-navy">
        {qty}
      </span>
      <button
        type="button"
        onClick={onInc}
        aria-label="Increase quantity"
        className="grid h-8 w-7 place-items-center text-navy transition-colors hover:bg-cream"
      >
        <FiPlus size={12} />
      </button>
    </div>
  );
}
