"use client";

import { Container } from "@/components/shared/Container";
import { FiHeart, FiMenu, FiShoppingCart, FiUser } from "@/components/shared/icons";
import { useMoney } from "@/lib/currency";
import type { ThemeBrand } from "@/lib/theme";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";

// Spec §4 — white, 18px 40px, bottom hairline. Grid: logo · search · actions.
export function Header({
  storeName,
  brand,
  favCount,
  cartCount,
  cartTotalCents,
  onCartClick,
  onMenuClick,
  onFavClick,
}: {
  storeName: string;
  brand?: ThemeBrand;
  favCount: number;
  cartCount: number;
  cartTotalCents: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onFavClick: () => void;
}) {
  const fmt = useMoney();
  const logoProps = {
    name: storeName,
    logoUrl: brand?.logoImageUrl,
    line1: brand?.nameLine1,
    line2: brand?.nameLine2,
  };
  return (
    <div className="border-b border-line bg-white">
      <Container>
        {/* ── desktop ──────────────────────────────────────────────────────── */}
        <div className="hidden grid-cols-[auto_1fr_auto] items-center gap-6 py-[18px] lg:grid">
          <Logo {...logoProps} />

          <SearchBox variant="bar" />

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
            <Logo {...logoProps} size={30} />
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

          <SearchBox variant="compact" />
          <div className="h-3" />
        </div>
      </Container>
    </div>
  );
}
