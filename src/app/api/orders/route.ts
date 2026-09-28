import { NextResponse } from "next/server";
import { placeOrder, ShopApiError } from "@/lib/shop-api";
import type { OrderRequest } from "@/lib/types";

// Same-origin order endpoint for the checkout page. Runs server-side so the SERVER call carries this
// deployment's storefront key and the tenant resolves from the request's own Host — the browser
// never sees either. SERVER re-validates and re-prices everything; this just relays.
export const dynamic = "force-dynamic";

/** The shopper's real IP — Netlify's own header first (can't be spoofed through Netlify), then the
 * first X-Forwarded-For hop. SERVER uses it only to rate-limit order spam per shopper. */
function shopperIp(req: Request): string | null {
  const nf = req.headers.get("x-nf-client-connection-ip");
  if (nf) return nf.trim();
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : null;
}

export async function POST(req: Request) {
  let body: OrderRequest;
  try {
    body = (await req.json()) as OrderRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    return NextResponse.json(await placeOrder(body, shopperIp(req)), { status: 201 });
  } catch (err) {
    if (err instanceof ShopApiError) {
      // SERVER's messages are written for shoppers ("choose a delivery option", "too many orders…").
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "We couldn't reach the shop just now. Please try again." }, { status: 503 });
  }
}
