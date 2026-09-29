import type { Metadata } from "next";
import { parseTheme } from "./theme";
import type { StorePayload } from "./types";

type Og = NonNullable<Metadata["openGraph"]>;

/**
 * Open Graph for a page, built ON TOP of the shop's defaults. Next.js replaces a parent's whole
 * `openGraph` object when a page sets its own (no deep merge), so every page must re-state the
 * site name / locale / fallback image or link previews silently lose them.
 */
export function pageOpenGraph(
  store: StorePayload,
  page: { url: string; title?: string; description?: string; images?: { url: string; alt?: string }[] },
): Og {
  const theme = parseTheme(store.theme);
  const fallback = theme.hero.shotImageUrl || theme.hero.backgroundImageUrl || theme.brand.logoImageUrl;
  const images = page.images?.length ? page.images : fallback ? [{ url: fallback, alt: store.name }] : [];
  return {
    type: "website",
    siteName: store.name,
    locale: "en_KE",
    url: page.url,
    title: page.title ?? store.name,
    ...(page.description ? { description: page.description } : {}),
    ...(images.length ? { images } : {}),
  };
}
