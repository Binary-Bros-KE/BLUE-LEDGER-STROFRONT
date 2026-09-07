"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContact } from "@/components/contact/ContactModal";
import {
  FiMessageCircle,
  FiSearch,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiX,
} from "@/components/shared/icons";
import { SearchBox } from "./SearchBox";

// Spec §4 — white, top hairline, 10px 16px, 5 items. Fixed bottom. Every tap target ≥ 44px.
export function MobileTabBar({
  cartCount,
  onCartClick,
}: {
  cartCount: number;
  onCartClick: () => void;
}) {
  const { open: openContact } = useContact();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  // Close the search panel on navigation, and lock body scroll while it's open.
  useEffect(() => setSearchOpen(false), [pathname]);
  useEffect(() => {
    if (!searchOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [searchOpen]);

  const items: {
    label: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    badge?: number;
    active?: boolean;
    tone?: string;
  }[] = [
    { label: "SHOP", icon: <FiShoppingBag size={15} />, href: "/products", active: pathname.startsWith("/products") },
    { label: "SEARCH", icon: <FiSearch size={15} />, onClick: () => setSearchOpen(true) },
    { label: "CONTACT", icon: <FiMessageCircle size={15} />, onClick: openContact },
    { label: "CART", icon: <FiShoppingCart size={15} />, badge: cartCount, onClick: onCartClick },
    { label: "ACCOUNT", icon: <FiUser size={15} /> },
  ];

  return (
    <>
      {searchOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            className="animate-overlay absolute inset-0 bg-[rgba(11,14,40,0.55)]"
          />
          <div className="animate-[sheet-in_200ms_cubic-bezier(0.2,0.8,0.2,1)] absolute inset-x-0 top-0 border-b-[1.5px] border-navy bg-white p-4">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <SearchBox variant="compact" autoFocus />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close"
                className="grid size-11 flex-none place-items-center border-[1.5px] border-navy text-navy"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 py-2.5 lg:hidden">
        <ul className="flex items-stretch justify-between">
          {items.map((it) => {
            const className = `relative flex min-h-11 w-full flex-col items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-[1px] ${
              it.active ? "text-blue" : (it.tone ?? "text-slate")
            }`;
            const inner = (
              <>
                {it.icon}
                {it.label}
                {it.badge ? (
                  <span className="absolute right-[22%] top-0 grid size-[15px] place-items-center bg-red font-mono text-[8px] font-bold leading-none text-white">
                    {it.badge}
                  </span>
                ) : null}
              </>
            );
            return (
              <li key={it.label} className="flex-1">
                {it.href ? (
                  <Link href={it.href} aria-label={it.label} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <button type="button" onClick={it.onClick} aria-label={it.label} className={className}>
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
