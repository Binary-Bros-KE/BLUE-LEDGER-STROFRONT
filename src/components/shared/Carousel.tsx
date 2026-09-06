"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { FiArrowRight } from "@/components/shared/icons";

/**
 * Reusable horizontal carousel — no dependency.
 *  - `perView` presets pick how many slides are fully visible per breakpoint (literal class
 *    strings so Tailwind's JIT keeps them).
 *  - When `autoScroll` and there are enough slides, it becomes a seamless infinite marquee: the
 *    slides are rendered twice and the scroll position wraps by one set-width every frame, so the
 *    loop is invisible. Pauses on hover / focus / drag, and respects prefers-reduced-motion.
 *  - Drag to scrub with a mouse; native touch swipe + momentum on phones. `lg` arrows nudge one
 *    slide.
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
  autoScroll = true,
  /** marquee speed in px per 60fps-frame */
  speed = 0.45,
}: {
  children: ReactNode[];
  perView?: PerView;
  ariaLabel?: string;
  autoScroll?: boolean;
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const dragRef = useRef<{ startX: number; startScroll: number } | null>(null);
  const [reduced, setReduced] = useState(false);

  const loop = autoScroll && children.length > 2;

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(m.matches);
    apply();
    m.addEventListener("change", apply);
    return () => m.removeEventListener("change", apply);
  }, []);

  /** Keep scrollLeft inside [0, half) so the duplicated second set makes the wrap seamless. */
  const wrap = useCallback(() => {
    const el = trackRef.current;
    if (!el || !loop) return;
    const half = el.scrollWidth / 2;
    if (half <= 0) return;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    else if (el.scrollLeft < 0) el.scrollLeft += half;
  }, [loop]);

  // Marquee: advance + wrap every frame (wrap runs even while paused so drag/arrows loop too).
  useEffect(() => {
    if (!loop || reduced) return;
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const active = !pausedRef.current && !dragRef.current && !document.hidden;
      if (active) el.scrollLeft += speed * Math.min(dt / 16.67, 3);
      wrap();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loop, reduced, speed, wrap, children.length]);

  const onScroll = useCallback(() => {
    if (!loop) return; // snap mode handles its own bounds
    if (!dragRef.current) wrap();
  }, [loop, wrap]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return; // let native scroll handle touch/pen
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = { startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    const el = trackRef.current;
    if (!d || !el) return;
    el.scrollLeft = d.startScroll - (e.clientX - d.startX);
    wrap();
  };
  const endDrag = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    dragRef.current = null;
  };

  const nudge = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.querySelector<HTMLElement>(":scope > *")?.offsetWidth ?? el.clientWidth * 0.8;
    el.scrollBy({ left: dir * (step + 12), behavior: "smooth" });
  };

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      className="group/carousel relative"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      <div
        ref={trackRef}
        className={`no-scrollbar flex gap-3 overflow-x-auto ${loop ? "cursor-grab active:cursor-grabbing" : "snap-x snap-mandatory scroll-smooth"}`}
        role="group"
        aria-label={ariaLabel}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {(loop ? [0, 1] : [0]).map((copy) =>
          children.map((child, i) => (
            <div
              key={`${copy}-${i}`}
              // second copy is decoration only — keep it out of the a11y tree + tab order
              inert={copy === 1}
              aria-hidden={copy === 1 || undefined}
              className={`${BASIS[perView]} shrink-0 grow-0 ${loop ? "" : "snap-start"} select-none`}
            >
              {child}
            </div>
          )),
        )}
      </div>

      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="Previous"
        className="absolute -left-3 top-1/2 hidden size-9 -translate-y-1/2 place-items-center border-[1.5px] border-navy bg-white text-navy opacity-0 transition group-hover/carousel:opacity-100 lg:grid"
      >
        <FiArrowRight size={16} className="rotate-180" />
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Next"
        className="absolute -right-3 top-1/2 hidden size-9 -translate-y-1/2 place-items-center border-[1.5px] border-navy bg-white text-navy opacity-0 transition group-hover/carousel:opacity-100 lg:grid"
      >
        <FiArrowRight size={16} />
      </button>
    </div>
  );
}
