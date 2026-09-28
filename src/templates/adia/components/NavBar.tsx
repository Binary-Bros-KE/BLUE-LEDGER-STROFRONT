"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiMenu, FiZap } from "@/components/shared/icons";
import type { Category } from "@/lib/products";
import { slugify } from "@/lib/slug";
import { Container } from "./Container";

/** Desktop category bar: "All Categories" dropdown, the first few categories, and a Hot Deals link. */
export function NavBar({ categories, dealsHref }: { categories: Category[]; dealsHref: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="hidden border-y border-line bg-surface lg:block">
      <Container className="flex h-12 items-center gap-7">
        <div ref={ref} className="relative h-full">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="true"
            className="flex h-full items-center gap-2.5 bg-primary px-5 font-display text-[14px] font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <FiMenu size={17} /> All Categories
            <FiChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open ? (
            <div className="absolute top-full left-0 z-50 mt-2 w-[540px] rounded-xl border border-line bg-surface p-3 shadow-xl">
              <div className="grid grid-cols-2 gap-1">
                <Link
                  href="/products"
                  className="rounded-lg px-3 py-2.5 text-[14px] font-semibold text-primary-ink hover:bg-primary-soft"
                >
                  Shop all products
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products/${slugify(c.name)}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[14px] text-ink hover:bg-surface-alt hover:text-primary-ink"
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="flex-none text-[12px] text-ink-faint">{c.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <nav aria-label="Categories" className="flex min-w-0 flex-1 items-center gap-7 overflow-hidden">
          {categories.slice(0, 7).map((c) => {
            const href = `/products/${slugify(c.name)}`;
            return (
              <Link
                key={c.id}
                href={href}
                className={`flex-none whitespace-nowrap text-[14px] font-medium transition-colors hover:text-primary-ink ${
                  pathname === href ? "text-primary-ink" : "text-ink"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </nav>

        <Link
          href={dealsHref}
          className="flex flex-none items-center gap-1.5 font-display text-[14px] font-semibold text-primary-ink hover:underline"
        >
          <FiZap size={16} /> Hot Deals
        </Link>
      </Container>
    </div>
  );
}
