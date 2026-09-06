"use client";

import type { CartLine } from "@/lib/products";
import { Placeholder } from "@/components/shared/Placeholder";
import { FiX } from "@/components/shared/icons";
import { useMoney } from "@/lib/currency";
import { QtyStepper } from "./QtyStepper";

// Compact cart row — 56px thumb (real image or hatch placeholder), 2-line name, mono spec / red
// low-stock note, × remove, qty stepper, line total. 1px cream dividers.
export function CartLineItem({
  line,
  onQty,
  onRemove,
}: {
  line: CartLine;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const fmt = useMoney();
  return (
    <div className="flex gap-3 border-b border-cream py-3 last:border-b-0">
      {line.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={line.image}
          alt=""
          className="size-14 flex-none border border-line object-cover"
        />
      ) : (
        <Placeholder caption="[ IMG ]" className="size-14 flex-none border border-line" />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-sans text-[13px] font-extrabold leading-snug text-navy line-clamp-2">
              {line.name}
            </div>
            {line.lowStockNote ? (
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[1.2px] text-red">{line.lowStockNote}</div>
            ) : line.spec ? (
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[1.2px] text-slate">{line.spec}</div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${line.name}`}
            className="flex-none text-slate transition-colors hover:text-navy"
          >
            <FiX size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <QtyStepper qty={line.qty} onDec={() => onQty(line.qty - 1)} onInc={() => onQty(line.qty + 1)} />
          <span className="font-sans text-[15px] font-black text-navy">{fmt(line.unitPriceCents * line.qty)}</span>
        </div>
      </div>
    </div>
  );
}
