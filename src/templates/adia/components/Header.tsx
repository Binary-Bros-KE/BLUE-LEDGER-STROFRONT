"use client";

import { ContactButton } from "@/components/contact/ContactButton";
import { FiHeart, FiMenu, FiShoppingCart, FiUser } from "@/components/shared/icons";
import { useMoney } from "@/lib/currency";
import type { ThemeBrand } from "@/lib/theme";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";

export function CountBadge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -top-1.5 -right-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 font-display text-[10px] font-bold leading-none text-on-primary">
      {n > 99 ? "99+" : n}
    </span>
  );
}

/** White header: logo · search · help + saved + cart. Mobile: menu + logo + cart, search below. */
export function Header({
  storeName,
  brand,
  favCount,
  cartCount,
  cartTotalCents,
  onCartClick,
  onMenuClick,
}: {
  storeName: string;
  brand?: ThemeBrand;
  favCount: number;
  cartCount: number;
  cartTotalCents: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}) {
  const fmt = useMoney();
  return (
    <div className="bg-surface">
      <Container>
        {/* desktop */}
        <div className="hidden grid-cols-[auto_1fr_auto] items-center gap-10 py-4 lg:grid">
          <Logo storeName={storeName} brand={brand} />
          <div className="w-full max-w-[680px] justify-self-center">
            <SearchBar />
          </div>
          <div className="flex items-center gap-6">
            <ContactButton className="flex items-center gap-2 text-ink transition-colors hover:text-primary-ink">
              <FiUser size={22} />
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[11px] text-ink-muted">Need help?</span>
                <span className="text-[13px] font-semibold">Contact us</span>
              </span>
            </ContactButton>
            <span className="relative text-ink" aria-label={`${favCount} saved items`} title="Saved items">
              <FiHeart size={22} />
              <CountBadge n={favCount} />
            </span>
            <button
              type="button"
              onClick={onCartClick}
              aria-label={`Open cart — ${cartCount} items, ${fmt(cartTotalCents)}`}
              className="flex items-center gap-2.5 text-ink transition-colors hover:text-primary-ink"
            >
              <span className="relative">
                <FiShoppingCart size={24} />
                <CountBadge n={cartCount} />
              </span>
              <span className="hidden flex-col items-start leading-tight xl:flex">
                <span className="text-[11px] text-ink-muted">My cart</span>
                <span className="font-display text-[13px] font-bold">{fmt(cartTotalCents)}</span>
              </span>
            </button>
          </div>
        </div>

        {/* mobile */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={onMenuClick}
                aria-label="Open menu"
                className="grid size-9 flex-none place-items-center rounded-lg text-ink hover:bg-surface-alt"
              >
                <FiMenu size={20} />
              </button>
              <Logo storeName={storeName} brand={brand} compact />
            </div>
            <button
              type="button"
              onClick={onCartClick}
              aria-label={`Open cart — ${cartCount} items`}
              className="relative grid size-10 flex-none place-items-center rounded-lg text-ink hover:bg-surface-alt"
            >
              <FiShoppingCart size={22} />
              <CountBadge n={cartCount} />
            </button>
          </div>
          <div className="pb-3">
            <SearchBar placeholder="Search products…" />
          </div>
        </div>
      </Container>
    </div>
  );
}
