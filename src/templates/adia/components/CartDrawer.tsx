"use client";

import Link from "next/link";
import { FiMinus, FiPlus, FiShoppingCart, FiTrash2, FiX } from "@/components/shared/icons";
import { useMoney } from "@/lib/currency";
import type { CartLine } from "@/lib/products";
import { useOverlay } from "@/lib/use-overlay";

export function QtyStepper({ qty, onChange }: { qty: number; onChange: (qty: number) => void }) {
  const btn = "grid size-8 place-items-center rounded-full text-ink transition-colors hover:bg-surface-alt";
  return (
    <div className="flex items-center gap-1 rounded-full border border-line p-0.5">
      <button type="button" onClick={() => onChange(qty - 1)} aria-label="Decrease quantity" className={btn}>
        <FiMinus size={13} />
      </button>
      <span className="w-6 text-center font-display text-[14px] font-semibold text-ink">{qty}</span>
      <button type="button" onClick={() => onChange(qty + 1)} aria-label="Increase quantity" className={btn}>
        <FiPlus size={13} />
      </button>
    </div>
  );
}

/** Right-hand cart drawer — the only scrolling region is the line list. */
export function CartDrawer({
  open,
  lines,
  onClose,
  onQty,
  onRemove,
}: {
  open: boolean;
  lines: CartLine[];
  onClose: () => void;
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const fmt = useMoney();
  useOverlay(open, onClose);
  if (!open) return null;

  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.unitPriceCents * l.qty, 0);
  const empty = lines.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Your cart">
      <button type="button" aria-label="Close cart" onClick={onClose} className="animate-overlay absolute inset-0 bg-black/50" />

      <div className="animate-drawer relative flex h-full w-[90vw] max-w-[420px] flex-col rounded-l-2xl bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-[18px] font-bold text-ink">
            Your Cart <span className="text-[14px] font-medium text-ink-muted">({count} {count === 1 ? "item" : "items"})</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="grid size-9 place-items-center rounded-full bg-surface-alt text-ink transition-colors hover:bg-line"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {empty ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-primary-soft text-primary-ink">
                <FiShoppingCart size={26} />
              </span>
              <p className="font-display text-[16px] font-semibold text-ink">Your cart is empty</p>
              <p className="text-[13px] text-ink-muted">Browse our products and add something you love.</p>
            </div>
          ) : (
            lines.map((line) => (
              <div key={line.id} className="flex gap-3 border-b border-line py-4 last:border-b-0">
                <span className="size-[72px] flex-none overflow-hidden rounded-xl border border-line bg-surface">
                  {line.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={line.image} alt="" className="size-full object-contain p-1.5" />
                  ) : null}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[14px] font-medium leading-snug text-ink">{line.name}</p>
                      {line.spec ? <p className="mt-0.5 text-[12px] text-ink-muted">{line.spec}</p> : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(line.id)}
                      aria-label={`Remove ${line.name}`}
                      className="flex-none text-ink-faint transition-colors hover:text-danger"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <QtyStepper qty={line.qty} onChange={(q) => onQty(line.id, q)} />
                    <span className="font-display text-[15px] font-bold text-primary-ink">
                      {fmt(line.unitPriceCents * line.qty)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-line p-5">
          {!empty ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[14px] text-ink-muted">Subtotal</span>
                <span className="font-display text-[20px] font-bold text-ink">{fmt(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="flex items-center justify-center rounded-lg bg-primary py-3.5 font-display text-[15px] font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                Proceed to Checkout
              </Link>
            </>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full rounded-lg py-3 text-[14px] font-semibold text-primary-ink transition-colors hover:bg-primary-soft"
          >
            {empty ? "Start shopping" : "Continue shopping"}
          </button>
        </div>
      </div>
    </div>
  );
}
