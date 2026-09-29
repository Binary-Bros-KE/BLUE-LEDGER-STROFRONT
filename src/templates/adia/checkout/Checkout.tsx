"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useContact } from "@/components/contact/ContactModal";
import { FiArrowRight, FiCheck, FiLock, FiMessageCircle, FiShoppingBag, FiShoppingCart, FiTrash2, FiTruck } from "@/components/shared/icons";
import { useCart } from "@/lib/cart";
import { useMoney } from "@/lib/currency";
import { usePlaceOrder } from "@/lib/use-place-order";
import type { CheckoutProps } from "../../types";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { QtyStepper } from "../components/CartDrawer";
import { Container } from "../components/Container";

// Remembered on this device only if the shopper ticks "save my details" — a per-viewer convenience.
const SAVED_KEY = "bl-checkout-details:v1";
type Saved = { name: string; phone: string; email: string; address: string };

function readSaved(): Saved | null {
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Saved>;
    return { name: v.name ?? "", phone: v.phone ?? "", email: v.email ?? "", address: v.address ?? "" };
  } catch {
    return null;
  }
}

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 lg:p-6">
      <h2 className="flex items-center gap-3 font-display text-[17px] font-bold text-ink">
        <span className="grid size-7 place-items-center rounded-full bg-primary font-display text-[13px] font-bold text-on-primary">
          {step}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink">
        {label} {optional ? <span className="font-normal text-ink-faint">(optional)</span> : <span className="text-primary-ink">*</span>}
      </span>
      {children}
      {error ? <span className="mt-1 block text-[12px] font-medium text-danger">{error}</span> : null}
    </label>
  );
}

const input = (bad: boolean) =>
  `h-11 w-full rounded-lg border bg-surface px-3.5 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-primary ${
    bad ? "border-danger" : "border-line-strong"
  }`;

export function Checkout({ methods }: CheckoutProps) {
  const fmt = useMoney();
  const { open: openContact } = useContact();
  const { lines, setQty, removeLine, hydrated } = useCart();
  const { submit, submitting, error, confirmation } = usePlaceOrder();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [save, setSave] = useState(true);
  const [deliveryId, setDeliveryId] = useState<string>(methods[0]?.id ?? "");
  // Picked by the shopper — no default, so nobody ends up with a delivery they didn't ask for.
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery" | null>(null);
  const delivering = deliveryType === "delivery";
  const [attempted, setAttempted] = useState(false);

  // Prefill from a previous order on this device (after mount — localStorage isn't on the server).
  useEffect(() => {
    const s = readSaved();
    if (!s) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(s.name);
    setPhone(s.phone);
    setEmail(s.email);
    setAddress(s.address);
  }, []);

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.unitPriceCents * l.qty, 0), [lines]);
  const method = delivering ? (methods.find((m) => m.id === deliveryId) ?? null) : null;
  const fee = method?.priceCents ?? 0;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const errors = {
    name: name.trim().length < 2 ? "Enter your full name" : null,
    phone: phone.replace(/\D/g, "").length < 9 ? "Enter a valid phone number" : null,
    email: email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "Enter a valid email" : null,
    deliveryType: !deliveryType ? "Choose pick up or delivery" : null,
    address: delivering && !address.trim() ? "Enter your delivery address" : null,
    delivery: delivering && methods.length > 0 && !method ? "Choose a delivery option" : null,
  };
  const valid = Object.values(errors).every((e) => !e);
  const show = (e: string | null) => (attempted ? e : null);

  async function placeOrder() {
    setAttempted(true);
    if (!valid || lines.length === 0 || !deliveryType) return;
    const ok = await submit({
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim() || null,
      deliveryType,
      deliveryAddress: delivering ? address.trim() : null,
      notes: notes.trim() || null,
      deliveryMethodId: method?.id ?? null,
    });
    if (ok) {
      try {
        if (save) window.localStorage.setItem(SAVED_KEY, JSON.stringify({ name, phone, email, address }));
        else window.localStorage.removeItem(SAVED_KEY);
      } catch {
        /* private mode — nothing to remember */
      }
    }
  }

  // ── thank you ────────────────────────────────────────────────────────────
  if (confirmation) {
    return (
      <Container className="py-10 lg:py-14">
        <div className="mx-auto max-w-[620px] rounded-2xl border border-line bg-surface p-6 text-center lg:p-10">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-success">
            <FiCheck size={32} strokeWidth={2.5} />
          </span>
          <h1 className="mt-5 font-display text-[26px] font-bold text-ink">Thank you — your order has been sent!</h1>
          <p className="mt-2 text-[15px] text-ink-muted">
            Your order number is{" "}
            <span className="font-display font-bold text-primary-ink">{confirmation.orderNumber}</span>
          </p>
          <p className="mx-auto mt-3 max-w-[440px] text-[14px] leading-relaxed text-ink-muted">
            The shop will contact you on <span className="font-semibold text-ink">{phone}</span> to confirm your order and agree
            on payment, then {confirmation.deliveryType === "pickup" ? "let you know when it's ready to pick up" : "arrange delivery"}.
          </p>

          <div className="mt-7 rounded-xl border border-line text-left">
            {confirmation.items.map((it) => (
              <div key={it.productId} className="flex items-start justify-between gap-4 border-b border-line px-4 py-3 last:border-b-0">
                <span className="line-clamp-2 text-[14px] text-ink">
                  {it.name} <span className="text-ink-faint">× {it.qty}</span>
                </span>
                <span className="flex-none font-display text-[14px] font-semibold text-ink">{fmt(it.lineTotalCents)}</span>
              </div>
            ))}
            <div className="space-y-1.5 bg-surface-alt px-4 py-3 text-[14px]">
              <div className="flex justify-between text-ink-muted">
                <span>Subtotal</span>
                <span>{fmt(confirmation.subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>{confirmation.deliveryType === "pickup" ? "Pick up from the shop" : "Delivery"}</span>
                <span>{confirmation.deliveryFeeCents ? fmt(confirmation.deliveryFeeCents) : confirmation.deliveryType === "pickup" ? "—" : "Free"}</span>
              </div>
              <div className="flex justify-between font-display text-[17px] font-bold text-ink">
                <span>Total</span>
                <span>{fmt(confirmation.totalCents)}</span>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display text-[14px] font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              Continue shopping <FiArrowRight size={15} />
            </Link>
            <button
              type="button"
              onClick={openContact}
              className="rounded-lg border-2 border-line-strong px-6 py-3 font-display text-[14px] font-semibold text-ink transition-colors hover:border-primary hover:text-primary-ink"
            >
              Contact the shop
            </button>
          </div>
        </div>
      </Container>
    );
  }

  if (!hydrated) {
    return (
      <Container className="py-10">
        <div className="h-[420px] animate-pulse rounded-2xl bg-surface-alt" />
      </Container>
    );
  }

  if (lines.length === 0) {
    return (
      <Container className="py-14">
        <div className="mx-auto flex max-w-[460px] flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-14 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary-soft text-primary-ink">
            <FiShoppingCart size={26} />
          </span>
          <p className="font-display text-[18px] font-bold text-ink">Your cart is empty</p>
          <p className="text-[14px] text-ink-muted">Add some products to check out.</p>
          <Link
            href="/products"
            className="mt-2 rounded-lg bg-primary px-6 py-3 font-display text-[14px] font-semibold text-on-primary hover:bg-primary-hover"
          >
            Browse products
          </Link>
        </div>
      </Container>
    );
  }

  // ── checkout ─────────────────────────────────────────────────────────────
  return (
    <Container className="pt-5 pb-10 lg:pt-6">
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />
      <h1 className="mt-3 font-display text-[24px] font-bold text-ink lg:text-[28px]">Checkout</h1>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
        <div className="flex flex-col gap-5">
          <Section step={1} title="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={show(errors.name)}>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your full name" className={input(Boolean(show(errors.name)))} />
              </Field>
              <Field label="Phone number" error={show(errors.phone)}>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="07XX XXX XXX" className={input(Boolean(show(errors.phone)))} />
              </Field>
              <Field label="Email" optional error={show(errors.email)}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="you@example.com" className={input(Boolean(show(errors.email)))} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Order notes" optional>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Anything the shop should know — landmarks, best time to call…"
                    className={`${input(false)} h-auto py-2.5`}
                  />
                </Field>
              </div>
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-[14px] text-ink">
              <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} className="size-4 accent-[var(--brand-primary)]" />
              Save my details on this device for next time
            </label>
          </Section>

          <Section step={2} title="Pick up or delivery">
            <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Pick up or delivery">
              {(
                [
                  { id: "pickup", label: "Pick up from the shop", note: "Collect it yourself — no delivery fee", icon: <FiShoppingBag size={20} /> },
                  { id: "delivery", label: "Deliver to me", note: "We bring it to your address", icon: <FiTruck size={20} /> },
                ] as const
              ).map((opt) => {
                const active = deliveryType === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-colors ${
                      active ? "border-primary bg-primary-soft" : show(errors.deliveryType) ? "border-danger" : "border-line hover:border-line-strong"
                    }`}
                  >
                    <input type="radio" name="delivery-type" checked={active} onChange={() => setDeliveryType(opt.id)} className="size-4 accent-[var(--brand-primary)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-ink">{opt.label}</span>
                      <span className="block text-[13px] text-ink-muted">{opt.note}</span>
                    </span>
                    <span className="flex-none text-primary-ink">{opt.icon}</span>
                  </label>
                );
              })}
            </div>
            {show(errors.deliveryType) ? <span className="mt-1.5 block text-[12px] font-medium text-danger">{errors.deliveryType}</span> : null}

            {delivering ? (
              <div className="mt-5 flex flex-col gap-4">
                <Field label="Delivery address" error={show(errors.address)}>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="street-address"
                    rows={2}
                    placeholder="Estate / building, street, town"
                    className={`${input(Boolean(show(errors.address)))} h-auto py-2.5`}
                  />
                </Field>
            {methods.length === 0 ? (
              <p className="flex items-start gap-2.5 rounded-lg bg-surface-alt px-4 py-3 text-[14px] text-ink-muted">
                <FiTruck size={18} className="mt-0.5 flex-none text-primary-ink" />
                The shop will contact you to agree the delivery cost and time.
              </p>
            ) : (
              <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Delivery option">
                {methods.map((m) => {
                  const active = m.id === deliveryId;
                  return (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-colors ${
                        active ? "border-primary bg-primary-soft" : "border-line hover:border-line-strong"
                      }`}
                    >
                      <input type="radio" name="delivery" checked={active} onChange={() => setDeliveryId(m.id)} className="size-4 accent-[var(--brand-primary)]" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-semibold text-ink">{m.name}</span>
                        {m.description ? <span className="block text-[13px] text-ink-muted">{m.description}</span> : null}
                      </span>
                      <span className="flex-none font-display text-[14px] font-bold text-ink">{m.priceCents ? fmt(m.priceCents) : "Free"}</span>
                    </label>
                  );
                })}
                {show(errors.delivery) ? <span className="text-[12px] font-medium text-danger">{errors.delivery}</span> : null}
              </div>
            )}
              </div>
            ) : null}
          </Section>

          <Section step={3} title="What happens next">
            <div className="flex items-start gap-3 rounded-xl bg-surface-alt px-4 py-3.5">
              <FiMessageCircle size={20} className="mt-0.5 flex-none text-primary-ink" />
              <p className="text-[14px] leading-relaxed text-ink-muted">
                <span className="font-semibold text-ink">No payment is taken on this website.</span>{" "}
                Send your order and the
                shop will contact you to confirm it and agree on payment. Once that&rsquo;s settled, your order is
                {deliveryType === "pickup" ? " made ready for you to pick up." : deliveryType === "delivery" ? " dispatched to you." : " made ready for pick up or dispatched."}
              </p>
            </div>
          </Section>
        </div>

        {/* summary */}
        <aside className="h-fit rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-[140px] lg:p-6">
          <h2 className="font-display text-[17px] font-bold text-ink">
            Order summary <span className="text-[14px] font-medium text-ink-muted">({count} {count === 1 ? "item" : "items"})</span>
          </h2>
          <div className="mt-3 max-h-[340px] overflow-y-auto">
            {lines.map((l) => (
              <div key={l.id} className="flex gap-3 border-b border-line py-3 last:border-b-0">
                <span className="size-14 flex-none overflow-hidden rounded-lg border border-line bg-surface">
                  {l.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.image} alt="" className="size-full object-contain p-1" />
                  ) : null}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[13px] leading-snug text-ink">{l.name}</p>
                      {l.spec ? <p className="mt-0.5 text-[12px] text-ink-muted">{l.spec}</p> : null}
                    </div>
                    <button type="button" onClick={() => removeLine(l.id)} aria-label={`Remove ${l.name}`} className="flex-none text-ink-faint hover:text-danger">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <QtyStepper qty={l.qty} onChange={(q) => setQty(l.id, q)} />
                    <span className="font-display text-[14px] font-bold text-ink">{fmt(l.unitPriceCents * l.qty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2 border-t border-line pt-4 text-[14px]">
            <div className="flex justify-between text-ink-muted">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>{deliveryType === "pickup" ? "Pick up from the shop" : "Delivery"}</span>
              <span>
                {deliveryType === "pickup" ? "—" : !delivering ? "—" : methods.length === 0 ? "To be agreed" : fee ? fmt(fee) : "Free"}
              </span>
            </div>
            <div className="flex justify-between pt-1 font-display text-[19px] font-bold text-ink">
              <span>Total</span>
              <span>{fmt(subtotal + fee)}</span>
            </div>
          </div>

          {error ? (
            <p role="alert" className="mt-4 rounded-lg bg-danger/10 px-3 py-2.5 text-[13px] font-medium text-danger">
              {error}
            </p>
          ) : null}
          {attempted && !valid ? (
            <p className="mt-4 text-[13px] font-medium text-danger">Please complete the highlighted details.</p>
          ) : null}

          <button
            type="button"
            onClick={() => void placeOrder()}
            disabled={submitting}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-display text-[15px] font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? "Sending your order…" : "Send Order"}
            {!submitting ? <FiArrowRight size={16} /> : null}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-ink-faint">
            <FiLock size={12} /> Your details are only shared with the shop
          </p>
        </aside>
      </div>
    </Container>
  );
}
