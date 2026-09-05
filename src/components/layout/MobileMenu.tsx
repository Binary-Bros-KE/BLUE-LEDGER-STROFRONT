"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiUser, FiX } from "@/components/shared/icons";
import type { Category } from "@/lib/products";
import { slugify } from "@/lib/slug";
import { Logo } from "./Logo";

// Behind the Header's menu button. Navy full-screen, real category links, sign-in.
export function MobileMenu({
  open,
  onClose,
  storeName = "TRYLIST",
  categories,
}: {
  open: boolean;
  onClose: () => void;
  storeName?: string;
  categories: Category[];
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

  const links = [
    { label: "Shop all", href: "/products" },
    ...categories.map((c) => ({ label: c.name, href: `/products/${slugify(c.name)}` })),
  ];

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

      <nav className="mt-8 flex flex-col overflow-y-auto">
        {links.map((link, i) => (
          <Link
            key={link.href + i}
            href={link.href}
            onClick={onClose}
            className={`border-b border-navy-700 py-4 font-mono text-[13px] uppercase tracking-[1.6px] ${
              i === 0 ? "font-bold text-amber" : "text-ink-on-navy"
            }`}
          >
            {link.label}
          </Link>
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
