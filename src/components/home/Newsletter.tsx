"use client";

import { Container } from "@/components/shared/Container";
import { Diamond } from "@/components/shared/icons";

// Spec §4 — white, 52px 40px, bottom hairline. Input (1.5px navy, no right border) + navy
// SUBSCRIBE block with the amber offset shadow.
export function Newsletter() {
  return (
    <section className="border-b border-line bg-white py-[52px]">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[2px] text-blue">
              <Diamond size={9} /> Stock alerts
            </span>
            <h2 className="mt-2 font-sans text-[24px] font-black leading-[1.05] tracking-[-0.8px] text-navy md:text-[30px]">
              Know when the good stuff lands.
            </h2>
            <p className="mt-3 font-mono text-[12px] text-slate">
              One email a week: new arrivals, price drops, clearance. No noise.
            </p>
          </div>

          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@business.co.ke"
              aria-label="Email address"
              className="h-[52px] w-full max-w-[320px] border-[1.5px] border-r-0 border-navy bg-white px-4 font-mono text-[13px] text-navy outline-none placeholder:text-slate lg:w-[320px]"
            />
            <button
              type="submit"
              className="blk h-[52px] flex-none bg-navy px-6 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-white"
            >
              Subscribe
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
