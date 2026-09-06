"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { FiArrowRight } from "@/components/shared/icons";

/**
 * Reusable horizontal carousel — CSS scroll-snap, no dependency. One child per slide.
 * `perView` picks how many slides are fully visible per breakpoint (base / md / lg); the strings
 * are literal so Tailwind's JIT keeps the classes. Arrows appear only when the track overflows.
 */
type PerView = "2-3-4" | "2-2-3" | "1-2-4" | "3-4-6";

const BASIS: Record<PerView, string> = {
  // gap is 12px (gap-3): basis = (100% − (n−1)·12px) / n
  "2-3-4": "basis-[calc((100%-12px)/2)] md:basis-[calc((100%-24px)/3)] lg:basis-[calc((100%-36px)/4)]",
  "2-2-3": "basis-[calc((100%-12px)/2)] md:basis-[calc((100%-12px)/2)] lg:basis-[calc((100%-24px)/3)]",
  "1-2-4": "basis-full sm:basis-[calc((100%-12px)/2)] lg:basis-[calc((100%-36px)/4)]",
  "3-4-6": "basis-[calc((100%-24px)/3)] md:basis-[calc((100%-36px)/4)] lg:basis-[calc((100%-60px)/6)]",
};

export function Carousel({
  children,
  perView = "2-3-4",
  ariaLabel,
}: {
  children: ReactNode[];
  perView?: PerView;
  ariaLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 4);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync, children.length]);

  const nudge = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.querySelector<HTMLElement>(":scope > *")?.offsetWidth ?? el.clientWidth * 0.8;
    el.scrollBy({ left: dir * (step + 12), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth"
        role="group"
        aria-label={ariaLabel}
      >
        {children.map((child, i) => (
          <div key={i} className={`${BASIS[perView]} shrink-0 grow-0 snap-start`}>
            {child}
          </div>
        ))}
      </div>

      {overflows ? (
        <>
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label="Previous"
            className="absolute -left-3 top-1/2 hidden size-9 -translate-y-1/2 place-items-center border-[1.5px] border-navy bg-white text-navy transition disabled:opacity-0 lg:grid"
          >
            <FiArrowRight size={16} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label="Next"
            className="absolute -right-3 top-1/2 hidden size-9 -translate-y-1/2 place-items-center border-[1.5px] border-navy bg-white text-navy transition disabled:opacity-0 lg:grid"
          >
            <FiArrowRight size={16} />
          </button>
        </>
      ) : null}
    </div>
  );
}
