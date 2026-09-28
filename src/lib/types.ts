// Mirrors the response shapes from SERVER's shop-service.ts. Keep in sync by hand — this is a
// small, stable public surface (P0 = read-only catalog).

export type StockBadge = "in_stock" | "low" | "out_of_stock" | "made_to_order";

export type StorePayload = {
  name: string;
  currency: string;
  subdomain: string;
  customDomain: string | null;
  domainStatus: "NONE" | "PENDING_DNS" | "VERIFYING_TLS" | "LIVE";
  /** web_stores.templateId — which src/templates/ module renders the shop (admin-set). Absent on
   * an older SERVER → the default template. */
  template?: string;
  /** web_stores.themeColorsJson — { primary?, secondary?, accent? } "#rrggbb" overrides (admin-set). */
  colors?: Record<string, unknown>;
  /** web_stores.themeJson — the CONTENT config (client-edited from the POS). */
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

export type OnlineContentBlock = {
  type: "paragraph" | "specs" | "notes";
  heading: string | null;
  body: string | null;
  items: string[];
};

export type OnlineContent = {
  quickSpecs: string[];
  blocks: OnlineContentBlock[];
};

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
  /** Every category this product shows under online — POS categoryId + online-only extras. */
  categoryIds: string[];
  unitOfMeasure: string | null;
  images: ProductImage[];
  content: OnlineContent;
  stock: StockBadge;
};

export type ShopCategory = { id: string; name: string; count: number };

export type DeliveryOption = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
};

export type CatalogPage = {
  page: number;
  pageSize: number;
  total: number;
  /** min/max shopper price over the matching set BEFORE any price filter (absent on older SERVERs) */
  priceRange?: { minCents: number; maxCents: number } | null;
  products: CatalogItem[];
};
