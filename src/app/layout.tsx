import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { CartRoot } from "@/components/CartRoot";
import { getStore } from "@/lib/shop-api";
import { siteOrigin } from "@/lib/site-url";
import { loadLook } from "@/lib/store";
import { parseTheme } from "@/lib/theme";
import { getTemplate, templateCssVars } from "@/templates/registry";
import "./globals.css";

// Site-wide metadata for THIS shop: canonical base URL (its custom domain once live), a
// "Page | Store" title template, the favicon from the uploaded logo, and default social-share
// (Open Graph / X) details — every page inherits these and overrides what it knows better.
export async function generateMetadata(): Promise<Metadata> {
  try {
    const store = await getStore();
    const theme = parseTheme(store.theme);
    const logo = theme.brand.logoImageUrl;
    const shareImage = theme.hero.shotImageUrl || theme.hero.backgroundImageUrl || logo;
    const description = theme.hero.sub || `Shop online at ${store.name}.`;
    return {
      metadataBase: new URL(await siteOrigin(store)),
      title: { default: store.name, template: `%s | ${store.name}` },
      description,
      applicationName: store.name,
      ...(logo ? { icons: { icon: logo, apple: logo } } : {}),
      openGraph: {
        type: "website",
        siteName: store.name,
        locale: "en_KE",
        title: store.name,
        description,
        ...(shareImage ? { images: [{ url: shareImage, alt: store.name }] } : {}),
      },
      twitter: {
        card: shareImage ? "summary_large_image" : "summary",
        title: store.name,
        description,
        ...(shareImage ? { images: [shareImage] } : {}),
      },
    };
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
