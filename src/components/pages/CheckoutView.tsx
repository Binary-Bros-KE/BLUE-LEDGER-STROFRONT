"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Placeholder } from "@/components/shared/Placeholder";
import { FiArrowRight, FiCreditCard, FiPlay, FiShoppingCart, FiX } from "@/components/shared/icons";
import { QtyStepper } from "@/components/cart/QtyStepper";
import { useCart } from "@/lib/cart";
import { useMoney } from "@/lib/currency";
import type { DeliveryOption } from "@/lib/types";

// Single-page checkout (spec §4 aesthetic — zero radius, mono labels, one amber offset block on the
// primary CTA). Guest only for now: name + phone, a delivery option (admin-defined), a payment
// choice (visual only), an order summary, Complete order.
//
// Payment + order submission are NOT wired yet — "Complete order" shows a confirmation and nothing
// is persisted. The delivery options ARE real (GET /shop/delivery). See ECOMMERCE-ARCHITECTURE.md.

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-slate">
      {children}
    </span>
  );
}

const inputClass =
  "h-11 w-full border-[1.5px] border-navy bg-white px-3 font-mono text-[13px] text-navy outline-none placeholder:text-slate focus:border-blue";

export function CheckoutView({ methods }: { methods: DeliveryOption[] }) {
  const fmt = useMoney();
  const { lines, setQty, removeLine, hydrated } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryId, setDeliveryId] = useState<string>(methods[0]?.id ?? "");
  const [payment, setPayment] = useState<"mpesa" | "card">("mpesa");
  const [attempted, setAttempted] = useState(false);
  const [placed, setPlaced] = useState<{ name: string; phone: string } | null>(null);

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.unitPriceCents * l.qty, 0), [lines]);
  const method = methods.find((m) => m.id === deliveryId) ?? null;
  const deliveryFee = method?.priceCents ?? 0;
  const total = subtotal + deliveryFee;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const nameOk = name.trim().length > 1;
  const phoneOk = phone.trim().replace(/\D/g, "").length >= 9;
  const deliveryOk = methods.length === 0 || Boolean(method);
  const canPlace = nameOk && phoneOk && deliveryOk && lines.length > 0;

  function placeOrder() {
    setAttempted(true);
    if (!canPlace) return;
    setPlaced({ name: name.trim(), phone: phone.trim() });
  }

  // ── confirmation ──────────────────────────────────────────────────────────
  if (placed) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-[560px] border-[1.5px] border-navy bg-white p-8 text-center shadow-[6px_6px_0_var(--color-amber)]">
          <div className="mx-auto grid size-12 place-items-center bg-green text-[22px] font-black text-white">
            ✓
          </div>
          <h1 className="mt-5 font-sans text-[26px] font-black leading-tight tracking-[-0.5px] text-navy">
            Order received
          </h1>
          <p className="mt-3 font-mono text-[12px] leading-[1.7] text-slate">
            Thanks, {placed.name.split(" ")[0]}. We&apos;ll call you on{" "}
            <span className="text-navy">{placed.phone}</span> to confirm and arrange{" "}
            {method ? method.name.toLowerCase() : "delivery"} and payment.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[1.4px] text-slate">
            Order total {fmt(total)}
          </p>
          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 border-[1.5px] border-navy px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Keep shopping <FiArrowRight size={13} />
          </Link>
        </div>
      </Container>
    );
  }

  // ── waiting on the localStorage read (first client paint) ─────────────────
  if (!hydrated) {
    return (
      <Container className="py-16">
        <div className="mx-auto h-[220px] max-w-[460px] animate-pulse border border-line bg-cream/40" />
      </Container>
    );
  }

  // ── empty cart ────────────────────────────────────────────────────────────
  if (lines.length === 0) {
    return (
      <Container className="py-16">
        <div className="mx-auto flex max-w-[460px] flex-col items-center gap-3 border border-dashed border-line py-16 text-center">
          <FiShoppingCart size={22} className="text-slate" />
          <p className="font-sans text-[18px] font-black text-navy">Your cart is empty</p>
          <Link
            href="/products"
            className="mt-1 border-b-[1.5px] border-blue pb-0.5 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-blue"
          >
            Browse products
          </Link>
        </div>
      </Container>
    );
  }

  const invalid = (bad: boolean) => (attempted && bad ? "border-red" : "");

  return (
    <Container className="py-10 lg:py-14">
      <h1 className="font-sans text-[30px] font-black leading-none tracking-[-1px] text-navy lg:text-[38px]">
        Checkout
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* ── form column ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-9">
          {/* contact */}
          <section>
            <h2 className="font-mono text-[12px] font-bold uppercase tracking-[2px] text-navy">
              1 · Your details
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <Label>Full name</Label>
                <input
                  className={`${inputClass} ${invalid(!nameOk)}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Wanjiru"
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <Label>Phone</Label>
                <input
                  className={`${inputClass} ${invalid(!phoneOk)}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </label>
            </div>
          </section>

          {/* delivery */}
          <section>
            <h2 className="font-mono text-[12px] font-bold uppercase tracking-[2px] text-navy">
              2 · Delivery
            </h2>

            {methods.length === 0 ? (
              <p className="mt-4 border border-dashed border-line px-4 py-4 font-mono text-[11px] uppercase tracking-[1.2px] text-slate">
                No delivery options set up yet — the shop will arrange this with you by phone.
              </p>
            ) : (
              <div className={`mt-4 border-[1.5px] ${invalid(!deliveryOk)}`}>
                {methods.map((m, i) => {
                  const active = m.id === deliveryId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setDeliveryId(m.id)}
                      className={`flex w-full items-start gap-3 border-navy px-4 py-3.5 text-left transition-colors ${
                        i > 0 ? "border-t-[1.5px]" : ""
                      } ${active ? "bg-cream" : "bg-white hover:bg-cream/50"}`}
                    >
                      <span
                        className={`mt-0.5 grid size-4 flex-none place-items-center border-[1.5px] border-navy ${
                          active ? "bg-blue" : "bg-white"
                        }`}
                      >
                        {active ? <span className="size-1.5 bg-white" /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-sans text-[13px] font-extrabold text-navy">{m.name}</span>
                        {m.description ? (
                          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[1px] text-slate">
                            {m.description}
                          </span>
                        ) : null}
                      </span>
                      <span className="flex-none font-sans text-[13px] font-black text-navy">
                        {m.priceCents === 0 ? "FREE" : fmt(m.priceCents)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <label className="mt-4 block">
              <Label>Delivery address / landmark (optional)</Label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Building, street, floor, anything that helps the rider find you"
                className="w-full resize-none border-[1.5px] border-navy bg-white p-3 font-mono text-[13px] text-navy outline-none placeholder:text-slate focus:border-blue"
              />
            </label>
          </section>

          {/* payment */}
          <section>
            <h2 className="font-mono text-[12px] font-bold uppercase tracking-[2px] text-navy">
              3 · Payment
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { id: "mpesa", label: "M-Pesa", note: "Pay on confirmation" },
                  { id: "card", label: "Card", note: "Pay on confirmation" }
                ] as const
              ).map((opt) => {
                const active = payment === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPayment(opt.id)}
                    className={`flex items-center gap-3 border-[1.5px] border-navy px-4 py-3.5 text-left transition-colors ${
                      active ? "bg-cream" : "bg-white hover:bg-cream/50"
                    }`}
                  >
                    <FiCreditCard size={16} className="flex-none text-navy" />
                    <span className="flex-1">
                      <span className="block font-sans text-[13px] font-extrabold text-navy">{opt.label}</span>
                      <span className="block font-mono text-[10px] uppercase tracking-[1px] text-slate">
                        {opt.note}
                      </span>
                    </span>
                    <span
                      className={`grid size-4 flex-none place-items-center border-[1.5px] border-navy ${
                        active ? "bg-blue" : "bg-white"
                      }`}
                    >
                      {active ? <span className="size-1.5 bg-white" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[1.2px] text-slate">
              Online payment is coming soon — for now the shop confirms your order and takes payment
              directly.
            </p>
          </section>
        </div>

        {/* ── order summary ──────────────────────────────────────────────── */}
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <div className="border-[1.5px] border-navy">
            <div className="flex items-center justify-between bg-navy px-4 py-3">
              <span className="font-mono text-[11px] uppercase tracking-[1.6px] text-amber">Your order</span>
              <span className="font-mono text-[11px] uppercase tracking-[1.4px] text-white">
                {count} {count === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="max-h-[46vh] overflow-y-auto px-4">
              {lines.map((line) => (
                <div key={line.id} className="flex gap-3 border-b border-cream py-3 last:border-b-0">
                  {line.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={line.image} alt="" className="size-12 flex-none border border-line object-cover" />
                  ) : (
                    <Placeholder caption="[ IMG ]" className="size-12 flex-none border border-line" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="line-clamp-2 font-sans text-[12px] font-extrabold leading-snug text-navy">
                        {line.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        aria-label={`Remove ${line.name}`}
                        className="flex-none text-slate transition-colors hover:text-navy"
                      >
                        <FiX size={13} />
                      </button>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <QtyStepper
                        qty={line.qty}
                        onDec={() => setQty(line.id, line.qty - 1)}
                        onInc={() => setQty(line.id, line.qty + 1)}
                      />
                      <span className="font-sans text-[13px] font-black text-navy">
                        {fmt(line.unitPriceCents * line.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 bg-cream px-4 py-3">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[1px] text-slate">
                <span>Subtotal</span>
                <span className="text-navy">{fmt(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[1px] text-slate">
                <span>Delivery{method ? ` · ${method.name}` : ""}</span>
                <span className={deliveryFee === 0 ? "text-green" : "text-navy"}>
                  {method ? (deliveryFee === 0 ? "FREE" : fmt(deliveryFee)) : "—"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-cream-line pt-2">
                <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-navy">Total</span>
                <span className="font-sans text-[20px] font-black leading-none text-navy">{fmt(total)}</span>
              </div>
            </div>

            <div className="p-4">
              <button
                type="button"
                onClick={placeOrder}
                className="blk flex w-full items-center justify-center gap-2 bg-blue py-3.5 font-mono text-[12px] font-bold uppercase tracking-[1.6px] text-white"
              >
                <FiPlay size={11} /> Complete order
              </button>
              {attempted && !canPlace ? (
                <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[1.2px] text-red">
                  {!nameOk || !phoneOk
                    ? "Enter your name and phone"
                    : !deliveryOk
                      ? "Choose a delivery option"
                      : "Your cart is empty"}
                </p>
              ) : null}
              <Link
                href="/products"
                className="mt-2 block text-center font-mono text-[10px] uppercase tracking-[1.4px] text-blue"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
