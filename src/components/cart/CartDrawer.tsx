"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { CartLine } from "@/lib/products";
import { FiPlay, FiShoppingCart, FiX } from "@/components/shared/icons";
import { CartLineItem } from "./CartLineItem";
import { CartSummary } from "./CartSummary";

// Right-side panel on every breakpoint (spec §4). ~86vw on phones so a strip of the page still
// shows behind it; fixed 420px from md up. Overlay rgba(11,14,40,.55), slide-in 220ms, no radius.
// Chrome is kept deliberately thin — header, a compact summary, two actions — so the line-item
// list (the only scrolling region) gets the vertical space.
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
  const empty = lines.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
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

      <div className="relative flex h-full w-[86vw] max-w-[400px] flex-col bg-white animate-[drawer-in_220ms_cubic-bezier(0.2,0.8,0.2,1)] md:w-[420px] md:max-w-none">
        {/* 1 — header (thin) */}
        <div className="flex items-center justify-between gap-3 bg-navy px-4 py-3">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[1.6px] text-amber">
            <FiShoppingCart size={13} />
            Your cart
            <span className="text-white">· {count}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="grid size-7 flex-none place-items-center border border-navy-600 text-white transition-colors hover:bg-navy-700"
          >
            <FiX size={15} />
          </button>
        </div>

        {/* 2 — line items (the only scrolling region) */}
        <div className="flex-1 overflow-y-auto bg-white px-4">
          {empty ? (
            <p className="py-16 text-center font-mono text-[11px] uppercase tracking-[1.4px] text-slate">
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

        {/* 3 — compact summary */}
        {!empty ? <CartSummary subtotalCents={subtotal} vatCents={vat} totalCents={subtotal} /> : null}

        {/* 4 — actions */}
        <div className="flex flex-col gap-2 bg-white p-4">
          {!empty ? (
            <Link
              href="/checkout"
              onClick={onClose}
              className="blk flex items-center justify-center gap-2 bg-blue py-3 font-mono text-[12px] font-bold uppercase tracking-[1.6px] text-white"
            >
              <FiPlay size={11} /> Checkout
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="border-[1.5px] border-navy py-3 font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-navy transition-colors hover:bg-navy hover:text-white"
          >
            {empty ? "Start shopping" : "Continue shopping"}
          </button>
        </div>
      </div>
    </div>
  );
}
