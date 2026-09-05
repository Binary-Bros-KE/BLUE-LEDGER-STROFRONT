import { NextResponse } from "next/server";
import { toThemeProduct } from "@/lib/adapter";
import { getCatalog, getCategories } from "@/lib/shop-api";
import { slugify } from "@/lib/slug";

// Same-origin search for the header box. Runs server-side so it can reach SERVER `/shop`
// (SHOP_API_URL) and resolve the tenant from the incoming Host — the browser never sees either.
export const dynamic = "force-dynamic";

export type SearchResults = {
  query: string;
  categories: { id: string; name: string; count: number; slug: string }[];
  products: { id: string; name: string; category: string; priceCents: number; image: string | null; imageCaption: string }[];
};

export async function GET(req: Request): Promise<NextResponse<SearchResults>> {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  const empty: SearchResults = { query: q, categories: [], products: [] };
  if (q.length < 2) return NextResponse.json(empty);

  const ql = q.toLowerCase();

  const [cats, catalog] = await Promise.all([
    getCategories().catch(() => []),
    getCatalog({ search: q, pageSize: 6 }).catch(() => ({ products: [], total: 0, page: 1, pageSize: 6 })),
  ]);

  return NextResponse.json({
    query: q,
    categories: cats
      .filter((c) => c.name.toLowerCase().includes(ql))
      .slice(0, 5)
      .map((c) => ({ id: c.id, name: c.name, count: c.count, slug: slugify(c.name) })),
    products: catalog.products.map(toThemeProduct).map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      priceCents: p.priceCents,
      image: p.images?.[0] ?? null,
      imageCaption: p.imageCaption,
    })),
  });
}
