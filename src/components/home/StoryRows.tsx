import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Placeholder } from "@/components/shared/Placeholder";
import { FiArrowRight } from "@/components/shared/icons";
import type { ThemeStoryRow } from "@/lib/theme";

// Theme-driven "story" blocks (web_stores.themeJson.story) — up to 3 image+text rows below the
// product grid on the home page. Alternating side per row. Renders nothing when the owner hasn't
// added any.
export function StoryRows({ rows }: { rows: ThemeStoryRow[] }) {
  if (rows.length === 0) return null;

  return (
    <section className="bg-cream py-14">
      <Container>
        <div className="flex flex-col gap-12">
          {rows.map((row, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={i}
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="border border-line bg-white shadow-[6px_6px_0_var(--color-amber)]">
                  {row.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <Placeholder caption="[ IMAGE ]" className="aspect-[4/3] w-full" />
                  )}
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[2px] text-slate">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {row.title ? (
                    <h2 className="mt-3 font-sans text-[26px] font-black leading-[1.05] tracking-[-0.5px] text-navy lg:text-[32px]">
                      {row.title}
                    </h2>
                  ) : null}
                  {row.body ? (
                    <p className="mt-4 max-w-[46ch] font-mono text-[13px] leading-[1.7] text-navy/75 whitespace-pre-line">
                      {row.body}
                    </p>
                  ) : null}
                  {row.ctaLabel ? (
                    <Link
                      href={row.ctaHref || "/products"}
                      className="mt-6 inline-flex items-center gap-1.5 border-b-[1.5px] border-blue pb-0.5 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-blue"
                    >
                      {row.ctaLabel} <FiArrowRight size={13} />
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
