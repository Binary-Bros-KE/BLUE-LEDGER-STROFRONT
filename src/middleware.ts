import { NextResponse, type NextRequest } from "next/server";
import { DEV_STORE_DOMAIN, SHOP_API_URL, STOREFRONT_API_KEY } from "@/lib/env";

/**
 * Legacy product URLs (/product/product_<uuid>, from before slugs) → HTTP 301 to /product/<slug>.
 * The page itself also redirects any non-canonical spelling, but a page can only send 308; Google
 * Merchant Center asks for a 301 on moved product URLs, and only middleware can set that status.
 *
 * Deliberately the deprecated `middleware.ts` (Edge runtime), not Next 16's `proxy.ts` (Node runtime):
 * a deploy with proxy.ts never went live on Netlify (2026-11-28); Edge middleware deploys there.
 *
 * Any failure (unknown product, API down) just lets the request through to the page, which 404s or
 * redirects on its own.
 */
export async function middleware(request: NextRequest) {
  const id = decodeURIComponent(request.nextUrl.pathname.slice("/product/".length));
  // only the old id form — slug URLs never pay for this lookup
  if (!id.startsWith("product_")) return NextResponse.next();
  const domain = DEV_STORE_DOMAIN || (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").toLowerCase();
  try {
    const res = await fetch(`${SHOP_API_URL}/shop/product/${encodeURIComponent(id)}`, {
      headers: { "X-Shop-Domain": domain, ...(STOREFRONT_API_KEY ? { "X-Storefront-Key": STOREFRONT_API_KEY } : {}) },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.next();
    const product = (await res.json()) as { slug?: string };
    if (!product.slug || product.slug === id) return NextResponse.next();
    const target = request.nextUrl.clone();
    target.pathname = `/product/${encodeURIComponent(product.slug)}`;
    return NextResponse.redirect(target, 301);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/product/:path*",
};
