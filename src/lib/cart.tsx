"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine, Product } from "./products";

// Cart survives a full page reload via localStorage (per-origin = per-tenant automatically). Read
// AFTER mount, not in the initial state, so the server-rendered HTML and the client's first render
// agree (no hydration mismatch); the cart then "pops in" a frame later.
const STORAGE_KEY = "bl-cart:v1";

function readStoredLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        Boolean(l) &&
        typeof (l as CartLine).id === "string" &&
        typeof (l as CartLine).name === "string" &&
        typeof (l as CartLine).unitPriceCents === "number" &&
        typeof (l as CartLine).qty === "number",
    );
  } catch {
    return [];
  }
}

type CartContextValue = {
  lines: CartLine[];
  favourites: Set<string>;
  count: number;
  totalCents: number;
  /** false until the localStorage read has run (first client paint) — pages that branch on an
   * empty cart should wait for this to avoid flashing "cart is empty" before hydration. */
  hydrated: boolean;
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
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once, after mount (see readStoredLines' comment on why not in state init).
  useEffect(() => {
    const stored = readStoredLines();
    if (stored.length > 0) setLines(stored);
    setHydrated(true);
  }, []);

  // Persist on every change — but not the initial empty state before hydration has run, or we'd
  // wipe a stored cart on first mount.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* private mode / quota — cart just won't persist across reloads */
    }
  }, [hydrated, lines]);

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
    hydrated,
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
