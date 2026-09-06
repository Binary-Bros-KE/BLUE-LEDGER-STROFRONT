// Trylist theme config — mirror of SERVER's lib/trylist-theme.ts. Comes from web_stores.themeJson
// via GET /shop/store. Every field is optional; the components fall back to their built-in
// defaults field by field, so an empty `{}` renders exactly the stock theme.

export type ThemeCta = { label?: string; href?: string };

export type ThemeStoryRow = {
  imageUrl?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type ThemeProductSection = {
  title: string;
  categoryId: string;
  ctaLabel?: string;
};

/** Hero right-rail tile 1 (red). "Deal of the week" is a static label, not part of this config —
 * only the fields below are editable. priceCents/offerPriceCents drive an auto-calculated discount
 * badge here in the storefront (see DealTile.tsx) — the percentage itself is never stored. */
export type ThemeDealTile = {
  title?: string;
  priceCents?: number;
  offerPriceCents?: number;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
};

/** Hero right-rail tile 2 (cream). A single featured category highlight — categoryLabel is free
 * text (like every other theme copy field), not a live category id/filter. */
export type ThemeTradeTile = {
  categoryLabel?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
};

export type TrylistTheme = {
  hero: {
    headline?: string;
    sub?: string;
    primaryCta?: ThemeCta;
    secondaryCta?: ThemeCta;
    shotImageUrl?: string;
    backgroundImageUrl?: string;
  };
  story: ThemeStoryRow[];
  categoryImages: Record<string, string>;
  /** Curated home rows — each pulls one category's products. Empty = one default product grid. */
  productSections: ThemeProductSection[];
  dealTile: ThemeDealTile;
  tradeTile: ThemeTradeTile;
};

export const EMPTY_THEME: TrylistTheme = {
  hero: {},
  story: [],
  categoryImages: {},
  productSections: [],
  dealTile: {},
  tradeTile: {},
};

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function cta(v: unknown): ThemeCta | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, unknown>;
  const label = str(o.label);
  const href = str(o.href);
  return label || href ? { label, href } : undefined;
}

/** Defensive coercion of the raw themeJson blob into a typed, safe TrylistTheme. Anything
 * unexpected is dropped rather than thrown on — the storefront must always render. */
export function parseTheme(raw: unknown): TrylistTheme {
  if (!raw || typeof raw !== "object") return EMPTY_THEME;
  const o = raw as Record<string, unknown>;
  const heroRaw = (o.hero && typeof o.hero === "object" ? o.hero : {}) as Record<string, unknown>;
  const storyRaw = Array.isArray(o.story) ? o.story : [];
  const catRaw = (o.categoryImages && typeof o.categoryImages === "object" ? o.categoryImages : {}) as Record<
    string,
    unknown
  >;
  const dealTileRaw = (o.dealTile && typeof o.dealTile === "object" ? o.dealTile : {}) as Record<string, unknown>;
  const tradeTileRaw = (o.tradeTile && typeof o.tradeTile === "object" ? o.tradeTile : {}) as Record<string, unknown>;

  return {
    hero: {
      headline: str(heroRaw.headline),
      sub: str(heroRaw.sub),
      primaryCta: cta(heroRaw.primaryCta),
      secondaryCta: cta(heroRaw.secondaryCta),
      shotImageUrl: str(heroRaw.shotImageUrl),
      backgroundImageUrl: str(heroRaw.backgroundImageUrl),
    },
    story: storyRaw
      .slice(0, 3)
      .map((r) => {
        const rr = (r && typeof r === "object" ? r : {}) as Record<string, unknown>;
        return {
          imageUrl: str(rr.imageUrl),
          title: str(rr.title),
          body: str(rr.body),
          ctaLabel: str(rr.ctaLabel),
          ctaHref: str(rr.ctaHref),
        };
      })
      // a row with neither an image nor a title contributes nothing — drop it
      .filter((r) => r.imageUrl || r.title || r.body),
    categoryImages: Object.fromEntries(
      Object.entries(catRaw).flatMap(([k, v]) => {
        const url = str(v);
        return url ? [[k, url] as const] : [];
      }),
    ),
    productSections: (Array.isArray(o.productSections) ? o.productSections : [])
      .slice(0, 6)
      .map((s): ThemeProductSection => {
        const ss = (s && typeof s === "object" ? s : {}) as Record<string, unknown>;
        return { title: str(ss.title) ?? "", categoryId: str(ss.categoryId) ?? "", ctaLabel: str(ss.ctaLabel) };
      })
      // a section is only usable if it names both a title and a category
      .filter((s) => Boolean(s.title && s.categoryId)),
    dealTile: {
      title: str(dealTileRaw.title),
      priceCents: num(dealTileRaw.priceCents),
      offerPriceCents: num(dealTileRaw.offerPriceCents),
      ctaLabel: str(dealTileRaw.ctaLabel),
      ctaHref: str(dealTileRaw.ctaHref),
      imageUrl: str(dealTileRaw.imageUrl),
    },
    tradeTile: {
      categoryLabel: str(tradeTileRaw.categoryLabel),
      title: str(tradeTileRaw.title),
      description: str(tradeTileRaw.description),
      ctaLabel: str(tradeTileRaw.ctaLabel),
      ctaHref: str(tradeTileRaw.ctaHref),
      imageUrl: str(tradeTileRaw.imageUrl),
    },
  };
}
