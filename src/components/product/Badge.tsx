import type { Badge as BadgeType, BadgeKind } from "@/lib/products";

// Spec §4 — mono 10px / 700 / tracking 1.4px / padding 5px 8px. No radius.
const STYLES: Record<BadgeKind, string> = {
  discount: "bg-red text-white",
  new: "bg-blue text-white",
  bundle: "bg-amber text-navy",
  top_rated: "bg-green text-white",
  fast_mover: "bg-cream text-navy",
  sold_out: "bg-cream text-[#6b6f8a]",
};

export function Badge({ kind, label }: BadgeType) {
  return (
    <span
      className={`inline-block px-2 py-[5px] font-mono text-[10px] font-bold uppercase leading-none tracking-[1.4px] ${STYLES[kind]}`}
    >
      {label}
    </span>
  );
}
