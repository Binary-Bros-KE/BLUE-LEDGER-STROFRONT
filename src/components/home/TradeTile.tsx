import { Diamond, FiArrowRight } from "@/components/shared/icons";

// Spec §4 — hero right-rail tile 2. Cream ground. Hidden on mobile (spec §4 Hero: mobile stack
// ends with the red deal row, no trade tile).
export function TradeTile() {
  return (
    <div className="hidden flex-col gap-3 bg-cream p-6 lg:flex lg:flex-1">
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1.6px] text-green">
        <Diamond size={9} /> Trade accounts
      </span>
      <h3 className="font-sans text-[22px] font-black leading-[1.15] text-navy">Buying for a whole branch?</h3>
      <p className="font-mono text-[11px] leading-[1.6] text-slate">
        Tiered pricing, 30-day terms and LPO invoicing for registered businesses.
      </p>
      <a
        href="#"
        className="mt-1 inline-flex w-fit items-center gap-2 bg-navy px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-white transition-colors hover:bg-blue"
      >
        Apply for terms <FiArrowRight size={13} />
      </a>
    </div>
  );
}
