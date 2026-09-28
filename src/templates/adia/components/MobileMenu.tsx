"use client";

import Link from "next/link";
import { useContact } from "@/components/contact/ContactModal";
import { FiChevronRight, FiMessageCircle, FiX, FiZap } from "@/components/shared/icons";
import type { Category } from "@/lib/products";
import { slugify } from "@/lib/slug";
import type { ThemeBrand } from "@/lib/theme";
import { useOverlay } from "@/lib/use-overlay";
import { Logo } from "./Logo";

/** Left slide-in drawer (phones/tablets): every category, Hot Deals, and a contact shortcut. */
export function MobileMenu({
  open,
  onClose,
  storeName,
  brand,
  categories,
  dealsHref,
}: {
  open: boolean;
  onClose: () => void;
  storeName: string;
  brand?: ThemeBrand;
  categories: Category[];
  dealsHref: string;
}) {
  const { open: openContact } = useContact();
  useOverlay(open, onClose);
  if (!open) return null;

  const row = "flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 text-[15px] text-ink";

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="animate-overlay absolute inset-0 bg-black/50"
      />
      <div className="absolute inset-y-0 left-0 flex w-[86vw] max-w-[360px] flex-col rounded-r-2xl bg-surface shadow-2xl animate-[drawer-in-left_220ms_cubic-bezier(0.2,0.8,0.2,1)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Logo storeName={storeName} brand={brand} compact />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-9 place-items-center rounded-full bg-surface-alt text-ink"
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <Link href={dealsHref} onClick={onClose} className={`${row} font-semibold text-primary-ink`}>
            <span className="flex items-center gap-2">
              <FiZap size={16} /> Hot Deals
            </span>
            <FiChevronRight size={16} />
          </Link>
          <Link href="/products" onClick={onClose} className={`${row} font-semibold`}>
            Shop all products <FiChevronRight size={16} className="text-ink-faint" />
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/products/${slugify(c.name)}`} onClick={onClose} className={row}>
              <span className="truncate">{c.name}</span>
              <span className="flex flex-none items-center gap-2 text-[12px] text-ink-faint">
                {c.count} <FiChevronRight size={16} />
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              openContact();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-display text-[14px] font-semibold text-on-primary"
          >
            <FiMessageCircle size={16} /> Contact us
          </button>
        </div>
      </div>
    </div>
  );
}
