import Link from "next/link";
import { FiArrowRight } from "@/components/shared/icons";
import type { Category } from "@/lib/products";
import { categoryHref, type AdiaHome } from "../content";
import { Container } from "../components/Container";
import { SectionHead } from "./SectionHead";

/** "Shop Your Home": two large category tiles, then four smaller ones. Each tile uses the image
 * the shop picked for it, else that category's POS image, else a warm textured backdrop. */
export function CategoryGrid({
  section,
  categories,
  categoryImages,
}: {
  section: AdiaHome["categories"];
  categories: Category[];
  categoryImages: Record<string, string>;
}) {
  if (!section.enabled || section.tiles.length === 0) return null;
  const [a, b, ...rest] = section.tiles;
  const big = [a, b].filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <Container className="mt-12 lg:mt-16">
      <SectionHead title={section.title} subtitle={section.subtitle} href="/products" cta={section.ctaLabel} />
      <div className="grid gap-4 lg:gap-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
          {big.map((t) => (
            <Tile key={t.categoryId} tile={t} href={categoryHref(t.categoryId, categories)} image={t.imageUrl ?? categoryImages[t.categoryId]} large />
          ))}
        </div>
        {rest.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {rest.map((t) => (
              <Tile key={t.categoryId} tile={t} href={categoryHref(t.categoryId, categories)} image={t.imageUrl ?? categoryImages[t.categoryId]} />
            ))}
          </div>
        ) : null}
      </div>
    </Container>
  );
}

function Tile({
  tile,
  href,
  image,
  large = false,
}: {
  tile: AdiaHome["categories"]["tiles"][number];
  href: string;
  image?: string | undefined;
  large?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative isolate block overflow-hidden rounded-2xl border border-line bg-[linear-gradient(135deg,#fbf6ef_0%,#f1e6d8_100%)] ${
        large ? "h-[200px] lg:h-[250px]" : "h-[150px] lg:h-[170px]"
      }`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          loading="lazy"
          className="absolute inset-y-0 right-0 -z-10 h-full w-[62%] object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      ) : (
        <span aria-hidden="true" className="absolute -right-4 -bottom-8 -z-10 font-display text-[150px] font-extrabold leading-none text-primary/10 lg:text-[190px]">
          {tile.title.charAt(0)}
        </span>
      )}
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#fbf6ef_32%,rgba(251,246,239,0.55)_55%,rgba(251,246,239,0)_75%)]" />
      <div className="flex h-full flex-col justify-between p-5 lg:p-6">
        <div className="max-w-[60%]">
          <h3 className={`font-display font-bold text-ink ${large ? "text-[20px] lg:text-[26px]" : "text-[15px] lg:text-[17px]"}`}>{tile.title}</h3>
          {tile.subtitle ? <p className={`mt-1 text-ink-muted ${large ? "text-[13px] lg:text-[15px]" : "text-[12px]"}`}>{tile.subtitle}</p> : null}
        </div>
        <span className="grid size-10 place-items-center rounded-full bg-primary text-on-primary shadow-md transition-transform group-hover:translate-x-1">
          <FiArrowRight size={17} />
        </span>
      </div>
    </Link>
  );
}
