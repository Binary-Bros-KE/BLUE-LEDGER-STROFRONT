"use client";

import { useState } from "react";
import { useCart } from "./cart";
import type { OrderConfirmation, OrderRequest } from "./types";

export type CheckoutDetails = Omit<OrderRequest, "items" | "paymentMethod">;

/**
 * Submits the cart as an order (via the same-origin /api/orders relay) — shared by every template's
 * checkout. On success the cart is cleared and the SERVER's own confirmation (order number +
 * authoritative totals) is returned for the thank-you screen.
 */
export function usePlaceOrder() {
  const { lines, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  async function submit(details: CheckoutDetails): Promise<boolean> {
    if (submitting) return false;
    setSubmitting(true);
    setError(null);
    try {
      const body: OrderRequest = {
        ...details,
        paymentMethod: "pay_on_delivery",
        items: lines.map((l) => ({ productId: l.id, qty: l.qty })),
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => null)) as (OrderConfirmation & { error?: string }) | null;
      if (!res.ok || !json || !json.orderNumber) {
        setError(json?.error ?? "We couldn't place your order. Please try again.");
        return false;
      }
      setConfirmation(json);
      clearCart();
      return true;
    } catch {
      setError("You appear to be offline. Check your connection and try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return { submit, submitting, error, confirmation };
}
