import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { CartRoot } from "@/components/CartRoot";
import { getStore } from "@/lib/shop-api";
import { loadLook } from "@/lib/store";
import { parseTheme } from "@/lib/theme";
import { getTemplate, templateCssVars } from "@/templates/registry";
import "./globals.css";

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Look & feel is decided once, here: `data-template` scopes each template's base CSS (globals.css)
  // and the inline --brand-* vars recolour it. Both are server-rendered, so there's no flash of the
  // default palette before hydration.
  const look = await loadLook();
  const template = getTemplate(look.template);
  const brandVars = templateCssVars(template, look.colors) as CSSProperties;

  return (
    <html lang="en" data-template={template.id} className={template.htmlClassName} style={brandVars}>
      <body>
        <CartRoot>{children}</CartRoot>
      </body>
    </html>
  );
}
