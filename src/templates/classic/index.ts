// Template 1 — "Classic" (built for Trylist). Engineering-grid navy, zero-radius, amber offset
// shadows. Its components live in src/components/** (they predate the template system); this
// module is the one place that binds them into the StorefrontTemplate contract.

import { StoreChrome } from "@/components/StoreChrome";
import { HomeSections } from "@/components/home/HomeSections";
import { CheckoutView } from "@/components/pages/CheckoutView";
import { ProductDetail } from "@/components/pages/ProductDetail";
import { ProductsListing } from "@/components/pages/ProductsListing";
import type { StorefrontTemplate } from "../types";
import { archivo, jbmono } from "./fonts";
import { ClassicNotFound } from "./NotFound";

export const classicTemplate: StorefrontTemplate = {
  id: "classic",
  name: "Classic",
  // Must equal the :root fallbacks in globals.css (spec §1 blue / navy / amber).
  colorDefaults: { primary: "#2f55e8", secondary: "#141a47", accent: "#f5b21a" },
  pinnedColors: true,
  htmlClassName: `${archivo.variable} ${jbmono.variable}`,
  Chrome: StoreChrome,
  Home: HomeSections,
  Listing: ProductsListing,
  ProductDetail,
  Checkout: CheckoutView,
  NotFound: ClassicNotFound,
};
