import Link from "next/link";
import type { ThemeBrand } from "@/lib/theme";

/**
 * Adia wordmark: the uploaded logo if there is one, else a two-line text mark — a heavy
 * primary-coloured name over a light descriptor (the reference's "ADIA / Home Appliances").
 * Lines come from theme.brand; unset, the store name splits on its first space.
 */
export function Logo({
  storeName,
  brand,
  onDark = false,
  compact = false,
}: {
  storeName: string;
  brand?: ThemeBrand;
  onDark?: boolean;
  compact?: boolean;
}) {
  let l1 = brand?.nameLine1?.trim();
  let l2 = brand?.nameLine2?.trim();
  if (!l1 && !l2) {
    const parts = storeName.trim().split(/\s+/);
    l1 = parts[0] || "Shop";
    l2 = parts.slice(1).join(" ") || "Online store";
  }
  const label = `${l1 ?? storeName}${l2 ? ` ${l2}` : ""} — home`;

  if (brand?.logoImageUrl) {
    return (
      <Link href="/" aria-label={label} className="flex flex-none items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brand.logoImageUrl}
          alt=""
          className={`w-auto max-w-[190px] object-contain ${compact ? "h-9" : "h-11"} ${
            onDark ? "rounded-md bg-surface p-1" : ""
          }`}
        />
      </Link>
    );
  }

  return (
    <Link href="/" aria-label={label} className="flex min-w-0 flex-none flex-col leading-none">
      <span
        className={`truncate font-display font-extrabold uppercase tracking-[-0.5px] ${
          compact ? "text-[24px]" : "text-[30px]"
        } ${onDark ? "text-on-secondary" : "text-primary-ink"}`}
        style={{ maxWidth: 220 }}
      >
        {l1}
      </span>
      {l2 ? (
        <span
          className={`mt-0.5 truncate font-display font-medium ${compact ? "text-[11px]" : "text-[13px]"} ${
            onDark ? "text-on-secondary-body" : "text-ink"
          }`}
          style={{ maxWidth: 220 }}
        >
          {l2}
        </span>
      ) : null}
    </Link>
  );
}
