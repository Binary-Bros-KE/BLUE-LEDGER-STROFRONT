"use client";

import { createContext, useContext, type ReactNode } from "react";
import { money } from "./money";

const CurrencyContext = createContext<string>("KSH");

export function CurrencyProvider({ currency, children }: { currency: string; children: ReactNode }) {
  return <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>;
}

/** Returns a `format(cents)` bound to the current store's currency code. */
export function useMoney(): (cents: number) => string {
  const currency = useContext(CurrencyContext);
  return (cents: number) => money(cents, currency);
}
