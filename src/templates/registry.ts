import { brandCssVars, type ColorOverrides } from "@/lib/palette";
import { adiaTemplate } from "./adia";
import { classicTemplate } from "./classic";
import type { StorefrontTemplate } from "./types";

/**
 * Every template this storefront can render, keyed by web_stores.templateId. SERVER only accepts
 * ids listed in its lib/storefront-templates.ts, and the admin picker lists them from
 * NEXT/admin src/lib/storefront-templates.ts — add a new template to all three, storefront first.
 */
const TEMPLATES: Record<string, StorefrontTemplate> = {
  classic: classicTemplate,
  adia: adiaTemplate,
};

export const DEFAULT_TEMPLATE = classicTemplate;

/** Unknown / retired ids fall back to the default rather than 404 — a shop must always render. */
export function getTemplate(id: string | null | undefined): StorefrontTemplate {
  return (id && TEMPLATES[id]) || DEFAULT_TEMPLATE;
}

/** The --brand-* CSS custom properties for <html style> — see src/lib/palette.ts. */
export function templateCssVars(template: StorefrontTemplate, colors: ColorOverrides): Record<string, string> {
  return brandCssVars(template.colorDefaults, colors, template.pinnedColors);
}
