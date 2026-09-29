// Adia-only page content — themeJson.adia (SERVER schemas/shop.ts adiaThemeSchema mirrors this).
// Theme-specific on purpose: only the Adia template reads it, so its POS controllers never show up
// for another template. Every text has a default here; anything the shop sets replaces it, field by
// field, and an empty/missing value always falls back — the page is complete with zero setup.

import type { Category } from "@/lib/products";
import type { CatalogSort } from "@/lib/listing-filters";
import { slugify } from "@/lib/slug";

export type AdiaLink = { label: string; href: string };

export type AdiaTopStrip = { enabled: boolean; label: string; highlight: string; cta: AdiaLink };

export type AdiaSocials = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
  whatsapp?: string;
};

export type AdiaHeroSlide = {
  imageUrl?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body?: string;
  cta: AdiaLink;
  /** round badge on the image, e.g. "Save up to" / "35%" */
  badgeLabel?: string;
  badgeValue?: string;
  /** small line under the button, e.g. "Ends Sunday · While stocks last" */
  note?: string;
};

export type AdiaCategoryTile = { categoryId: string; title: string; subtitle?: string; imageUrl?: string };

/** A product row on the home page — `categoryId` empty = the row's own automatic pick. */
export type AdiaProductRow = { enabled: boolean; title: string; subtitle?: string; categoryId?: string; ctaLabel: string };

export type AdiaPromoCard = {
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl?: string;
  cta: AdiaLink;
  /** "light" cream card, "dark" charcoal, "brand" primary colour */
  tone: "light" | "dark" | "brand";
};

export type AdiaSpace = { title: string; subtitle?: string; imageUrl?: string; categoryId?: string };

export type AdiaCollectionCard = {
  title: string;
  subtitle?: string;
  badge?: string;
  priceText?: string;
  oldPriceText?: string;
  imageUrl?: string;
  cta: AdiaLink;
};

export type AdiaHome = {
  topStrip: AdiaTopStrip;
  socials: AdiaSocials;
  heroSlides: AdiaHeroSlide[];
  categories: { enabled: boolean; title: string; subtitle?: string; ctaLabel: string; tiles: AdiaCategoryTile[] };
  bestSellers: AdiaProductRow;
  promosA: AdiaPromoCard[];
  hotDeals: AdiaProductRow & { endsAt?: string };
  promosB: AdiaPromoCard[];
  latestArrivals: AdiaProductRow;
  spaces: { enabled: boolean; title: string; subtitle?: string; items: AdiaSpace[] };
  topDeals: AdiaProductRow;
  collections: { enabled: boolean; title: string; subtitle?: string; ctaLabel?: string; ctaHref?: string; items: AdiaCollectionCard[] };
  brands: { enabled: boolean; title: string; subtitle?: string };
  newsletter: { enabled: boolean; title: string; body?: string; placeholder: string; buttonLabel: string; whatsappLabel?: string };
  footer: { tagline?: string; about?: string };
};

// ------------------------------------------------------------------------------------ parsing

function str(v: unknown, max = 400): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;
}
function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}
function arr(v: unknown): Record<string, unknown>[] {
  return Array.isArray(v) ? v.map(obj) : [];
}
function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}
function link(v: unknown, fallback: AdiaLink): AdiaLink {
  const o = obj(v);
  return { label: str(o.label, 40) ?? fallback.label, href: str(o.href, 500) ?? fallback.href };
}
const TONES = ["light", "dark", "brand"] as const;

export const categoryHref = (categoryId: string | undefined, categories: Category[]): string => {
  const cat = categoryId ? categories.find((c) => c.id === categoryId) : undefined;
  return cat ? `/products/${slugify(cat.name)}` : "/products";
};

function row(raw: unknown, d: AdiaProductRow): AdiaProductRow {
  const o = obj(raw);
  return {
    enabled: bool(o.enabled, d.enabled),
    title: str(o.title, 60) ?? d.title,
    subtitle: str(o.subtitle, 120) ?? d.subtitle,
    categoryId: str(o.categoryId, 80),
    ctaLabel: str(o.ctaLabel, 30) ?? d.ctaLabel,
  };
}

function promos(raw: unknown, fallback: AdiaPromoCard[]): AdiaPromoCard[] {
  const list = arr(raw)
    .slice(0, 3)
    .flatMap((o): AdiaPromoCard[] => {
      const title = str(o.title, 60);
      if (!title) return [];
      const tone = (TONES as readonly string[]).includes(o.tone as string) ? (o.tone as AdiaPromoCard["tone"]) : "light";
      return [
        {
          title,
          subtitle: str(o.subtitle, 120),
          badge: str(o.badge, 40),
          imageUrl: str(o.imageUrl, 2048),
          cta: link(o.cta, { label: "Shop now", href: "/products" }),
          tone,
        },
      ];
    });
  return list.length ? list : fallback;
}

/** Content from themeJson.adia, with Adia's defaults filling every gap. Category-based defaults
 * (tiles, promo cards, spaces) are drawn from the shop's own biggest categories. */
export function parseAdiaHome(raw: unknown, categories: Category[]): AdiaHome {
  const o = obj(raw);
  const cats = [...categories].sort((a, b) => b.count - a.count);
  const catLink = (i: number): AdiaLink => ({ label: "Shop now", href: cats[i] ? categoryHref(cats[i]!.id, categories) : "/products" });

  const top = obj(o.topStrip);
  const socials = obj(o.socials);
  const heroSlides = arr(o.heroSlides)
    .slice(0, 5)
    .flatMap((s): AdiaHeroSlide[] => {
      const title = str(s.title, 80);
      if (!title && !str(s.imageUrl, 2048)) return [];
      return [
        {
          imageUrl: str(s.imageUrl, 2048),
          eyebrow: str(s.eyebrow, 40),
          title: title ?? "",
          subtitle: str(s.subtitle, 80),
          body: str(s.body, 200),
          cta: link(s.cta, { label: "Shop now", href: "/products" }),
          badgeLabel: str(s.badgeLabel, 20),
          badgeValue: str(s.badgeValue, 12),
          note: str(s.note, 80),
        },
      ];
    });

  const catSec = obj(o.categories);
  const tiles = arr(catSec.tiles)
    .slice(0, 6)
    .flatMap((t): AdiaCategoryTile[] => {
      const categoryId = str(t.categoryId, 80);
      const cat = categoryId ? categories.find((c) => c.id === categoryId) : undefined;
      if (!cat) return [];
      return [{ categoryId: cat.id, title: str(t.title, 40) ?? cat.name, subtitle: str(t.subtitle, 60), imageUrl: str(t.imageUrl, 2048) }];
    });

  const spacesSec = obj(o.spaces);
  const spaceItems = arr(spacesSec.items)
    .slice(0, 4)
    .flatMap((s): AdiaSpace[] => {
      const title = str(s.title, 40);
      return title ? [{ title, subtitle: str(s.subtitle, 80), imageUrl: str(s.imageUrl, 2048), categoryId: str(s.categoryId, 80) }] : [];
    });

  const colSec = obj(o.collections);
  const colItems = arr(colSec.items)
    .slice(0, 3)
    .flatMap((c): AdiaCollectionCard[] => {
      const title = str(c.title, 60);
      if (!title) return [];
      return [
        {
          title,
          subtitle: str(c.subtitle, 100),
          badge: str(c.badge, 40),
          priceText: str(c.priceText, 30),
          oldPriceText: str(c.oldPriceText, 30),
          imageUrl: str(c.imageUrl, 2048),
          cta: link(c.cta, { label: "View collection", href: "/products" }),
        },
      ];
    });

  const brandsSec = obj(o.brands);
  const news = obj(o.newsletter);
  const foot = obj(o.footer);
  const hot = obj(o.hotDeals);

  return {
    topStrip: {
      enabled: bool(top.enabled, true),
      label: str(top.label, 40) ?? "Hot Deals",
      highlight: str(top.highlight, 60) ?? "Grab them now",
      cta: link(top.cta, { label: "Shop now", href: "/products" }),
    },
    socials: {
      facebook: str(socials.facebook, 300),
      instagram: str(socials.instagram, 300),
      tiktok: str(socials.tiktok, 300),
      youtube: str(socials.youtube, 300),
      x: str(socials.x, 300),
      whatsapp: str(socials.whatsapp, 300),
    },
    heroSlides: heroSlides.length
      ? heroSlides
      : [
          {
            eyebrow: "Home upgrade",
            title: "Make Home Better.",
            body: "Quality home appliances at great prices — delivered to your door or ready to pick up.",
            cta: { label: "Shop now", href: "/products" },
          },
        ],
    categories: {
      enabled: bool(catSec.enabled, true),
      title: str(catSec.title, 60) ?? "Shop Your Home",
      subtitle: str(catSec.subtitle, 120) ?? "Find what you need, room by room.",
      ctaLabel: str(catSec.ctaLabel, 30) ?? "View all categories",
      tiles: tiles.length ? tiles : cats.slice(0, 6).map((c) => ({ categoryId: c.id, title: c.name, subtitle: `${c.count} products` })),
    },
    bestSellers: row(o.bestSellers, { enabled: true, title: "Best Sellers", subtitle: "Customer favourites, loved across the country.", ctaLabel: "View all" }),
    promosA: promos(o.promosA, cats.slice(0, 3).map((c, i) => ({
      title: c.name,
      subtitle: "Great prices on top brands",
      cta: catLink(i),
      tone: (["light", "dark", "brand"] as const)[i % 3]!,
    }))),
    hotDeals: {
      ...row(o.hotDeals, { enabled: true, title: "Hot Deals", subtitle: "Unbeatable prices. Limited time only.", ctaLabel: "View all deals" }),
      endsAt: str(hot.endsAt, 40),
    },
    promosB: promos(o.promosB, cats.slice(3, 6).map((c, i) => ({
      title: c.name,
      subtitle: "Upgrade today",
      cta: catLink(i + 3),
      tone: (["brand", "light", "dark"] as const)[i % 3]!,
    }))),
    latestArrivals: row(o.latestArrivals, { enabled: true, title: "Latest Arrivals", subtitle: "Fresh in store — just landed.", ctaLabel: "View all" }),
    spaces: {
      enabled: bool(spacesSec.enabled, true),
      title: str(spacesSec.title, 60) ?? "What's Your Space?",
      subtitle: str(spacesSec.subtitle, 120) ?? "Explore appliances by room.",
      items: spaceItems.length ? spaceItems : cats.slice(0, 4).map((c) => ({ title: c.name, subtitle: `${c.count} products`, categoryId: c.id })),
    },
    topDeals: row(o.topDeals, { enabled: true, title: "Top Deals", subtitle: "Great value on popular picks.", ctaLabel: "View all" }),
    collections: {
      enabled: bool(colSec.enabled, colItems.length > 0),
      title: str(colSec.title, 60) ?? "Better Together",
      subtitle: str(colSec.subtitle, 120) ?? "Save more when you shop the set.",
      ctaLabel: str(colSec.ctaLabel, 30),
      ctaHref: str(colSec.ctaHref, 500),
      items: colItems,
    },
    brands: {
      enabled: bool(brandsSec.enabled, true),
      title: str(brandsSec.title, 60) ?? "Brands You Know. Quality You Trust.",
      subtitle: str(brandsSec.subtitle, 120),
    },
    newsletter: {
      enabled: bool(news.enabled, true),
      title: str(news.title, 60) ?? "Get the Latest Deals",
      body: str(news.body, 160) ?? "Be the first to know about new arrivals and exclusive offers.",
      placeholder: str(news.placeholder, 40) ?? "Enter your email address",
      buttonLabel: str(news.buttonLabel, 20) ?? "Subscribe",
      whatsappLabel: str(news.whatsappLabel, 40) ?? "Chat with us on WhatsApp",
    },
    footer: { tagline: str(foot.tagline, 80), about: str(foot.about, 300) },
  };
}

/** The product rows the Adia home needs — the page route fetches them (12 each). */
export function adiaHomeRows(raw: unknown): Array<{ key: string; categoryId?: string; sort?: CatalogSort; pageSize: number }> {
  const o = obj(raw);
  const cat = (k: string) => str(obj(o[k]).categoryId, 80);
  return [
    { key: "bestSellers", categoryId: cat("bestSellers"), pageSize: 12 },
    { key: "hotDeals", categoryId: cat("hotDeals"), sort: cat("hotDeals") ? undefined : "price-desc", pageSize: 12 },
    { key: "latestArrivals", categoryId: cat("latestArrivals"), sort: "newest", pageSize: 12 },
    { key: "topDeals", categoryId: cat("topDeals"), sort: cat("topDeals") ? undefined : "price-asc", pageSize: 12 },
  ];
}
