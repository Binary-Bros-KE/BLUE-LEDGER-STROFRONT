"use client";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CategoryRibbon } from "@/components/layout/CategoryRibbon";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { TopBar } from "@/components/layout/TopBar";
import { CartProvider, useCart } from "@/lib/cart";
import { CurrencyProvider } from "@/lib/currency";
import type { CartLine, Category } from "@/lib/products";

export type StoreShell = {
  storeName: string;
  currency: string;
  address?: string | null;
  phone?: string | null;
  categories: Category[];
  /** true when no live store resolved and we're rendering the Trylist sample */
  preview?: boolean;
  /** preview mode seeds a sample cart so the drawer can be seen */
  seedLines?: CartLine[];
};

/**
 * Every page renders inside this: sticky header + category ribbon, footer, mobile tab bar,
 * the cart drawer and the mobile menu — plus the cart + currency context they all share.
 * Page-specific content is `children`.
 */
export function StoreChrome({ children, ...shell }: StoreShell & { children: ReactNode }) {
  return (
    <CurrencyProvider currency={shell.currency}>
      <CartProvider seedLines={shell.seedLines}>
        <ChromeInner {...shell}>{children}</ChromeInner>
      </CartProvider>
    </CurrencyProvider>
  );
}

function ChromeInner({
  children,
  storeName,
  address,
  phone,
  categories,
  preview,
}: StoreShell & { children: ReactNode }) {
  const cart = useCart();

  return (
    <>
      {preview ? (
        <div className="bg-amber-ink px-4 py-1.5 text-center font-mono text-[10px] uppercase tracking-[1.4px] text-white">
          Preview · sample data — set DEV_STORE_DOMAIN to a live store
        </div>
      ) : null}

      <TopBar />

      {/* Spec §5 — Header + CategoryRibbon stick on desktop. */}
      <div className="z-40 lg:sticky lg:top-0">
        <Header
          storeName={storeName}
          favCount={cart.favourites.size}
          cartCount={cart.count}
          cartTotalCents={cart.totalCents}
          onCartClick={cart.openCart}
          onMenuClick={cart.openMenu}
          onFavClick={() => undefined}
        />
        <CategoryRibbon categories={categories} />
      </div>

      <main className="pb-16 lg:pb-0">{children}</main>

      <Footer storeName={storeName} address={address} phone={phone} />

      <MobileTabBar favCount={cart.favourites.size} cartCount={cart.count} onCartClick={cart.openCart} />

      <CartDrawer
        open={cart.cartOpen}
        lines={cart.lines}
        onClose={cart.closeCart}
        onQty={cart.setQty}
        onRemove={cart.removeLine}
      />
      <MobileMenu open={cart.menuOpen} onClose={cart.closeMenu} storeName={storeName} categories={categories} />
    </>
  );
}
