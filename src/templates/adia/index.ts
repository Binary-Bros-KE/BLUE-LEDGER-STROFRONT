// Template 2 — "Adia" (built for ADIA Home Appliances, re-colourable for any retail shop). Rounded
// cards on a light-grey page, Poppins headings, primary-gradient hero + Hot Deals countdown.
//
// Every page is Adia-designed: chrome, home, listing (filter sidebar + sort + price range), product
// detail and checkout (real orders → the shop's POS "Online Orders" inbox).

import type { StorefrontTemplate } from "../types";
import { Checkout } from "./checkout/Checkout";
import { Categories } from "./categories/Categories";
import { AdiaChrome } from "./components/AdiaChrome";
import { inter, poppins } from "./fonts";
import { adiaHomeRows } from "./content";
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
  homeRows: (theme) => adiaHomeRows(theme.adia),
  Listing,
  ProductDetail,
  Checkout,
  Categories,
  NotFound: AdiaNotFound,
};
