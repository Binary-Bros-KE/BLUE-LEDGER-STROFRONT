"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FiArrowRight } from "@/components/shared/icons";

/**
 * Reusable horizontal carousel — no dependency.
 *  - `perView` presets pick how many slides are fully visible per breakpoint (literal class
 *    strings so Tailwind's JIT keeps them).
 *  - When `autoScroll` and there are enough slides it's a seamless infinite marquee: slides are
 *    rendered twice and the scroll position wraps by one set-width, so the loop is invisible.
 *    Position is driven by a JS accumulator (not `scrollLeft +=`, which some browsers truncate
 *    per frame so it never moves). Pauses while the pointer is over the track, on drag, on
 *    keyboard focus, when the tab is hidden, and under prefers-reduced-motion.
 *  - Mouse drag-to-scrub; native touch swipe + momentum on phones. `lg` arrows nudge one slide.
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
  /** marquee speed in px/second */
  speed = 32,
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
  const posRef = useRef(0);
  const [reduced, setReduced] = useState(false);

  const loop = autoScroll && children.length > 2;

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(m.matches);
    apply();
    m.addEventListener("change", apply);
    return () => m.removeEventListener("change", apply);
  }, []);

  // rAF marquee. posRef is the source of truth; we only ever WRITE scrollLeft while auto-scrolling
  // and RESYNC from it whenever something else (drag / touch / arrows) moved the track.
  useEffect(() => {
    if (!loop || reduced) return;
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    posRef.current = el.scrollLeft;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const half = el.scrollWidth / 2;
      const running = !pausedRef.current && !dragRef.current && !document.hidden;

      if (running && half > 0) {
        posRef.current += speed * dt;
        if (posRef.current >= half) posRef.current -= half;
        el.scrollLeft = posRef.current;
      } else {
        // paused / dragging / arrow-nudging — follow the real position + keep the loop bounds
        posRef.current = el.scrollLeft;
        if (half > 0) {
          if (posRef.current >= half) el.scrollLeft = posRef.current -= half;
          else if (posRef.current < 0) el.scrollLeft = posRef.current += half;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loop, reduced, speed, children.length]);

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
  };
  const endDrag = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    dragRef.current = null;
  };

  const nudge = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = (el.querySelector<HTMLElement>(":scope > *")?.offsetWidth ?? el.clientWidth * 0.8) + 12;
    if (loop) {
      // move + let the rAF re-clamp on its next frame
      el.scrollLeft += dir * step;
      posRef.current = el.scrollLeft;
    } else {
      el.scrollBy({ left: dir * step, behavior: "smooth" });
    }
  };

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div className="group/carousel relative" onFocusCapture={pause} onBlurCapture={resume}>
      <div
        ref={trackRef}
        className={`no-scrollbar flex gap-3 overflow-x-auto ${loop ? "cursor-grab active:cursor-grabbing" : "snap-x snap-mandatory scroll-smooth"}`}
        role="group"
        aria-label={ariaLabel}
        onMouseEnter={pause}
        onMouseLeave={resume}
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
