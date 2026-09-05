// TRYLIST "Classic" theme — types + the sample ("mock") data.
//
// The theme renders REAL data from SERVER `/shop` (see src/lib/adapter.ts). This file provides:
//   1. the shape the components consume (Product / Category / CartLine …),
//   2. deterministic MOCK generators for fields the API does not have yet
//      (rating, review count) — kept, not dropped, so the reviews feature isn't forgotten,
//   3. the Trylist sample set, used as a fallback when no live store resolves (e.g. localhost
//      without DEV_STORE_DOMAIN) so the theme is always viewable.

export type StockState = "in_stock" | "low" | "out_of_stock" | "made_to_order";

export type BadgeKind = "discount" | "new" | "bundle" | "top_rated" | "fast_mover" | "sold_out";

export type Badge = { kind: BadgeKind; label: string };

export type Product = {
  id: string;
  name: string;
  /** mono meta, e.g. `LAPTOPS · BUSINESS` — from the product's category name (uppercased) */
  category: string;
  priceCents: number;
  /** struck-through compare price. TODO(catalog): no source in the API yet. */
  compareCents?: number;
  /** TODO(reviews): MOCK until a reviews feature exists — see mockRating(). */
  rating: number;
  /** TODO(reviews): MOCK — see mockReviews(). */
  reviews: number;
  stockState: StockState;
  /** spelled-out stock line — never rely on the badge alone (spec §9) */
  stockLabel: string;
  /** TODO(catalog): no "NEW/BUNDLE/TOP RATED" product flag in the API yet. */
  badge?: Badge;
  /** hatch-placeholder caption used until a real photo exists */
  imageCaption: string;
  /** real image URL (from Product.onlineImageUrls) once the P3 upload pipeline lands */
  imageUrl?: string;
};

export type Category = {
  id: string;
  name: string;
  count: number;
  caption: string;
  /** the one inverted navy tile in the category grid */
  inverted?: boolean;
};

export type CartLine = {
  id: string;
  name: string;
  spec?: string;
  lowStockNote?: string;
  unitPriceCents: number;
  qty: number;
};

// ── MOCK generators — deterministic per product id ────────────────────────────

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** TODO(reviews): MOCK star rating, 4.1–4.9, stable per id. Replace with real ratings. */
export function mockRating(id: string): number {
  return Math.min(4.9, Math.round((4.1 + (hash(`${id}:r`) % 90) / 100) * 10) / 10);
}

/** TODO(reviews): MOCK review count, 8–260, stable per id. Replace with real counts. */
export function mockReviews(id: string): number {
  return 8 + (hash(`${id}:v`) % 253);
}

// ── Sample data (fallback when no live store resolves) ────────────────────────

export const PRODUCTS: Product[] = [
  {
    id: "p-ultrabook-14",
    name: '14" Business Ultrabook — i5, 16GB, 512GB SSD',
    category: "LAPTOPS · BUSINESS",
    priceCents: 7_890_000,
    compareCents: 10_100_000,
    rating: 4.6,
    reviews: 128,
    stockState: "in_stock",
    stockLabel: "12 IN STOCK · NAIROBI",
    badge: { kind: "discount", label: "-22%" },
    imageCaption: "[ LAPTOP SHOT ]",
  },
  {
    id: "p-thermal-80mm",
    name: "80mm Thermal Receipt Printer — USB + LAN",
    category: "POS · PRINTERS",
    priceCents: 1_450_000,
    rating: 4.9,
    reviews: 64,
    stockState: "in_stock",
    stockLabel: "40+ IN STOCK",
    badge: { kind: "new", label: "NEW" },
    imageCaption: "[ PRINTER SHOT ]",
  },
  {
    id: "p-counter-kit",
    name: "Counter Starter Kit — terminal, printer, drawer",
    category: "POS · COMPLETE KIT",
    priceCents: 9_600_000,
    compareCents: 11_800_000,
    rating: 4.7,
    reviews: 41,
    stockState: "low",
    stockLabel: "4 LEFT · FREE SETUP",
    badge: { kind: "bundle", label: "BUNDLE" },
    imageCaption: "[ POS BUNDLE ]",
  },
  {
    id: "p-android-handset",
    name: '6.5" Android Handset — 8GB / 256GB, dual SIM',
    category: "PHONES · MID-RANGE",
    priceCents: 3_270_000,
    rating: 4.5,
    reviews: 89,
    stockState: "out_of_stock",
    stockLabel: "OUT OF STOCK",
    badge: { kind: "sold_out", label: "SOLD OUT" },
    imageCaption: "[ PHONE SHOT ]",
  },
  {
    id: "p-ips-display-24",
    name: '24" IPS Counter Display — 75Hz, HDMI/VGA',
    category: 'MONITORS · 24"',
    priceCents: 2_130_000,
    rating: 4.8,
    reviews: 212,
    stockState: "in_stock",
    stockLabel: "28 IN STOCK",
    badge: { kind: "top_rated", label: "TOP RATED" },
    imageCaption: "[ MONITOR SHOT ]",
  },
  {
    id: "p-wifi6-router",
    name: "Dual-Band Wi-Fi 6 Router — 4 LAN, mesh ready",
    category: "NETWORKING · WI-FI 6",
    priceCents: 985_000,
    compareCents: 1_160_000,
    rating: 4.4,
    reviews: 57,
    stockState: "in_stock",
    stockLabel: "15 IN STOCK",
    badge: { kind: "discount", label: "-15%" },
    imageCaption: "[ ROUTER SHOT ]",
  },
  {
    id: "p-2d-scanner",
    name: "Wireless 2D Barcode Scanner — stand included",
    category: "POS · SCANNERS",
    priceCents: 1_220_000,
    rating: 4.6,
    reviews: 73,
    stockState: "in_stock",
    stockLabel: "33 IN STOCK",
    badge: { kind: "fast_mover", label: "FAST MOVER" },
    imageCaption: "[ SCANNER SHOT ]",
  },
  {
    id: "p-cash-drawer",
    name: "Cash Drawer — 5 note / 8 coin, RJ11 trigger",
    category: "POS · ACCESSORIES",
    priceCents: 640_000,
    rating: 4.5,
    reviews: 38,
    stockState: "in_stock",
    stockLabel: "50+ IN STOCK",
    imageCaption: "[ DRAWER SHOT ]",
  },
];

export const CATEGORIES: Category[] = [
  { id: "c-laptops", name: "Laptops", count: 312, caption: "[ LAPTOP ]" },
  { id: "c-phones", name: "Phones", count: 208, caption: "[ PHONE ]" },
  { id: "c-pos-printers", name: "POS & Printers", count: 96, caption: "[ POS TERMINAL ]", inverted: true },
  { id: "c-monitors", name: "Monitors", count: 74, caption: "[ MONITOR ]" },
  { id: "c-accessories", name: "Accessories", count: 640, caption: "[ ACCESSORY ]" },
];

// ── Theme chrome copy (not tenant data) ──────────────────────────────────────

export const CATEGORY_RIBBON = [
  "SHOP ALL",
  "LAPTOPS",
  "PHONES & TABLETS",
  "POS & PRINTERS",
  "MONITORS",
  "NETWORKING",
  "ACCESSORIES",
];

export const GRID_FILTERS = ["ALL", "LAPTOPS", "POS", "UNDER 20K"];
