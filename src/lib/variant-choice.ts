"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, StockState } from "./products";
import type { ShopVariant } from "./types";

// Headless variant selection for a product page (SERVER lib/variants.ts, DESKTOP docs/VARIANTS.md).
// Every template draws its own chips; the rules live here so they behave identically:
//  - a value is offered only when some variant has it AND agrees with the other picks so far
//  - once every option is picked the variant resolves: its price, "was" price and stock drive the page
//  - separate stock: each variant is its own product page, so resolving one navigates there
//    (its own photos/description), and the page opens with its own values already picked.

/** What goes into the cart for a chosen variant. */
export type CartChoice = {
  productId: string;
  variantKey: string | null;
  name: string;
  /** shown under the name in the cart ("Colour: Red"); null when the name already says it */
  spec: string | null;
  priceCents: number;
  stock: StockState;
};

function specText(options: { name: string }[], values: Record<string, string>): string {
  return options
    .map((o) => (values[o.name] ? `${o.name}: ${values[o.name]}` : ""))
    .filter(Boolean)
    .join(" · ");
}

export function useVariantChoice(product: Product) {
  const router = useRouter();
  const info = product.variants ?? null;
  const initial = useMemo<Record<string, string>>(() => {
    if (!info || !info.selectedKey) return {};
    return { ...(info.variants.find((v) => v.key === info.selectedKey)?.values ?? {}) };
  }, [info]);
  const [selected, setSelected] = useState<Record<string, string>>(initial);
  useEffect(() => setSelected(initial), [initial]);

  const options = info?.options ?? [];
  const variants = info?.variants ?? [];

  function available(optionName: string, value: string): boolean {
    return variants.some(
      (v) =>
        v.values[optionName] === value &&
        Object.entries(selected).every(([name, picked]) => name === optionName || v.values[name] === picked),
    );
  }

  const resolved: ShopVariant | null =
    info && options.every((o) => selected[o.name])
      ? (variants.find((v) => options.every((o) => v.values[o.name] === selected[o.name])) ?? null)
      : null;

  function choose(optionName: string, value: string) {
    const next = { ...selected, [optionName]: value };
    // a pick that no longer fits the others clears those
    for (const [name, picked] of Object.entries(next)) {
      if (name !== optionName && !variants.some((v) => v.values[optionName] === value && v.values[name] === picked)) {
        delete next[name];
      }
    }
    setSelected(next);
    if (info?.mode === "separate") {
      const hit = variants.find((v) => options.every((o) => v.values[o.name] === next[o.name]));
      if (hit && hit.productId !== product.id) router.replace(`/product/${encodeURIComponent(hit.productId)}`, { scroll: false });
    }
  }

  const hasVariants = Boolean(info && variants.length > 0);
  const choice: CartChoice | null = !hasVariants
    ? { productId: product.id, variantKey: null, name: product.name, spec: null, priceCents: product.priceCents, stock: product.stockState }
    : resolved
      ? {
          productId: resolved.productId,
          variantKey: info!.mode === "shared" ? resolved.key : null,
          name: resolved.name,
          spec: info!.mode === "shared" ? specText(options, resolved.values) : null,
          priceCents: resolved.priceCents,
          stock: resolved.stock,
        }
      : null;

  const missing = options.filter((o) => !selected[o.name]).map((o) => o.name);
  const prices = variants.map((v) => v.priceCents);

  return {
    hasVariants,
    options,
    selected,
    available,
    choose,
    /** null until every option is picked (always set for a product without variants) */
    choice,
    /** "Choose Size and Colour" while something's missing */
    prompt: missing.length ? `Choose ${missing.join(" and ")}` : null,
    priceCents: resolved?.priceCents ?? (hasVariants ? Math.min(...prices) : product.priceCents),
    /** true while showing a "From …" price (no variant resolved yet and prices differ) */
    isFromPrice: hasVariants && !resolved && Math.min(...prices) !== Math.max(...prices),
    compareCents: resolved ? (resolved.compareAtPriceCents ?? undefined) : hasVariants ? undefined : product.compareCents,
    stock: (resolved?.stock ?? (hasVariants && !resolved ? null : product.stockState)) as StockState | null,
  };
}
