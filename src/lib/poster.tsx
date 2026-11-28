import QRCode from "qrcode";
import { money } from "@/lib/money";
import type { ColorOverrides } from "@/lib/palette";
import type { StorefrontTemplate } from "@/templates/types";

/**
 * Social posters (src/app/poster/route.tsx): a product — or up to 4 — drawn in the store's own look
 * (logo/name, brand colours, template font) as a PNG for WhatsApp Status, Instagram and Facebook.
 * Rendered by next/og (Satori): flexbox-only layout, every multi-child element needs display:flex,
 * and images must be PNG/JPEG — so photos go through toPngDataUri() first.
 */

export const POSTER_SIZES = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
} as const;
export type PosterSize = keyof typeof POSTER_SIZES;

export type PosterProduct = {
  name: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  /** PNG/JPEG data URI, or null (no photo / couldn't convert). */
  image: string | null;
};

export type PosterBrand = {
  storeName: string;
  logo: string | null;
  primary: string;
  secondary: string;
  accent: string;
  /** e.g. "trylistsolutions.co.ke" */
  host: string;
  /** Order line, e.g. "WhatsApp 0742 503 840" — null when the store has no number. */
  contact: string | null;
  currency: string;
};

export function posterColors(template: StorefrontTemplate, overrides: ColorOverrides) {
  return {
    primary: overrides.primary ?? template.colorDefaults.primary,
    secondary: overrides.secondary ?? template.colorDefaults.secondary,
    accent: overrides.accent ?? template.colorDefaults.accent,
  };
}

/** Fetches a photo as a data URI the renderer can read. WebP (how product photos are stored) goes
 * through Netlify's Image CDN as PNG; anything that fails just leaves the poster without it. */
export async function toPngDataUri(url: string | null | undefined, origin: string, width: number): Promise<string | null> {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  const candidates = [`${origin}/.netlify/images?url=${encodeURIComponent(url)}&fm=png&w=${width}`];
  if (!/\.webp(\?|$)/i.test(url)) candidates.push(url);
  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, { signal: AbortSignal.timeout(8000) });
      const type = res.headers.get("content-type") ?? "";
      if (!res.ok || !/image\/(png|jpe?g)/i.test(type)) continue;
      const bytes = Buffer.from(await res.arrayBuffer());
      return `data:${type.split(";")[0]};base64,${bytes.toString("base64")}`;
    } catch {
      // next candidate
    }
  }
  return null;
}

const FONT_FAMILY: Record<string, string> = { classic: "Archivo", adia: "Inter" };
const fontCache = new Map<string, Promise<Array<{ name: string; data: ArrayBuffer; weight: 500 | 800; style: "normal" }>>>();

/** The template's own typeface (Google Fonts TTF), cached per process. Empty = next/og's default. */
export function posterFonts(templateId: string) {
  const family = FONT_FAMILY[templateId] ?? "Archivo";
  let pending = fontCache.get(family);
  if (!pending) {
    pending = Promise.all(
      ([500, 800] as const).map(async (weight) => {
        const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`)).text();
        const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
        if (!src) throw new Error("no ttf");
        return { name: family, data: await (await fetch(src)).arrayBuffer(), weight, style: "normal" as const };
      }),
    ).catch(() => []);
    fontCache.set(family, pending);
  }
  return pending.then((fonts) => ({ family: fonts.length ? family : undefined, fonts }));
}

export async function qrDataUri(url: string, color: string): Promise<string> {
  const svg = await QRCode.toString(url, { type: "svg", margin: 0, color: { dark: color, light: "#ffffff" } });
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function Header({ brand, scale }: { brand: PosterBrand; scale: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `${36 * scale}px 56px`,
        background: brand.secondary,
        color: "#ffffff",
      }}
    >
      {brand.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={brand.logo} alt="" style={{ height: 64 * scale, maxWidth: 520, objectFit: "contain" }} />
      ) : (
        <div style={{ display: "flex", fontSize: 40 * scale, fontWeight: 800, letterSpacing: 1 }}>{brand.storeName.toUpperCase()}</div>
      )}
      <div style={{ display: "flex", fontSize: 26, fontWeight: 500, opacity: 0.85 }}>{brand.host}</div>
    </div>
  );
}

function Footer({ brand, qr, cta }: { brand: PosterBrand; qr: string; cta: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 32, padding: "32px 56px", background: brand.secondary, color: "#ffffff" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, color: brand.accent }}>{cta}</div>
        {brand.contact ? <div style={{ display: "flex", fontSize: 30, fontWeight: 500 }}>{brand.contact}</div> : null}
        <div style={{ display: "flex", fontSize: 26, fontWeight: 500, opacity: 0.8 }}>{brand.host}</div>
      </div>
      <div style={{ display: "flex", background: "#ffffff", padding: 12, borderRadius: 12 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="" width={150} height={150} />
      </div>
    </div>
  );
}

function PriceTag({ product, brand, size }: { product: PosterProduct; brand: PosterBrand; size: number }) {
  const onSale = product.compareAtPriceCents !== null && product.compareAtPriceCents > product.priceCents;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 18, flexWrap: "wrap" }}>
      <div
        style={{
          display: "flex",
          background: brand.accent,
          color: brand.secondary,
          fontSize: size,
          fontWeight: 800,
          padding: `${size * 0.18}px ${size * 0.4}px`,
          borderRadius: 14,
        }}
      >
        {money(product.priceCents, brand.currency)}
      </div>
      {onSale ? (
        <div style={{ display: "flex", fontSize: size * 0.55, fontWeight: 500, color: "#8a8fb5", textDecoration: "line-through", paddingBottom: 8 }}>
          {money(product.compareAtPriceCents!, brand.currency)}
        </div>
      ) : null}
    </div>
  );
}

function Photo({ product, brand, iconSize }: { product: PosterProduct; brand: PosterBrand; iconSize: number }) {
  return product.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={product.image} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
  ) : (
    <div style={{ display: "flex", fontSize: iconSize, fontWeight: 800, color: brand.secondary, opacity: 0.15 }}>{brand.storeName.slice(0, 1)}</div>
  );
}

/** One product: big photo on a white card, name, price, order line + QR to the product page. */
export function SingleProductPoster({ product, brand, qr, size }: { product: PosterProduct; brand: PosterBrand; qr: string; size: PosterSize }) {
  const tall = size === "story";
  const onSale = product.compareAtPriceCents !== null && product.compareAtPriceCents > product.priceCents;
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#efeae0", color: brand.secondary }}>
      <Header brand={brand} scale={tall ? 1.25 : 1} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: tall ? "56px 56px 48px" : "40px 56px 36px", gap: tall ? 40 : 28 }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            borderRadius: 24,
            padding: 36,
            position: "relative",
          }}
        >
          <Photo product={product} brand={brand} iconSize={320} />
          {onSale ? (
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: 28,
                left: 28,
                background: brand.primary,
                color: "#ffffff",
                fontSize: 30,
                fontWeight: 800,
                padding: "10px 22px",
                borderRadius: 10,
                letterSpacing: 2,
              }}
            >
              SALE
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: tall ? 28 : 20 }}>
          <div
            style={{
              display: "block",
              fontSize: tall ? 64 : product.name.length > 40 ? 46 : 54,
              fontWeight: 800,
              lineHeight: 1.12,
              lineClamp: 3,
            }}
          >
            {product.name}
          </div>
          <PriceTag product={product} brand={brand} size={tall ? 84 : 64} />
        </div>
      </div>
      <Footer brand={brand} qr={qr} cta="Order now" />
    </div>
  );
}

/** Up to 4 products in a grid under a title — "New arrivals", a category, a deal. */
export function CollectionPoster({
  products,
  brand,
  qr,
  size,
  title,
}: {
  products: PosterProduct[];
  brand: PosterBrand;
  qr: string;
  size: PosterSize;
  title: string;
}) {
  const tall = size === "story";
  const twoRows = products.length > 2;
  const oneColumn = products.length === 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#efeae0", color: brand.secondary }}>
      <Header brand={brand} scale={tall ? 1.25 : 1} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: tall ? "48px 48px 40px" : "32px 48px 28px", gap: tall ? 32 : 22 }}>
        <div style={{ display: "flex", fontSize: tall ? 72 : 56, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", flex: 1, gap: 24 }}>
          {products.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                width: oneColumn ? "100%" : "48.6%",
                height: twoRows ? "48%" : "100%",
                background: "#ffffff",
                borderRadius: 20,
                padding: 22,
                gap: 12,
              }}
            >
              <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", minHeight: 0 }}>
                <Photo product={p} brand={brand} iconSize={140} />
              </div>
              <div style={{ display: "block", fontSize: tall ? 34 : 28, fontWeight: 800, lineHeight: 1.15, lineClamp: 2 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    background: brand.accent,
                    color: brand.secondary,
                    fontSize: tall ? 38 : 32,
                    fontWeight: 800,
                    padding: "6px 16px",
                    borderRadius: 10,
                  }}
                >
                  {money(p.priceCents, brand.currency)}
                </div>
                {p.compareAtPriceCents !== null && p.compareAtPriceCents > p.priceCents ? (
                  <div style={{ display: "flex", fontSize: 24, color: "#8a8fb5", textDecoration: "line-through" }}>
                    {money(p.compareAtPriceCents, brand.currency)}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer brand={brand} qr={qr} cta="Shop now" />
    </div>
  );
}
