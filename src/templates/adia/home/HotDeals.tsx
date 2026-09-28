"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "@/components/shared/icons";
import { useMoney } from "@/lib/currency";
import type { TrylistTheme } from "@/lib/theme";
import { Container } from "../components/Container";
import { dealPercent } from "../deal";

/** End of the current week — Sunday 23:59:59 in the shopper's own clock. A weekly deal always
 * has a live countdown with no date for the shop owner to keep updating. */
function endOfWeek(now: Date): Date {
  const end = new Date(now);
  const daysToSunday = (7 - now.getDay()) % 7;
  end.setDate(now.getDate() + daysToSunday);
  end.setHours(23, 59, 59, 999);
  return end;
}

function useCountdown(): [number, number, number, number] | null {
  // null until mounted: the server can't know the shopper's clock, so render placeholders first
  // (no hydration mismatch), then tick every second.
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, endOfWeek(new Date()).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (left === null) return null;
  const s = Math.floor(left / 1000);
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
}

const UNITS = ["Days", "Hrs", "Mins", "Sec"];

/**
 * Wide rounded banner: title + subtitle + CTA, a live "ends in" countdown, and the deal image (or
 * a big % mark). Copy comes from the shop's deal content (themeJson.dealTile): the first line of
 * its title is the heading, any further lines the subtitle.
 */
export function HotDeals({ deal }: { deal: TrylistTheme["dealTile"] }) {
  const fmt = useMoney();
  const parts = (deal.title?.trim() || "Hot Deals\nBig savings for every home").split("\n");
  const title = parts[0].trim();
  const sub = parts.slice(1).join(" ").trim();
  const cta = { label: deal.ctaLabel?.trim() || "Shop Hot Deals", href: deal.ctaHref?.trim() || "/products" };
  const pct = dealPercent(deal);
  const time = useCountdown();

  return (
    <Container className="mt-10 lg:mt-12">
      <section className="relative isolate overflow-hidden rounded-2xl bg-[linear-gradient(110deg,var(--brand-primary-hover)_0%,var(--brand-primary)_60%)] px-6 py-7 lg:px-10 lg:py-8">
        <span aria-hidden="true" className="absolute -right-10 -bottom-24 -z-10 size-72 rounded-full bg-on-primary/[0.07]" />

        <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_auto] lg:gap-10">
          <div>
            <h2 className="font-display text-[28px] font-extrabold leading-tight text-on-primary lg:text-[36px]">{title}</h2>
            {sub ? <p className="mt-1 text-[14px] text-on-primary-soft lg:text-[16px]">{sub}</p> : null}
            {pct && typeof deal.offerPriceCents === "number" ? (
              <p className="mt-2 font-display text-[15px] font-semibold text-on-primary">
                From {fmt(deal.offerPriceCents)}{" "}
                <span className="rounded-md bg-surface px-1.5 py-0.5 text-[12px] font-bold text-primary-ink">-{pct}%</span>
              </p>
            ) : null}
            <Link
              href={cta.href}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-3 font-display text-[14px] font-semibold text-on-secondary transition-transform hover:-translate-y-0.5"
            >
              {cta.label} <FiArrowRight size={15} />
            </Link>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-on-primary-soft">Ends in</p>
            <div className="flex gap-2" aria-label="Deal countdown" role="timer">
              {UNITS.map((u, i) => (
                <div key={u} className="flex flex-col items-center gap-1">
                  <span className="grid size-14 place-items-center rounded-lg bg-secondary font-display text-[24px] font-bold tabular-nums text-on-secondary lg:size-16 lg:text-[28px]">
                    {time ? String(time[i]).padStart(2, "0") : "--"}
                  </span>
                  <span className="text-[11px] text-on-primary-soft">{u}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            {deal.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={deal.imageUrl} alt="" className="max-h-[160px] w-auto object-contain" />
            ) : (
              <span aria-hidden="true" className="font-display text-[150px] font-extrabold leading-none text-on-primary/25">
                %
              </span>
            )}
          </div>
        </div>
      </section>
    </Container>
  );
}
