"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart";

/**
 * Mounts the cart provider ONCE at the app root (app/layout.tsx) so the cart survives client-side
 * navigation between pages — each page's <StoreChrome> used to mount its own provider, which reset
 * the in-memory cart to empty on every route change (e.g. going to /checkout). Persistence across
 * a full reload is handled inside CartProvider via localStorage.
 */
export function CartRoot({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
