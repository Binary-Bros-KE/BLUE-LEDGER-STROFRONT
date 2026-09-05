"use client";

import {
  FiHeart,
  FiSearch,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
} from "@/components/shared/icons";

// Spec §4 — white, top hairline, 10px 16px, 5 items. Fixed bottom. Every tap target ≥ 44px.
export function MobileTabBar({
  favCount,
  cartCount,
  onCartClick,
}: {
  favCount: number;
  cartCount: number;
  onCartClick: () => void;
}) {
  const items = [
    { label: "SHOP", icon: <FiShoppingBag size={15} />, active: true },
    { label: "SEARCH", icon: <FiSearch size={15} /> },
    { label: "SAVED", icon: <FiHeart size={15} strokeWidth={2} />, tone: "text-red", badge: favCount },
    { label: "CART", icon: <FiShoppingCart size={15} />, badge: cartCount, onClick: onCartClick },
    { label: "ACCOUNT", icon: <FiUser size={15} /> },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 py-2.5 lg:hidden">
      <ul className="flex items-stretch justify-between">
        {items.map((it) => (
          <li key={it.label} className="flex-1">
            <button
              type="button"
              onClick={it.onClick}
              aria-label={it.label}
              className={`relative flex min-h-11 w-full flex-col items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-[1px] ${
                it.active ? "text-blue" : (it.tone ?? "text-slate")
              }`}
            >
              {it.icon}
              {it.label}
              {it.badge ? (
                <span className="absolute right-[22%] top-0 grid size-[15px] place-items-center bg-red font-mono text-[8px] font-bold leading-none text-white">
                  {it.badge}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
