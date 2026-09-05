// Mirrors the response shapes from SERVER's shop-service.ts. Keep in sync by hand — this is a
// small, stable public surface (P0 = read-only catalog).

export type StockBadge = "in_stock" | "low" | "out_of_stock" | "made_to_order";

export type StorePayload = {
  name: string;
  currency: string;
  subdomain: string;
  customDomain: string | null;
  domainStatus: "NONE" | "PENDING_DNS" | "VERIFYING_TLS" | "LIVE";
  theme: Record<string, unknown>;
  delivery: Record<string, unknown>;
  paymentOptions: Record<string, unknown>;
  contact: {
    phone: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
  };
};

export type ProductImage = { url: string; thumbUrl?: string };

export type CatalogItem = {
  id: string;
  name: string;
  shortName: string | null;
  description: string | null;
  priceCents: number;
  wholesalePriceCents: number | null;
  wholesaleMinQuantity: number;
  categoryId: string | null;
  categoryName: string | null;
  unitOfMeasure: string | null;
  images: ProductImage[];
  stock: StockBadge;
};

export type ShopCategory = { id: string; name: string; count: number };

export type CatalogPage = {
  page: number;
  pageSize: number;
  total: number;
  products: CatalogItem[];
};
