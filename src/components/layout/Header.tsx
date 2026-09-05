"use client";

import { Container } from "@/components/shared/Container";
import {
  FiChevronDown,
  FiHeart,
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "@/components/shared/icons";
import { useMoney } from "@/lib/currency";
import { Logo } from "./Logo";

const SEARCH_PLACEHOLDER = 'Search 2,400+ products — "thermal printer"';

// Spec §4 — white, 18px 40px, bottom hairline. Grid: logo · search · actions.
export function Header({
  storeName,
  favCount,
  cartCount,
  cartTotalCents,
  onCartClick,
  onMenuClick,
  onFavClick,
}: {
  storeName: string;
  favCount: number;
  cartCount: number;
  cartTotalCents: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onFavClick: () => void;
}) {
  const fmt = useMoney();
  return (
    <div className="border-b border-line bg-white">
      <Container>
        {/* ── desktop ──────────────────────────────────────────────────────── */}
        <div className="hidden grid-cols-[auto_1fr_auto] items-center gap-6 py-[18px] lg:grid">
          <Logo name={storeName} />

          <form className="flex h-11 border-[1.5px] border-navy" role="search" onSubmit={(e) => e.preventDefault()}>
            <button
              type="button"
              className="flex w-[150px] flex-none items-center justify-between gap-1 border-r-[1.5px] border-navy px-4 font-mono text-[12px] uppercase tracking-[1.4px] text-navy"
            >
              All categories
              <FiChevronDown size={12} />
            </button>
            <input
              type="text"
              placeholder={SEARCH_PLACEHOLDER}
              aria-label="Search products"
              className="min-w-0 flex-1 bg-white px-3 font-mono text-[13px] text-navy outline-none placeholder:text-slate"
            />
            <button
              type="submit"
              aria-label="Search"
              className="grid w-[52px] flex-none place-items-center bg-navy text-amber"
            >
              <FiSearch size={18} />
            </button>
          </form>

          <div className="flex items-center gap-4">
            <button type="button" className="flex items-center gap-2 text-navy">
              <FiUser size={20} className="text-navy" />
              <span className="flex flex-col items-start leading-none">
                <span className="font-mono text-[9px] uppercase tracking-[2px] text-slate">Account</span>
                <span className="mt-[3px] font-sans text-[13px] font-bold text-navy">Sign in</span>
              </span>
            </button>

            <button
              type="button"
              onClick={onFavClick}
              aria-label={`Favourites — ${favCount} saved`}
              className="relative grid size-11 flex-none place-items-center border border-line text-red"
            >
              <FiHeart size={16} strokeWidth={2} />
              {favCount > 0 ? (
                <span className="absolute -right-2 -top-2 grid size-5 place-items-center bg-red font-mono text-[10px] font-bold leading-none text-white">
                  {favCount}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={onCartClick}
              aria-label={`Open cart — ${cartCount} items, ${fmt(cartTotalCents)}`}
              className="blk-sm flex h-11 items-center gap-2.5 bg-blue px-4 text-left text-white"
            >
              <FiShoppingCart size={16} className="text-amber" />
              <span className="flex flex-col leading-none">
                <span className="font-mono text-[9px] uppercase tracking-[1.4px] text-on-blue">Cart · {cartCount}</span>
                <span className="mt-[3px] font-sans text-[13px] font-extrabold text-white">{fmt(cartTotalCents)}</span>
              </span>
            </button>
          </div>
        </div>

        {/* ── mobile ───────────────────────────────────────────────────────── */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between py-3">
            <Logo name={storeName} size={30} />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onFavClick}
                aria-label={`Favourites — ${favCount} saved`}
                className="relative grid size-9 flex-none place-items-center border border-line text-red"
              >
                <FiHeart size={15} strokeWidth={2} />
                {favCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 grid size-[18px] place-items-center bg-red font-mono text-[9px] font-bold leading-none text-white">
                    {favCount}
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={onCartClick}
                aria-label={`Open cart — ${cartCount} items`}
                className="relative grid size-9 flex-none place-items-center bg-blue text-white"
              >
                <FiShoppingCart size={15} className="text-amber" />
                {cartCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 grid size-[18px] place-items-center bg-amber font-mono text-[9px] font-bold leading-none text-navy">
                    {cartCount}
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={onMenuClick}
                aria-label="Open menu"
                className="grid size-9 flex-none place-items-center bg-navy text-white"
              >
                <FiMenu size={16} />
              </button>
            </div>
          </div>

          <form className="flex h-11 border-[1.5px] border-navy pb-0" role="search" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search products…"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-white px-3 font-mono text-[13px] text-navy outline-none placeholder:text-slate"
            />
            <button type="submit" aria-label="Search" className="grid w-11 flex-none place-items-center bg-navy text-amber">
              <FiSearch size={16} />
            </button>
          </form>
          <div className="h-3" />
        </div>
      </Container>
    </div>
  );
}
