"use client";

import { useEffect } from "react";
import type { CartLine } from "@/lib/products";
import { FiMenu, FiPlay, FiX } from "@/components/shared/icons";
import { CartLineItem } from "./CartLineItem";
import { CartSummary } from "./CartSummary";
import { FreeShipProgress } from "./FreeShipProgress";

// Spec §4 — 440px right sidebar ≥ md; full-width bottom sheet below, max-h 88vh, own scroll.
// Overlay rgba(11,14,40,.55), slide-in 220ms. No radius, no blur.
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
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.unitPriceCents * l.qty, 0);
  const vat = Math.round(subtotal - subtotal / 1.16);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end md:items-stretch"
      role="dialog"
      aria-modal="true"
      aria-label="Your cart"
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="animate-overlay absolute inset-0 bg-[rgba(11,14,40,0.55)]"
      />

      <div className="relative flex max-h-[88vh] w-full flex-col bg-white animate-[sheet-in_220ms_cubic-bezier(0.2,0.8,0.2,1)] md:h-full md:max-h-none md:w-[440px] md:animate-[drawer-in_220ms_cubic-bezier(0.2,0.8,0.2,1)]">
        {/* 1 — navy header */}
        <div className="flex items-start justify-between gap-4 bg-navy p-6">
          <div>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[2px] text-amber">
              <FiMenu size={12} /> Your cart
            </span>
            <div className="mt-1 font-sans text-[19px] font-black text-white">
              {count} {count === 1 ? "item" : "items"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="grid size-[34px] flex-none place-items-center border border-navy-600 text-white transition-colors hover:bg-navy-700"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* 2 — free-delivery progress */}
        <FreeShipProgress label="KSH 6,600 away from free delivery" percent={68} />

        {/* 3 — line items (the only scrolling region) */}
        <div className="flex-1 overflow-y-auto bg-white px-6">
          {lines.length === 0 ? (
            <p className="py-12 text-center font-mono text-[11px] uppercase tracking-[1.4px] text-slate">
              Your cart is empty
            </p>
          ) : (
            lines.map((line) => (
              <CartLineItem
                key={line.id}
                line={line}
                onQty={(qty) => onQty(line.id, qty)}
                onRemove={() => onRemove(line.id)}
              />
            ))
          )}
        </div>

        {/* 4 — promo */}
        <div className="border-t border-cream bg-white px-6 py-4">
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Promo code"
              aria-label="Promo code"
              className="h-11 min-w-0 flex-1 border-[1.5px] border-r-0 border-navy bg-white px-3 font-mono text-[12px] uppercase tracking-[1.2px] text-navy outline-none placeholder:text-slate"
            />
            <button
              type="submit"
              className="h-11 flex-none border-[1.5px] border-navy bg-cream px-5 font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-navy"
            >
              Apply
            </button>
          </form>
        </div>

        {/* 5 — summary */}
        <CartSummary subtotalCents={subtotal} vatCents={vat} totalCents={subtotal} />

        {/* 6 — footer */}
        <div className="flex flex-col gap-3 bg-white p-6">
          <button
            type="button"
            className="blk flex items-center justify-center gap-2 bg-blue py-3.5 font-mono text-[12px] font-bold uppercase tracking-[1.6px] text-white"
          >
            <FiPlay size={11} /> Checkout
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border-[1.5px] border-navy py-3.5 font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Continue shopping
          </button>
          <p className="text-center font-mono text-[10px] uppercase leading-[1.7] tracking-[1.2px] text-slate">
            M-Pesa · Card · Trade invoice
            <br />
            Items held for 30 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
