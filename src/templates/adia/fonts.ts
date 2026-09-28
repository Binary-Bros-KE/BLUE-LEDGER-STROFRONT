import { Inter, Poppins } from "next/font/google";

// Adia type roles: Poppins = headings, prices, buttons (the rounded geometric look of the
// reference); Inter = body copy + UI text. preload:false — every template's font module is imported
// by the root layout, so preloading here would make every OTHER template's shops download these too.
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});
