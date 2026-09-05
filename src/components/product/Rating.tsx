import { FaStar } from "@/components/shared/icons";

// Spec §4 — ★★★★★ at 10px in amber-ink (#8A6206), then `4.6 · 128 reviews` in slate mono 10px.
export function Rating({ rating, reviews, muted = false }: { rating: number; reviews: number; muted?: boolean }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-2">
      <span className={`flex items-center gap-[1px] ${muted ? "text-slate-dim" : "text-amber-ink"}`} aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar key={i} size={10} className={i < filled ? "" : "opacity-30"} />
        ))}
      </span>
      <span className={`font-mono text-[10px] uppercase tracking-[1.2px] ${muted ? "text-slate-dim" : "text-slate"}`}>
        {rating.toFixed(1)} · {reviews} reviews
      </span>
    </div>
  );
}
