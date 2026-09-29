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
  /** absent on older SERVERs */
  brand?: string | null;
  /** online "was" price, only when genuinely above priceCents */
  compareAtPriceCents?: number | null;
  /** set when the product has variants: count + price range (cards show "From …") */
  variantSummary?: { count: number; minPriceCents: number; maxPriceCents: number } | null;
  /** product page only: every variant with its own price and stock */
  variants?: ShopVariants | null;
};

export type ShopVariant = {
  /** shared stock: the variant key · separate stock: the variant product's id */
  key: string;
  /** the product to order (separate stock: the variant's own product) */
  productId: string;
  name: string;
  label: string;
  values: Record<string, string>;
  priceCents: number;
  compareAtPriceCents: number | null;
  stock: StockBadge;
};

export type ShopVariants = {
  mode: "shared" | "separate";
  title: string | null;
  options: { name: string; values: string[] }[];
  /** separate stock: the variant this page is · shared: null */
  selectedKey: string | null;
  variants: ShopVariant[];
};

export type ShopCategory = { id: string; name: string; count: number };

export type DeliveryOption = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
};

/** POST /shop/orders body — only ids + quantities; SERVER prices everything itself. */
export type OrderRequest = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress?: string | null;
  notes?: string | null;
  deliveryMethodId?: string | null;
  /** Customer collects from the shop, or wants it delivered. No payment is chosen online — the shop
   * and the customer agree payment after the order arrives. */
  deliveryType: "pickup" | "delivery";
  items: { productId: string; variantKey?: string | null; qty: number }[];
};

/** What SERVER returns for a placed order — its own (authoritative) totals. */
export type OrderConfirmation = {
  orderNumber: string;
  subtotalCents: number;
  deliveryFeeCents: number;
  /** absent from older SERVER builds */
  deliveryType?: "pickup" | "delivery";
  totalCents: number;
  currency: string;
  items: { productId: string; name: string; unitPriceCents: number; qty: number; lineTotalCents: number }[];
};

export type CatalogPage = {
  page: number;
  pageSize: number;
  total: number;
  /** min/max shopper price over the matching set BEFORE any price filter (absent on older SERVERs) */
  priceRange?: { minCents: number; maxCents: number } | null;
  /** brands in the matching set (ignoring the brand filter itself), most products first */
  brands?: { name: string; count: number }[];
  products: CatalogItem[];
};
