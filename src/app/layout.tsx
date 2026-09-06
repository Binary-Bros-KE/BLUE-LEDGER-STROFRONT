import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { CartRoot } from "@/components/CartRoot";
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

// Per-store title/description are set by `generateMetadata()` in app/page.tsx from the live
// `/shop/store` response — the whole reason the storefront is Next.js and not a SPA. This is only
// the fallback.
export const metadata: Metadata = {
  title: "Shop",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${jbmono.variable}`}>
      <body className="bg-white text-navy">
        <CartRoot>{children}</CartRoot>
      </body>
    </html>
  );
}
