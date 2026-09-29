import { headers } from "next/headers";
import { cache } from "react";
import { DEV_STORE_DOMAIN, SHOP_API_URL, STOREFRONT_API_KEY } from "./env";
import type { CatalogSort } from "./listing-filters";
import type {
  CatalogItem,
  CatalogPage,
  DeliveryOption,
  OrderConfirmation,
  OrderRequest,
  ShopCategory,
  StorePayload,
} from "./types";

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

async function shopFetch<T>(path: string, init?: { method?: string; body?: unknown; headers?: Record<string, string> }): Promise<T> {
  const domain = await shopDomain();
  const res = await fetch(`${SHOP_API_URL}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      "X-Shop-Domain": domain,
      ...(STOREFRONT_API_KEY ? { "X-Storefront-Key": STOREFRONT_API_KEY } : {}),
      ...(init?.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
    ...(init?.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
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

/** Deduped per request (React cache): the root layout (template + colours + favicon), metadata and
 * the page itself all need the store row — one round-trip to SERVER serves them all. */
export const getStore = cache((): Promise<StorePayload> => shopFetch<StorePayload>("/shop/store"));

export function getCatalog(params?: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
  brand?: string;
  sort?: CatalogSort;
  minPriceCents?: number;
  maxPriceCents?: number;
}): Promise<CatalogPage> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params?.categoryId) qs.set("categoryId", params.categoryId);
  if (params?.search) qs.set("search", params.search);
  if (params?.brand) qs.set("brand", params.brand);
  if (params?.sort && params.sort !== "featured") qs.set("sort", params.sort);
  if (params?.minPriceCents !== undefined) qs.set("minPriceCents", String(params.minPriceCents));
  if (params?.maxPriceCents !== undefined) qs.set("maxPriceCents", String(params.maxPriceCents));
  const q = qs.toString();
  return shopFetch<CatalogPage>(`/shop/catalog${q ? `?${q}` : ""}`);
}

export function getProduct(id: string): Promise<CatalogItem> {
  return shopFetch<CatalogItem>(`/shop/product/${encodeURIComponent(id)}`);
}

export function getCategories(): Promise<ShopCategory[]> {
  return shopFetch<ShopCategory[]>("/shop/categories");
}

/** Places a storefront order (POST /shop/orders). `shopperIp` lets SERVER rate-limit per shopper —
 * it only trusts it alongside this deployment's storefront key. */
export function placeOrder(body: OrderRequest, shopperIp: string | null): Promise<OrderConfirmation> {
  return shopFetch<OrderConfirmation>("/shop/orders", {
    method: "POST",
    body,
    headers: shopperIp ? { "X-Shopper-IP": shopperIp } : {},
  });
}

export function getDeliveryMethods(): Promise<DeliveryOption[]> {
  return shopFetch<DeliveryOption[]>("/shop/delivery");
}
