"use client";

import { FaHeart, FiHeart } from "@/components/shared/icons";

// Spec §4 — default: 1px solid line box, red outline heart. Saved: solid red box, white filled heart.
export function FavouriteButton({
  active,
  onToggle,
  size = 32,
  label,
}: {
  active: boolean;
  onToggle: () => void;
  size?: number;
  label: string;
}) {
  const glyph = size <= 36 ? 13 : 15;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onToggle}
      style={{ width: size, height: size }}
      className={`grid flex-none place-items-center transition-[background-color,border-color,color] duration-[140ms] ${
        active ? "border border-red bg-red text-white" : "border border-line text-red hover:border-navy"
      }`}
    >
      {active ? <FaHeart size={glyph} /> : <FiHeart size={glyph} strokeWidth={2} />}
    </button>
  );
}
