"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import type { AdiaHome } from "../content";
import { Container } from "../components/Container";
import { ProductGrid } from "./ProductGrid";
import { SectionHead } from "./SectionHead";

/** The shop's own end date when set and still ahead, else the end of this week (Sunday night) —
 * so there's always a live countdown without anyone having to keep a date updated. */
function deadline(endsAt: string | undefined, now: Date): Date {
  const set = endsAt ? new Date(endsAt) : null;
  if (set && !Number.isNaN(set.getTime()) && set.getTime() > now.getTime()) return set;
  const end = new Date(now);
  end.setDate(now.getDate() + ((7 - now.getDay()) % 7));
  end.setHours(23, 59, 59, 999);
  return end;
}

function useCountdown(endsAt: string | undefined): number[] | null {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, deadline(endsAt, new Date()).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  if (left === null) return null;
  const s = Math.floor(left / 1000);
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
}

const UNITS = ["Days", "Hours", "Mins", "Secs"];

/** Full-width red band: 🔥 title + subtitle, a live countdown, "View all deals", then 12 products. */
export function HotDealsBand({ row, products, href }: { row: AdiaHome["hotDeals"]; products: Product[]; href: string }) {
  const time = useCountdown(row.endsAt);
  if (!row.enabled || products.length === 0) return null;

  return (
    <section
      id="hot-deals"
      className="relative isolate mt-14 overflow-hidden bg-[linear-gradient(120deg,var(--brand-primary-hover)_0%,var(--brand-primary)_55%,var(--brand-primary-hover)_100%)] py-10 lg:mt-20 lg:py-14"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px]" />
      <div aria-hidden="true" className="absolute -top-32 -left-32 -z-10 size-96 rounded-full bg-white/[0.06]" />
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0 flex-1">
            <SectionHead title={`🔥 ${row.title}`} subtitle={row.subtitle} inverse />
          </div>
          <div className="mb-5 flex items-end gap-4 lg:mb-6">
            <div className="flex gap-2" role="timer" aria-label="Deals end in">
              {UNITS.map((u, i) => (
                <div key={u} className="flex flex-col items-center gap-1">
                  <span className="grid size-12 place-items-center rounded-lg bg-white font-display text-[20px] font-bold tabular-nums text-primary-ink shadow-md lg:size-14 lg:text-[24px]">
                    {time ? String(time[i]).padStart(2, "0") : "--"}
                  </span>
                  <span className="text-[11px] font-medium text-on-primary-soft">{u}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ProductGrid products={products} />
        <div className="mt-6 flex justify-center">
          <Link
            href={href}
            className="rounded-lg border-2 border-on-primary/70 px-6 py-2.5 font-display text-[14px] font-semibold text-on-primary transition-colors hover:bg-on-primary/10"
          >
            {row.ctaLabel} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
