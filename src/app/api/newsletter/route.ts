import { NextResponse } from "next/server";
import { ShopApiError, subscribeNewsletter } from "@/lib/shop-api";

// Same-origin newsletter sign-up for the storefront's "Get the Latest Deals" box — runs server-side
// so the SERVER call carries this deployment's storefront key and the tenant resolves from the Host.
export const dynamic = "force-dynamic";

function shopperIp(req: Request): string | null {
  const nf = req.headers.get("x-nf-client-connection-ip");
  if (nf) return nf.trim();
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : null;
}

export async function POST(req: Request) {
  let email = "";
  try {
    email = String(((await req.json()) as { email?: unknown }).email ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    await subscribeNewsletter(email, shopperIp(req));
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof ShopApiError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "We couldn't reach the shop just now. Please try again." }, { status: 503 });
  }
}
