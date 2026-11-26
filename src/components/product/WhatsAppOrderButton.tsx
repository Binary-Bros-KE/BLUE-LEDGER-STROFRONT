"use client";

import { SOCIAL_ICONS } from "@/components/shared/social-icons";
import { useWhatsAppOrder } from "@/lib/whatsapp-order";

/**
 * Classic "Order on WhatsApp" — opens WhatsApp with `message` ready to send to the shop (same
 * lib/whatsapp-order helpers as Adia's WhatsAppButton, in Classic's square style). `icon` is the
 * compact square on product cards; `full` is the labelled button on the product page. Renders
 * nothing when the shop has no WhatsApp number. `message` is built at click time so it carries the
 * latest chosen options and quantity.
 */
export function WhatsAppOrderButton({
  message,
  variant = "full",
  label = "Order on WhatsApp",
  className = "",
}: {
  message: (origin: string) => string;
  variant?: "icon" | "full";
  label?: string;
  className?: string;
}) {
  const wa = useWhatsAppOrder();
  if (!wa.enabled) return null;

  return (
    <a
      href={wa.link(message(wa.origin))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={variant === "icon" ? label : undefined}
      title={variant === "icon" ? label : undefined}
      className={`inline-flex flex-none items-center justify-center gap-2 bg-[#25D366] font-mono font-bold uppercase text-white transition-colors hover:bg-[#1EBE5A] ${
        variant === "icon" ? "size-11" : "h-12 px-6 text-[12px] tracking-[1.6px]"
      } ${className}`}
    >
      {SOCIAL_ICONS.whatsapp(variant === "icon" ? 20 : 18)}
      {variant === "full" ? label : null}
    </a>
  );
}
