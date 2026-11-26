import Link from "next/link";
import { Placeholder } from "@/components/shared/Placeholder";
import type { TrylistTheme } from "@/lib/theme";

const DEFAULT_HEADLINE = "BUILT FOR\nTHE SHOP\nFLOOR";
const DEFAULT_SUB =
  "Laptops, POS hardware, printers and networking kit — stocked in Nairobi, delivered countrywide, and set up by people who actually run tills.";

// The hero's own copy + product shot (themeJson.hero.headline / sub / shotImageUrl), shown as the
// big card in FeatureCards since the hero itself became a plain banner.
export function SpotlightTile({ hero = {} }: { hero?: TrylistTheme["hero"] }) {
  const headline = hero.headline?.trim() || DEFAULT_HEADLINE;
  const sub = hero.sub?.trim() || DEFAULT_SUB;
  const cta = {
    label: hero.primaryCta?.label?.trim() || "Shop the catalogue",
    href: hero.primaryCta?.href?.trim() || "/products",
  };

  return (
    <div className="flex flex-col gap-6 bg-grid p-6 sm:flex-row sm:items-stretch lg:p-8">
      <div className="flex flex-col sm:max-w-[55%]">
        <h3 className="whitespace-pre-line font-sans text-[30px] font-black leading-[0.95] tracking-[-1px] text-ink-on-navy [text-wrap:balance] lg:text-[40px]">
          {headline}
        </h3>
        <p className="mt-4 font-mono text-[12px] leading-[1.6] text-body-on-navy">{sub}</p>
        <Link
          href={cta.href}
          className="mt-6 inline-flex w-fit items-center gap-2 bg-blue px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-on-primary transition-colors hover:bg-blue-press"
        >
          {cta.label}
        </Link>
      </div>

      <div className={`flex min-h-[160px] flex-1 ${hero.shotImageUrl ? "" : "border border-navy-600"}`}>
        {hero.shotImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.shotImageUrl} alt="" className="size-full max-h-[300px] flex-1 object-contain" />
        ) : (
          <Placeholder dark caption="[ PRODUCT SHOT ]" className="w-full flex-1" />
        )}
      </div>
    </div>
  );
}
