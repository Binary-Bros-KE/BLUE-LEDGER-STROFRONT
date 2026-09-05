/**
 * Spec §3 — image placeholder: a diagonal-hatch block with a centred mono caption in `slate`.
 * Where a real photo lands, swap for <Image> with object-cover and keep `.ph-light` as the
 * loading background. No radius, ever.
 */
export function Placeholder({
  caption,
  dark = false,
  className = "",
}: {
  caption: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center ${dark ? "ph-dark" : "ph-light"} ${className}`}
      role="img"
      aria-label={caption.replace(/[[\]]/g, "").trim()}
    >
      <span
        className={`font-mono text-[10px] uppercase tracking-[1.6px] ${dark ? "text-meta-on-navy" : "text-slate"}`}
      >
        {caption}
      </span>
    </div>
  );
}
