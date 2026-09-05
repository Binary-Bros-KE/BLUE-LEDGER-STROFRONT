import { headers } from "next/headers";
import { DEV_STORE_DOMAIN, SHOP_API_URL } from "./env";
import type { CatalogItem, CatalogPage, ShopCategory, StorePayload } from "./types";

export class ShopApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ShopApiError";
  }
}

/** The domain this request should be served as. In production that's the real incoming Host; in
 * dev, DEV_STORE_DOMAIN overrides it so `localhost:3200` can map to a real store. */
async function shopDomain(): Promise<string> {
  if (DEV_STORE_DOMAIN) return DEV_STORE_DOMAIN;
  const h = await headers();
  return (h.get("x-forwarded-host") ?? h.get("host") ?? "").toLowerCase();
}

async function shopFetch<T>(path: string): Promise<T> {
  const domain = await shopDomain();
  const res = await fetch(`${SHOP_API_URL}${path}`, {
    headers: { "X-Shop-Domain": domain },
    // Every render is tenant-specific; never share a cached response across stores.
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let message = res.statusText;
    try {
      const parsed = JSON.parse(body) as { error?: string; message?: string };
      message = parsed.error ?? parsed.message ?? message;
    } catch {
      if (body) message = body.slice(0, 300);
    }
    throw new ShopApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

export function getStore(): Promise<StorePayload> {
  return shopFetch<StorePayload>("/shop/store");
}

export function getCatalog(params?: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
}): Promise<CatalogPage> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params?.categoryId) qs.set("categoryId", params.categoryId);
  if (params?.search) qs.set("search", params.search);
  const q = qs.toString();
  return shopFetch<CatalogPage>(`/shop/catalog${q ? `?${q}` : ""}`);
}

export function getProduct(id: string): Promise<CatalogItem> {
  return shopFetch<CatalogItem>(`/shop/product/${encodeURIComponent(id)}`);
}

export function getCategories(): Promise<ShopCategory[]> {
  return shopFetch<ShopCategory[]>("/shop/categories");
}
