// Template 2 — "Adia" (built for ADIA Home Appliances, re-colourable for any retail shop). Rounded
// cards on a light-grey page, Poppins headings, primary-gradient hero + Hot Deals countdown.
//
// Chrome, home, listing (filter sidebar + sort + price range) and product detail are Adia-designed.
// Checkout still renders Classic's page body inside Adia's chrome until phase 4 replaces it.

import { CheckoutView } from "@/components/pages/CheckoutView";
import type { StorefrontTemplate } from "../types";
import { AdiaChrome } from "./components/AdiaChrome";
import { inter, poppins } from "./fonts";
import { Home } from "./home/Home";
import { Listing } from "./listing/Listing";
import { AdiaNotFound } from "./NotFound";
import { ProductDetail } from "./product/ProductDetail";

export const adiaTemplate: StorefrontTemplate = {
  id: "adia",
  name: "Adia",
  // ADIA red, near-black charcoal, star-rating amber.
  colorDefaults: { primary: "#d71920", secondary: "#1c1c22", accent: "#f5a623" },
  pinnedColors: false,
  htmlClassName: `${poppins.variable} ${inter.variable}`,
  previewContent: {
    dealTile: {
      title: "Hot Deals\nBig savings for every home",
      priceCents: 10_000_00,
      offerPriceCents: 6_000_00,
    },
    brands: ["Samsung", "Hisense", "LG", "Von", "Mika", "Beko", "Bosch"].map((name) => ({ name })),
  },
  Chrome: AdiaChrome,
  Home,
  Listing,
  ProductDetail,
  Checkout: CheckoutView,
  NotFound: AdiaNotFound,
};
