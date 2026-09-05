import type { ReactNode } from "react";

// Shared section header — spec §4 CategoryGrid / ProductGrid / Features.
// Eyebrow `NN · LABEL` (mono 11px, tracking 2px, slate) + Archivo 900 heading + optional right slot.
export function SectionHead({
  index,
  eyebrow,
  title,
  right,
  onNavy = false,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  right?: ReactNode;
  onNavy?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span
          className={`font-mono text-[11px] uppercase tracking-[2px] ${onNavy ? "text-meta-on-navy" : "text-slate"}`}
        >
          {index} · {eyebrow}
        </span>
        <h2
          className={`mt-2 font-sans text-[24px] font-black leading-[1.05] tracking-[-0.7px] md:text-[34px] md:tracking-[-1px] ${
            onNavy ? "text-ink-on-navy" : "text-navy"
          }`}
        >
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}
