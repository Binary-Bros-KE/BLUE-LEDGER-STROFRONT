"use client";

import { useEffect } from "react";
import { FiUser, FiX } from "@/components/shared/icons";
import { CATEGORY_RIBBON } from "@/lib/products";
import { Logo } from "./Logo";

// Not in the spec's component inventory, but spec §0/§6 call for a "mobile menu" behind the
// Header's menu button. Kept minimal and on-brand — navy full-screen, category links, sign-in.
export function MobileMenu({
  open,
  onClose,
  storeName = "TRYLIST",
}: {
  open: boolean;
  onClose: () => void;
  storeName?: string;
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-navy p-6 lg:hidden">
      <div className="flex items-center justify-between">
        <Logo name={storeName} onDark size={30} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid size-9 place-items-center border border-navy-600 text-white"
        >
          <FiX size={16} />
        </button>
      </div>

      <nav className="mt-8 flex flex-col">
        {CATEGORY_RIBBON.map((label, i) => (
          <a
            key={label}
            href="#"
            onClick={onClose}
            className={`border-b border-navy-700 py-4 font-mono text-[13px] uppercase tracking-[1.6px] ${
              i === 0 ? "font-bold text-amber" : "text-ink-on-navy"
            }`}
          >
            {label}
          </a>
        ))}
      </nav>

      <a
        href="#"
        className="mt-auto flex items-center justify-center gap-2 bg-blue py-4 font-mono text-[12px] font-bold uppercase tracking-[1.6px] text-white"
      >
        <FiUser size={13} /> Sign in
      </a>
    </div>
  );
}
