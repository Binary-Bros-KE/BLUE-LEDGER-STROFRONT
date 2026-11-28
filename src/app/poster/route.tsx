import { ImageResponse } from "next/og";
import { parseColors } from "@/lib/palette";
import {
  CollectionPoster,
  POSTER_SIZES,
  type PosterBrand,
  type PosterProduct,
  type PosterSize,
  posterColors,
  posterFonts,
  qrDataUri,
  SingleProductPoster,
  toPngDataUri,
} from "@/lib/poster";
import { getProduct, getStore, ShopApiError } from "@/lib/shop-api";
import { parseTheme } from "@/lib/theme";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

/**
 * GET /poster?slug=<product slug>&size=square|portrait|story — one product's social poster (PNG).
 * GET /poster?slugs=a,b,c,d&title=New%20arrivals&size=… — up to 4 products on one poster.
 * Only published products (the same lookup as the product page), in this store's own look. CORS-open
 * so the Owner App can fetch it into the phone's share sheet.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const size: PosterSize = (["square", "portrait", "story"] as const).find((s) => s === url.searchParams.get("size")) ?? "square";
  const single = url.searchParams.get("slug")?.trim() || null;
  const slugs = single
    ? [single]
    : (url.searchParams.get("slugs") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 4);
  if (slugs.length === 0) return new Response("slug or slugs is required", { status: 400 });

  const origin = url.origin;
  const host = url.host.replace(/^www\./, "");
  const { width, height } = POSTER_SIZES[size];
  const photoWidth = single ? 900 : 500;

  try {
    const store = await getStore();
    const items = await Promise.all(slugs.map((slug) => getProduct(slug)));
    const theme = parseTheme(store.theme);
    const templateId = store.template ?? "classic";
    const colors = posterColors(getTemplate(templateId), parseColors(store.colors));
    const whatsapp = theme.contact.whatsappSalesNumber || theme.contact.whatsappSupportNumber;
    const phone = store.contact.phone;

    const [logo, images, qr, { family, fonts }] = await Promise.all([
      toPngDataUri(theme.brand.logoImageUrl, origin, 520),
      Promise.all(items.map((item) => toPngDataUri(item.images?.[0]?.url, origin, photoWidth))),
      qrDataUri(single ? `${origin}/product/${items[0]!.slug ?? single}` : `${origin}/products`, colors.secondary),
      posterFonts(templateId),
    ]);

    const brand: PosterBrand = {
      storeName: store.name,
      logo,
      ...colors,
      host,
      contact: whatsapp ? `WhatsApp ${whatsapp}` : phone ? `Call ${phone}` : null,
      currency: store.currency,
    };
    const products: PosterProduct[] = items.map((item, i) => ({
      name: item.name,
      priceCents: item.priceCents,
      compareAtPriceCents: item.compareAtPriceCents ?? null,
      image: images[i] ?? null,
    }));

    const fileName = `${single ?? "collection"}-${size}.png`;
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", ...(family ? { fontFamily: family } : {}) }}>
          {single ? (
            <SingleProductPoster product={products[0]!} brand={brand} qr={qr} size={size} />
          ) : (
            <CollectionPoster products={products} brand={brand} qr={qr} size={size} title={url.searchParams.get("title")?.trim().slice(0, 40) || "Shop now"} />
          )}
        </div>
      ),
      {
        width,
        height,
        fonts,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300",
          // Netlify's edge cache ignores the query string unless told — without this every size
          // and product would get the first poster cached for /poster.
          "Netlify-Vary": "query",
          "Content-Disposition": `inline; filename="${fileName}"`,
        },
      },
    );
  } catch (err) {
    const status = err instanceof ShopApiError && err.status === 404 ? 404 : 500;
    if (status === 500) console.error("[poster]", err);
    return new Response(status === 404 ? "Product not found or not published" : "Could not draw the poster", {
      status,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}
