import type { ReactNode } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHead } from "@/components/shared/SectionHead";
import { Diamond, FiGrid } from "@/components/shared/icons";

type Ground = "navy" | "white" | "amber";

type Tile = {
  ground: Ground;
  mark: ReactNode;
  eyebrowTone: string;
  eyebrow: string;
  title: string;
  mobileTitle?: string;
  body: string;
  /** grid order below md, so the mobile sequence is navy → amber → white (spec §4) */
  mobileOrder: string;
  mobileHidden?: boolean;
};

const TILES: Tile[] = [
  {
    ground: "navy",
    mark: <Diamond size={9} />,
    eyebrowTone: "text-amber",
    eyebrow: "Same-day dispatch",
    title: "Ordered by 2pm, on the road by 4.",
    body: "Nairobi deliveries land same day. Upcountry riders and couriers leave every morning.",
    mobileOrder: "order-1",
  },
  {
    ground: "white",
    mark: <Diamond size={9} />,
    eyebrowTone: "text-red",
    eyebrow: "Real warranty",
    title: "12 months, and a loaner while we fix it.",
    mobileTitle: "12 months, plus a loaner unit.",
    body: "In-house bench repairs. You keep selling on a standby unit at no charge.",
    mobileOrder: "order-3",
  },
  {
    ground: "amber",
    mark: <FiGrid size={10} />,
    eyebrowTone: "text-amber-dim",
    eyebrow: "POS-ready stock",
    title: "Tested against Blue Ledger before it ships.",
    mobileTitle: "Bench-tested before it ships.",
    body: "Every printer, scanner and drawer we sell is bench-tested with the POS you'll run it on.",
    mobileOrder: "order-2",
  },
  {
    ground: "white",
    mark: <Diamond size={9} />,
    eyebrowTone: "text-green",
    eyebrow: "Flexible payment",
    title: "M-Pesa, card, or 30-day terms.",
    body: "Registered businesses buy on invoice. Everyone else checks out in two taps.",
    mobileOrder: "order-4",
    mobileHidden: true,
  },
];

const GROUND: Record<Ground, { box: string; heading: string; body: string }> = {
  navy: { box: "bg-navy", heading: "text-ink-on-navy", body: "text-body-on-navy" },
  white: { box: "bg-white border border-line", heading: "text-navy", body: "text-slate" },
  amber: { box: "bg-amber", heading: "text-navy", body: "text-navy/75" },
};

export function Features() {
  return (
    <section className="bg-cream py-[60px]">
      <Container>
        <SectionHead index="03" eyebrow="Why Trylist" title="Hardware is easy. Support is the product." />

        <div className="mt-9 grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:grid-cols-4">
          {TILES.map((t) => {
            const g = GROUND[t.ground];
            return (
              <div
                key={t.eyebrow}
                className={`flex min-h-[196px] flex-col gap-3 p-6 ${g.box} ${t.mobileOrder} md:order-none ${
                  t.mobileHidden ? "hidden md:flex" : ""
                }`}
              >
                <span className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1.6px] ${t.eyebrowTone}`}>
                  {t.mark}
                  {t.eyebrow}
                </span>
                <h3 className={`font-sans text-[20px] font-black leading-[1.15] ${g.heading}`}>
                  <span className="md:hidden">{t.mobileTitle ?? t.title}</span>
                  <span className="hidden md:inline">{t.title}</span>
                </h3>
                <p className={`font-mono text-[11px] leading-[1.65] ${g.body}`}>{t.body}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
