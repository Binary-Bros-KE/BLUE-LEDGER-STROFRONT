"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContact } from "@/components/contact/ContactModal";
import { FiGrid, FiHome, FiMessageCircle, FiSearch, FiShoppingCart, FiX } from "@/components/shared/icons";
import { useOverlay } from "@/lib/use-overlay";
import { SearchBar } from "./SearchBar";

type Item = { label: string; icon: ReactNode; href?: string; onClick?: () => void; badge?: number; active?: boolean };

/** Fixed bottom bar on phones: Home · Shop · Search · Cart · Contact. */
export function MobileTabBar({ cartCount, onCartClick }: { cartCount: number; onCartClick: () => void }) {
  const { open: openContact } = useContact();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setSearchOpen(false), [pathname]);
  useOverlay(searchOpen, () => setSearchOpen(false));

  const items: Item[] = [
    { label: "Home", icon: <FiHome size={20} />, href: "/", active: pathname === "/" },
    { label: "Shop", icon: <FiGrid size={20} />, href: "/products", active: pathname.startsWith("/products") },
    { label: "Search", icon: <FiSearch size={20} />, onClick: () => setSearchOpen(true) },
    { label: "Cart", icon: <FiShoppingCart size={20} />, onClick: onCartClick, badge: cartCount },
    { label: "Contact", icon: <FiMessageCircle size={20} />, onClick: openContact },
  ];

  return (
    <>
      {searchOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Search">
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            className="animate-overlay absolute inset-0 bg-black/50"
          />
          <div className="animate-[sheet-down_200ms_cubic-bezier(0.2,0.8,0.2,1)] absolute inset-x-0 top-0 rounded-b-2xl bg-surface p-4 shadow-xl">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <SearchBar autoFocus placeholder="Search products…" />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close"
                className="grid size-11 flex-none place-items-center rounded-lg bg-surface-alt text-ink"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.05)] lg:hidden">
        <ul className="flex items-stretch">
          {items.map((it) => {
            const cls = `relative flex min-h-14 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
              it.active ? "text-primary-ink" : "text-ink-muted"
            }`;
            const inner = (
              <>
                <span className="relative">
                  {it.icon}
                  {it.badge ? (
                    <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 font-display text-[9px] font-bold leading-none text-on-primary">
                      {it.badge > 99 ? "99+" : it.badge}
                    </span>
                  ) : null}
                </span>
                {it.label}
              </>
            );
            return (
              <li key={it.label} className="flex-1">
                {it.href ? (
                  <Link href={it.href} className={cls} aria-current={it.active ? "page" : undefined}>
                    {inner}
                  </Link>
                ) : (
                  <button type="button" onClick={it.onClick} className={cls}>
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
