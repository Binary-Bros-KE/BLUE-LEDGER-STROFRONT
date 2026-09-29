import Link from "next/link";
import type { ThemeBrandLogo } from "@/lib/theme";
import type { AdiaHome } from "../content";
import { Container } from "../components/Container";
import { SectionHead } from "./SectionHead";

/** "Brands You Know" — an endlessly scrolling strip of the shop's brands (logo, else a wordmark),
 * pausing on hover. Each links to that brand's products unless the shop set its own link. */
export function BrandsMarquee({ section, brands }: { section: AdiaHome["brands"]; brands: ThemeBrandLogo[] }) {
  if (!section.enabled || brands.length === 0) return null;
  // two copies back to back → translating by -50% loops seamlessly
  const loop = [...brands, ...brands];
  return (
    <Container className="mt-12 lg:mt-16">
      <SectionHead title={section.title} subtitle={section.subtitle} href="/products" cta={undefined} />
      <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface py-5 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        <div
          className="flex w-max items-center gap-4 group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
          style={{ animation: `adia-marquee ${Math.max(20, brands.length * 4)}s linear infinite` }}
        >
          {loop.map((b, i) => (
            <Link
              key={`${b.name}-${i}`}
              href={b.href?.trim() || `/products?brand=${encodeURIComponent(b.name)}`}
              aria-hidden={i >= brands.length}
              tabIndex={i >= brands.length ? -1 : undefined}
              className="grid h-16 w-40 flex-none place-items-center rounded-xl border border-line bg-surface px-4 transition-colors hover:border-primary lg:h-20 lg:w-48"
            >
              {b.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.logoUrl} alt={b.name} className="max-h-10 w-auto object-contain lg:max-h-12" />
              ) : (
                <span className="font-display text-[18px] font-extrabold tracking-tight text-ink lg:text-[22px]">{b.name}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
      <style>{`@keyframes adia-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </Container>
  );
}
