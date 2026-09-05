import { Placeholder } from "@/components/shared/Placeholder";
import { Diamond, FiPlay } from "@/components/shared/icons";
import { DealTile } from "./DealTile";
import { TradeTile } from "./TradeTile";

// Spec §4 — desktop grid `1fr 372px`. Left = bg-grid, holds the copy column + the hero-shot panel.
// Right rail = deal tile + trade tile stacked. Mobile: everything stacks; trade tile drops.
export function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_372px]">
      {/* LEFT — engineering-grid navy panel */}
      <div className="bg-grid px-4 py-10 sm:px-8 lg:px-11 lg:py-[52px]">
        <div className="flex flex-col gap-9 lg:flex-row lg:items-stretch lg:gap-10">
          {/* copy column */}
          <div className="flex max-w-[520px] flex-col">
            <span className="inline-flex w-fit items-center gap-2 border border-dashed border-amber px-3 py-1.5 font-mono text-[11px] uppercase tracking-[2px] text-amber">
              <Diamond size={9} /> Authorised dealer · 12-month warranty
            </span>

            <h1 className="mt-6 font-sans text-[40px] font-black leading-[0.95] tracking-[-1.4px] text-ink-on-navy sm:text-[52px] lg:text-[62px] lg:tracking-[-2px]">
              BUILT FOR
              <br />
              THE SHOP
              <br />
              FLOOR<span className="text-amber">.</span>
            </h1>

            <p className="mt-6 max-w-[420px] font-mono text-[13px] leading-[1.6] text-body-on-navy">
              Laptops, POS hardware, printers and networking kit — stocked in Nairobi, delivered countrywide, and
              set up by people who actually run tills.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#"
                className="blk inline-flex items-center justify-center gap-2 bg-blue px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-white"
              >
                <FiPlay size={11} /> Shop the catalogue
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center border-[1.5px] border-cream px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-cream transition-colors hover:bg-cream hover:text-navy"
              >
                Talk to sales
              </a>
            </div>

            <div className="mt-auto pt-10">
              <span className="font-mono text-[11px] uppercase tracking-[1.4px] text-meta-on-navy">
                2,400+ SKUS · Same-day dispatch · M-Pesa · Card
              </span>
            </div>
          </div>

          {/* hero shot */}
          <div className="flex min-h-[150px] flex-1 border border-navy-600 lg:min-h-0">
            <Placeholder dark caption="[ HERO PRODUCT SHOT ]" className="w-full flex-1" />
          </div>
        </div>
      </div>

      {/* RIGHT rail — on mobile these fall into normal flow below the panel above */}
      <div className="flex flex-col">
        <DealTile />
        <TradeTile />
      </div>
    </section>
  );
}
