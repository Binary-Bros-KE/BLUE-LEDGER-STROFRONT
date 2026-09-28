// The contract every storefront template implements.
//
// Route files (src/app/**) are template-agnostic: they resolve the tenant, fetch data, and hand it
// to whichever template the store uses (web_stores.templateId → getTemplate()). A template is just
// a set of components that accept exactly these props — so a new template can never need route or
// API changes, and data fetching lives in one place for all of them.

import type { ComponentType, ReactNode } from "react";
import type { StoreShell } from "@/components/StoreChrome";
import type { HomeProductSection } from "@/components/home/HomeSections";
import type { BrandColors } from "@/lib/palette";
import type { Category, Product } from "@/lib/products";
import type { TrylistTheme } from "@/lib/theme";
import type { DeliveryOption } from "@/lib/types";

export type { StoreShell, HomeProductSection };

export type ChromeProps = StoreShell & { children: ReactNode };

export type HomeProps = {
  /** default product grid — only populated when no curated sections are configured */
  products: Product[];
  categories: Category[];
  /** the store's CONTENT config (client-edited from the POS) — hero copy/images, story rows, … */
  theme: TrylistTheme;
  /** curated category rows (themeJson.productSections), already resolved + fetched */
  sections: HomeProductSection[];
};

export type ListingProps = {
  heading: string;
  trail: { label: string; href?: string }[];
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  basePath: string;
  categories: Category[];
  activeCategorySlug?: string;
  /** background image behind the page-header band (category image, else theme default) */
  heroImage?: string;
};

export type ProductDetailProps = {
  product: Product;
  related: Product[];
  categoryName: string | null;
  headerImage?: string;
};

export type CheckoutProps = { methods: DeliveryOption[] };

export type StorefrontTemplate = {
  id: string;
  /** shown in the admin dashboard picker (mirrored there — see SERVER lib/storefront-templates.ts) */
  name: string;
  /** the template's own brand colours, used for any role the admin hasn't overridden */
  colorDefaults: BrandColors;
  /**
   * true = globals.css carries this template's exact, hand-tuned --brand-* values, so only
   * admin-overridden roles are emitted (an untouched store stays pixel-identical). false = every
   * token is derived from colorDefaults + overrides. Only the default template can be pinned —
   * the :root fallbacks are its values.
   */
  pinnedColors: boolean;
  /** extra classes for <html> (next/font variables, …) */
  htmlClassName: string;
  /** Sample CONTENT merged over the empty theme in preview mode only (no live store — local dev),
   * so the template's content-driven sections (deal badge, brand strip…) are visible. */
  previewContent?: Partial<TrylistTheme>;
  Chrome: ComponentType<ChromeProps>;
  Home: ComponentType<HomeProps>;
  Listing: ComponentType<ListingProps>;
  ProductDetail: ComponentType<ProductDetailProps>;
  Checkout: ComponentType<CheckoutProps>;
  NotFound: ComponentType;
};
