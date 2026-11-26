import { Diamond, FiArrowRight } from "@/components/shared/icons";
import type { ThemeTradeTile } from "@/lib/theme";

const DEFAULT_CATEGORY_LABEL = "Trade accounts";
const DEFAULT_TITLE = "Buying for a whole branch?";
const DEFAULT_BODY = "Tiered pricing, 30-day terms and LPO invoicing for registered businesses.";

// Featured-category tile in FeatureCards (it was the hero's right rail, hidden on mobile, until the
// hero became a plain banner). Cream ground.
//
// Client request: a single featured category highlight, not literally a "trade accounts" pitch —
// categoryLabel replaces that kicker text with whichever category the shop owner wants to surface
// (free text, same as every other theme copy field — not a live category id/filter).
export function TradeTile({ tradeTile = {} }: { tradeTile?: ThemeTradeTile }) {
  const categoryLabel = tradeTile.categoryLabel?.trim() || DEFAULT_CATEGORY_LABEL;
  const title = tradeTile.title?.trim() || DEFAULT_TITLE;
  const body = tradeTile.description?.trim() || DEFAULT_BODY;
  const cta = {
    label: tradeTile.ctaLabel?.trim() || "Apply for terms",
    href: tradeTile.ctaHref?.trim() || "#",
  };

  return (
    <div className="relative flex min-h-[260px] flex-col gap-3 bg-cream p-6">
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1.6px] text-green">
        <Diamond size={9} /> {categoryLabel}
      </span>
      <h3 className="font-sans text-[22px] font-black leading-[1.15] text-navy">{title}</h3>
      <p className="font-mono text-[11px] leading-[1.6] text-slate">{body}</p>
      <a
        href={cta.href}
        className="mt-1 inline-flex w-fit items-center gap-2 bg-navy px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-white transition-colors hover:bg-blue hover:text-on-primary"
      >
        {cta.label} <FiArrowRight size={13} />
      </a>

      {tradeTile.imageUrl ? (
        // Client request: absolutely positioned in the corner (not its own row) so it sits at the
        // same level as the copy above it instead of pushing the tile taller.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tradeTile.imageUrl}
          alt=""
          className="absolute bottom-4 right-4 size-28 object-cover lg:size-36"
        />
      ) : null}
    </div>
  );
}
