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
};

export const EMPTY_THEME: TrylistTheme = { hero: {}, story: [], categoryImages: {} };

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
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
  };
}
