import Link from "next/link";
import type { ThemeBrandLogo } from "@/lib/theme";
import { Container } from "../components/Container";
import { SectionHeader } from "./SectionHeader";

/** "Top Brands" strip — logos (or name wordmarks) from the shop's brands content (POS-edited). Each
 * tile links to its own link, else to the listing filtered to that brand. Hidden if none. */
export function Brands({ brands }: { brands: ThemeBrandLogo[] }) {
  if (brands.length === 0) return null;
  return (
    <Container className="mt-10 lg:mt-12">
      <SectionHeader title="Top Brands" />
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-7 lg:gap-4 lg:px-0">
        {brands.map((b) => {
          const inner = b.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.logoUrl} alt={b.name} className="max-h-9 w-auto max-w-[110px] object-contain" />
          ) : (
            <span className="font-display text-[18px] font-bold tracking-tight text-ink-muted transition-colors group-hover:text-primary-ink">
              {b.name}
            </span>
          );
          const cls =
            "group grid h-20 w-[36%] flex-none place-items-center rounded-xl border border-line bg-surface px-3 transition-shadow hover:shadow-md sm:w-[24%] lg:w-auto";
          return (
            <Link key={b.name} href={b.href || `/products?brand=${encodeURIComponent(b.name)}`} className={cls} aria-label={b.name}>
              {inner}
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
