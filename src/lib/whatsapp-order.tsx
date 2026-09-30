"use client";

// "Order on WhatsApp": builds a ready-to-send order message (one product, or the whole cart) and a
// wa.me link to the shop's WhatsApp. The shop's number comes from the chrome (WhatsAppOrderProvider);
// with no number set, useWhatsAppOrder().enabled is false and every button hides itself.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { whatsappLink } from "@/lib/contact-links";
import type { CartLine } from "@/lib/products";

const Ctx = createContext<string | null>(null);

export function WhatsAppOrderProvider({ number, children }: { number: string | null | undefined; children: ReactNode }) {
  const digits = number?.replace(/[^\d]/g, "") ?? "";
  return <Ctx.Provider value={digits.length >= 9 ? (number as string) : null}>{children}</Ctx.Provider>;
}

/** The shop's WhatsApp number + this site's origin (for product links in the message). */
export function useWhatsAppOrder(): { enabled: boolean; link: (message: string) => string; origin: string } {
  const number = useContext(Ctx);
  // window only exists after mount — links built before then just go out without the page URL
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return {
    enabled: number !== null,
    link: (message) => (number ? whatsappLink(number, message) : "#"),
    origin,
  };
}

const CLOSING = "Please let me know about availability and delivery details.";

/** One product (product page / product card). `options` = chosen variant values, e.g. { Color: "Orange" }. */
export function productOrderMessage(p: {
  name: string;
  price: string;
  options?: Record<string, string> | undefined;
  qty?: number | undefined;
  url?: string | undefined;
}): string {
  const lines = ["Hi! I'm interested in ordering:", `Product: ${p.name}`];
  for (const [option, value] of Object.entries(p.options ?? {})) if (value) lines.push(`${option}: ${value}`);
  if (p.qty && p.qty > 1) lines.push(`Quantity: ${p.qty}`);
  lines.push(`Price: ${p.price}`);
  if (p.url) lines.push(`Link: ${p.url}`);
  return [...lines, "", CLOSING].join("\n");
}

/** Every cart line + total (cart drawer / checkout). `details` = whatever the shopper already typed
 * at checkout — blank fields are left out. */
export function cartOrderMessage(
  cart: CartLine[],
  fmt: (cents: number) => string,
  opts: {
    totalCents?: number | undefined;
    details?: { name?: string; phone?: string; fulfilment?: string; address?: string; notes?: string } | undefined;
  } = {},
): string {
  const lines = ["Hi! I'd like to order the following:", ""];
  cart.forEach((l, i) => {
    lines.push(`${i + 1}. ${l.name}${l.spec ? ` (${l.spec})` : ""}`);
    lines.push(`   Qty: ${l.qty} × ${fmt(l.unitPriceCents)} = ${fmt(l.unitPriceCents * l.qty)}`);
  });
  const total = opts.totalCents ?? cart.reduce((s, l) => s + l.unitPriceCents * l.qty, 0);
  lines.push("", `Total: ${fmt(total)}`);

  const d = opts.details ?? {};
  const extra = [
    d.name?.trim() ? `Name: ${d.name.trim()}` : null,
    d.phone?.trim() ? `Phone: ${d.phone.trim()}` : null,
    d.fulfilment ? `Delivery: ${d.fulfilment}` : null,
    d.address?.trim() ? `Address: ${d.address.trim()}` : null,
    d.notes?.trim() ? `Notes: ${d.notes.trim()}` : null,
  ].filter((x): x is string => x !== null);
  if (extra.length) lines.push("", ...extra);
  return [...lines, "", CLOSING].join("\n");
}
