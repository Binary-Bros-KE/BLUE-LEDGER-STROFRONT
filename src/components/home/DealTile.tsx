import { FiClock } from "@/components/shared/icons";

// Spec §4 — hero right-rail tile 1. Red ground. On mobile it's a compact full-width strip.
export function DealTile() {
  return (
    <div className="flex flex-col gap-3 bg-red p-6 text-white lg:flex-1">
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1.6px] text-white/85">
        <FiClock size={11} /> Deal of the week
      </span>

      <div className="flex items-center justify-between gap-3 lg:block">
        <h3 className="font-sans text-[20px] font-black leading-[1.1] lg:text-[29px]">
          <span className="lg:hidden">Printers 25% off</span>
          <span className="hidden lg:inline">
            Thermal printers
            <br />
            25% off
          </span>
        </h3>

        <div className="flex items-center gap-1.5 lg:mt-4">
          {["02", "14", "39"].map((n, i) => (
            <span
              key={i}
              className="grid h-8 min-w-8 place-items-center bg-red-900 px-1.5 font-sans text-[14px] font-black leading-none"
            >
              {n}
            </span>
          ))}
        </div>
      </div>

      <span className="hidden font-mono text-[9px] uppercase tracking-[2px] text-white/70 lg:block">DD : HH : MM</span>
    </div>
  );
}
