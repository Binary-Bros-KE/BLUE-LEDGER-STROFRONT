"use client";

import { ContactProvider } from "@/components/contact/ContactModal";
import { useCart } from "@/lib/cart";
import { CurrencyProvider } from "@/lib/currency";
import type { ChromeProps } from "../../types";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";
import { MobileTabBar } from "./MobileTabBar";
import { NavBar } from "./NavBar";
import { TopStrip } from "./TopStrip";

/** Every Adia page renders inside this — header + category bar, footer, mobile tab bar, cart drawer
 * and menu, plus the currency/contact context. Cart state itself lives at the app root. */
export function AdiaChrome({ children, ...shell }: ChromeProps) {
  return (
    <CurrencyProvider currency={shell.currency}>
      <ContactProvider contact={shell.theme.contact} fallbackPhone={shell.phone} variant="soft">
        <Inner {...shell}>{children}</Inner>
      </ContactProvider>
    </CurrencyProvider>
  );
}

function Inner({ children, storeName, address, phone, categories, theme, preview }: ChromeProps) {
  const cart = useCart();
  const dealsHref = theme.dealTile.ctaHref?.trim() || "/products";

  return (
    <>
      {preview ? (
        <div className="bg-accent-ink px-4 py-1.5 text-center text-[11px] font-semibold text-white">
          Preview · sample data — set DEV_STORE_DOMAIN to a live store
        </div>
      ) : null}

      <TopStrip announcement={theme.topBar.announcement} />

      <div className="z-40 shadow-[0_1px_0_var(--ui-line)] lg:sticky lg:top-0">
        <Header
          storeName={storeName}
          brand={theme.brand}
          favCount={cart.favourites.size}
          cartCount={cart.count}
          cartTotalCents={cart.totalCents}
          onCartClick={cart.openCart}
          onMenuClick={cart.openMenu}
        />
        <NavBar categories={categories} dealsHref={dealsHref} />
      </div>

      <main className="min-h-[50vh] pb-20 lg:pb-0">{children}</main>

      <Footer storeName={storeName} brand={theme.brand} address={address} phone={phone} categories={categories} />

      <MobileTabBar cartCount={cart.count} onCartClick={cart.openCart} />
      <CartDrawer
        open={cart.cartOpen}
        lines={cart.lines}
        onClose={cart.closeCart}
        onQty={cart.setQty}
        onRemove={cart.removeLine}
      />
      <MobileMenu
        open={cart.menuOpen}
        onClose={cart.closeMenu}
        storeName={storeName}
        brand={theme.brand}
        categories={categories}
        dealsHref={dealsHref}
      />
    </>
  );
}
