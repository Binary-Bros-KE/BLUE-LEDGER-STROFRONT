"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "@/components/shared/icons";
import type { AdiaHeroSlide } from "../content";

/**
 * Edge-to-edge hero: each slide is a full-width cover image with the copy over a soft dark fade on
 * the left. Several slides cross-fade every 6s (pauses on hover), with arrows + dots. A slide with
 * no image gets a rich brand-coloured backdrop instead, so the hero never looks empty.
 */
export function HeroCarousel({ slides }: { slides: AdiaHeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count, paused]);

  const go = (d: number) => setActive((i) => (i + d + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative isolate h-[440px] overflow-hidden bg-secondary sm:h-[480px] lg:h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={i}
          aria-hidden={i !== active}
          className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          {s.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.imageUrl} alt="" className="absolute inset-0 size-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.45)_42%,rgba(0,0,0,0)_75%)]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_20%,var(--brand-primary)_0%,var(--brand-primary-hover)_35%,var(--brand-secondary)_80%)]">
              <div className="absolute -right-24 -bottom-40 size-[520px] rounded-full border-[48px] border-white/[0.06]" />
              <div className="absolute top-10 right-[18%] size-40 rounded-full bg-white/[0.05]" />
              <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />
            </div>
          )}

          <div className="relative mx-auto flex h-full w-full max-w-[1280px] items-center px-4 lg:px-6">
            <div className="max-w-[560px] text-white">
              {s.eyebrow ? (
                <p className="font-display text-[12px] font-semibold uppercase tracking-[0.35em] text-white/85 lg:text-[14px]">{s.eyebrow}</p>
              ) : null}
              <h2 className="mt-3 font-display text-[40px] font-extrabold leading-[1.02] tracking-tight sm:text-[52px] lg:text-[68px]">{s.title}</h2>
              {s.subtitle ? <p className="mt-2 font-display text-[22px] font-bold lg:text-[30px]">{s.subtitle}</p> : null}
              {s.body ? <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed text-white/85 lg:text-[18px]">{s.body}</p> : null}
              <Link
                href={s.cta.href}
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-display text-[15px] font-semibold text-on-primary shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                {s.cta.label} <FiArrowRight size={16} />
              </Link>
              {s.note ? <p className="mt-4 text-[13px] text-white/75">{s.note}</p> : null}
            </div>

            {s.badgeValue ? (
              <div className="absolute top-8 right-6 hidden size-36 flex-col items-center justify-center rounded-full bg-primary text-center text-on-primary shadow-2xl ring-8 ring-white/15 md:flex lg:top-12 lg:right-10 lg:size-44">
                {s.badgeLabel ? <span className="font-display text-[12px] font-semibold uppercase tracking-wide lg:text-[14px]">{s.badgeLabel}</span> : null}
                <span className="font-display text-[40px] font-extrabold leading-none lg:text-[52px]">{s.badgeValue}</span>
              </div>
            ) : null}
          </div>
        </div>
      ))}

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute top-1/2 left-3 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-white md:grid lg:left-6"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute top-1/2 right-3 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-white md:grid lg:right-6"
          >
            <FiChevronRight size={20} />
          </button>
          <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 gap-2 lg:bottom-20">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all ${i === active ? "w-7 bg-primary" : "w-2 bg-white/60 hover:bg-white"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
