// Template 2 — "Adia" (built for ADIA Home Appliances, re-colourable for any retail shop). Rounded
// cards on a light-grey page, Poppins headings, primary-gradient hero + Hot Deals countdown.
//
// Phase 2 ships the chrome (header, category bar, footer, mobile bar/menu, cart drawer) and the home
// page. Listing, product detail and checkout still render Classic's page bodies inside Adia's chrome
// (recoloured by the same tokens, Adia fonts) until phases 3–4 replace them.

import { CheckoutView } from "@/components/pages/CheckoutView";
import { ProductDetail } from "@/components/pages/ProductDetail";
import { ProductsListing } from "@/components/pages/ProductsListing";
import type { StorefrontTemplate } from "../types";
import { AdiaChrome } from "./components/AdiaChrome";
import { inter, poppins } from "./fonts";
import { Home } from "./home/Home";
import { AdiaNotFound } from "./NotFound";

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
  Listing: ProductsListing,
  ProductDetail,
  Checkout: CheckoutView,
  NotFound: AdiaNotFound,
};
