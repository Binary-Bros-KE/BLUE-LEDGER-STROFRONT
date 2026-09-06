"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartLine, Product } from "./products";

type CartContextValue = {
  lines: CartLine[];
  favourites: Set<string>;
  count: number;
  totalCents: number;
  cartOpen: boolean;
  menuOpen: boolean;
  addToCart: (product: Product, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  toggleFavourite: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  openMenu: () => void;
  closeMenu: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Cart + favourites + drawer/menu open-state, shared across every page via <StoreChrome>.
 * Starts empty always — real items come from the shopper adding products. All in-memory for now
 * (spec §0/§6); persistence and a real checkout are the next milestone.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [favourites, setFavourites] = useState<Set<string>>(() => new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);
  const totalCents = useMemo(() => lines.reduce((sum, l) => sum + l.unitPriceCents * l.qty, 0), [lines]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    if (product.stockState === "out_of_stock" || qty < 1) return;
    setLines((prev) => {
      const existing = prev.find((l) => l.id === product.id);
      if (existing) return prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + qty } : l));
      return [
        ...prev,
        {
          id: product.id,
          name: product.name.split(" — ")[0],
          image: product.images?.[0],
          unitPriceCents: product.priceCents,
          qty,
        },
      ];
    });
    // Deliberately does NOT open the cart — the product card gives its own inline "Added!"
    // confirmation. The shopper opens the cart when they're ready.
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const value: CartContextValue = {
    lines,
    favourites,
    count,
    totalCents,
    cartOpen,
    menuOpen,
    addToCart,
    setQty,
    removeLine,
    toggleFavourite,
    openCart,
    closeCart,
    openMenu,
    closeMenu,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
