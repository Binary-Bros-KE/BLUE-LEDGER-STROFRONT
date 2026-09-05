"use client";

import { useCallback, useMemo, useState } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductGrid } from "@/components/home/ProductGrid";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryRibbon } from "@/components/layout/CategoryRibbon";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { TopBar } from "@/components/layout/TopBar";
import { CurrencyProvider } from "@/lib/currency";
import type { CartLine, Category, Product } from "@/lib/products";

export type StorefrontData = {
  storeName: string;
  currency: string;
  address?: string | null;
  phone?: string | null;
  products: Product[];
  categories: Category[];
  /** true when no live store resolved and we're showing the Trylist sample set */
  preview?: boolean;
};

/**
 * The "Classic" theme home page. Data comes in as props (real, from SERVER `/shop` — see
 * src/app/page.tsx). UI state is local (spec §0/§6): cart drawer, mobile menu, favourites, cart
 * line quantities. Nothing here fetches.
 */
export function ClassicStorefront({
  storeName,
  currency,
  address,
  phone,
  products,
  categories,
  preview = false,
}: StorefrontData) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favourites, setFavourites] = useState<Set<string>>(() => new Set());
  // A real store starts with an empty cart. In preview mode, seed the 3-line sample so the cart
  // drawer can be eyeballed against the reference.
  const [lines, setLines] = useState<CartLine[]>(() =>
    preview
      ? products.slice(0, 3).map((p, i) => ({
          id: p.id,
          name: p.name.split(" — ")[0],
          unitPriceCents: p.priceCents,
          qty: i === 1 ? 2 : 1,
        }))
      : [],
  );

  const cartCount = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);
  const cartTotal = useMemo(() => lines.reduce((sum, l) => sum + l.unitPriceCents * l.qty, 0), [lines]);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const addToCart = useCallback(
    (id: string) => {
      const product = products.find((p) => p.id === id);
      if (!product || product.stockState === "out_of_stock") return;
      setLines((prev) => {
        const existing = prev.find((l) => l.id === id);
        if (existing) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
        return [
          ...prev,
          { id, name: product.name.split(" — ")[0], unitPriceCents: product.priceCents, qty: 1 },
        ];
      });
      setCartOpen(true);
    },
    [products],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return (
    <CurrencyProvider currency={currency}>
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
          favCount={favourites.size}
          cartCount={cartCount}
          cartTotalCents={cartTotal}
          onCartClick={() => setCartOpen(true)}
          onMenuClick={() => setMenuOpen(true)}
          onFavClick={() => undefined}
        />
        <CategoryRibbon />
      </div>

      <main className="pb-16 lg:pb-0">
        <Hero />
        <TrustBar />
        <CategoryGrid categories={categories} />
        <ProductGrid
          products={products}
          favourites={favourites}
          onToggleFavourite={toggleFavourite}
          onAddToCart={addToCart}
        />
        <Features />
        <Newsletter />
      </main>

      <Footer storeName={storeName} address={address} phone={phone} />

      <MobileTabBar favCount={favourites.size} cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <CartDrawer open={cartOpen} lines={lines} onClose={() => setCartOpen(false)} onQty={setQty} onRemove={removeLine} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} storeName={storeName} />
    </CurrencyProvider>
  );
}
