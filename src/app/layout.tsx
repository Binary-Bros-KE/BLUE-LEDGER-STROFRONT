import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { CartRoot } from "@/components/CartRoot";
import { getStore } from "@/lib/shop-api";
import { parseTheme } from "@/lib/theme";
import "./globals.css";

// Spec §2 — the two (and only two) type roles.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jbmono",
  display: "swap",
});

// Per-store title/description are set by `generateMetadata()` on each page. Here we resolve the
// site-wide favicon from the tenant's uploaded brand logo (themeJson.brand.logoImageUrl).
export async function generateMetadata(): Promise<Metadata> {
  try {
    const store = await getStore();
    const logo = parseTheme(store.theme).brand.logoImageUrl;
    return { title: "Shop", ...(logo ? { icons: { icon: logo, apple: logo } } : {}) };
  } catch {
    return { title: "Shop" };
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${jbmono.variable}`}>
      <body className="bg-white text-navy">
        <CartRoot>{children}</CartRoot>
      </body>
    </html>
  );
}
