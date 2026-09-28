import type { StoreShell } from "@/components/StoreChrome";
import { toThemeCategory } from "./adapter";
import { DEV_TEMPLATE, DEV_THEME_COLORS } from "./env";
import { parseColors, type ColorOverrides } from "./palette";
import { CATEGORIES as SAMPLE_CATEGORIES } from "./products";
import { getCategories, getStore, ShopApiError } from "./shop-api";
import { EMPTY_THEME, parseTheme } from "./theme";

/** The store's look & feel (admin-set): which template, and its brand-colour overrides. */
export type StoreLook = { template: string | null; colors: ColorOverrides };

function devColors(): ColorOverrides {
  if (!DEV_THEME_COLORS) return {};
  try {
    return parseColors(JSON.parse(DEV_THEME_COLORS));
  } catch {
    console.warn("[storefront] DEV_THEME_COLORS is not valid JSON — ignored");
    return {};
  }
}

function applyDevLook(look: StoreLook): StoreLook {
  return {
    template: DEV_TEMPLATE || look.template,
    colors: { ...look.colors, ...devColors() },
  };
}

/**
 * Template + colours for the current request's store. Never throws: with no live store (preview /
 * SERVER down) it's the default template with its own colours. Shares getStore()'s per-request
 * cache with loadShell(), so calling both costs one SERVER round-trip.
 */
export async function loadLook(): Promise<StoreLook> {
  try {
    const store = await getStore();
    return applyDevLook({ template: store.template ?? null, colors: parseColors(store.colors) });
  } catch {
    return applyDevLook({ template: null, colors: {} });
  }
}

/**
 * Resolves the header/footer/chrome data for the current request's tenant. On failure (no live
 * store at this host — e.g. localhost without DEV_STORE_DOMAIN, or SERVER down) it returns the
 * Trylist sample so the theme is always viewable. Every page calls this, then fetches its own
 * catalogue / product on top.
 */
export async function loadShell(): Promise<{ shell: StoreShell; preview: boolean }> {
  const look = await loadLook();
  try {
    const [store, categories] = await Promise.all([getStore(), getCategories()]);
    return {
      shell: {
        storeName: store.name,
        currency: store.currency,
        address: store.contact.address,
        phone: store.contact.phone,
        categories: categories.map(toThemeCategory),
        theme: parseTheme(store.theme),
        templateId: look.template,
      },
      preview: false,
    };
  } catch (err) {
    const status = err instanceof ShopApiError ? err.status : "no response";
    console.warn(`[storefront] /shop shell unavailable (${status}) — sample data`);
    return {
      shell: {
        storeName: "TRYLIST",
        currency: "KSH",
        categories: SAMPLE_CATEGORIES,
        theme: EMPTY_THEME,
        templateId: look.template,
        preview: true,
      },
      preview: true,
    };
  }
}
