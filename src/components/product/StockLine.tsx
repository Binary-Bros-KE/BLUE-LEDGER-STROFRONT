import type { StockState } from "@/lib/products";
import { FiX } from "@/components/shared/icons";

// Spec §4 / §9 — the stock line ALWAYS spells the state out; the badge is never the only carrier.
// Dot is a plain 6px square (spec §3): green in-stock, amber low, slate made-to-order, red ✕ out.
export function StockLine({ state, label }: { state: StockState; label: string }) {
  if (state === "out_of_stock") {
    return (
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1.2px] text-red">
        <FiX size={10} strokeWidth={2.5} />
        {label}
      </div>
    );
  }

  const tone =
    state === "low" ? "text-amber-ink" : state === "made_to_order" ? "text-slate" : "text-green";
  const dot = state === "low" ? "bg-amber" : state === "made_to_order" ? "bg-slate" : "bg-green";

  return (
    <div className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[1.2px] ${tone}`}>
      <span className={`inline-block size-[6px] ${dot}`} aria-hidden="true" />
      {label}
    </div>
  );
}
