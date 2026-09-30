"use client";

import { useWhatsAppOrder } from "@/lib/whatsapp-order";
import { SOCIAL_ICONS } from "../social-icons";

/**
 * "Order on WhatsApp" — opens WhatsApp with `message` ready to send to the shop. `icon` is the
 * compact square (product cards, where there's no room for words); `full` is the labelled button.
 * Renders nothing when the shop has no WhatsApp number. `message` is a function so it's built from
 * the latest state (chosen variant, quantity, typed details) at the moment of the click.
 */
export function WhatsAppButton({
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

  const base =
    "flex flex-none items-center justify-center gap-2 rounded-lg bg-[#25D366] font-display font-semibold text-white transition-colors hover:bg-[#1EBE5A]";
  return (
    <a
      href={wa.link(message(wa.origin))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={variant === "icon" ? label : undefined}
      title={variant === "icon" ? label : undefined}
      className={`${base} ${variant === "icon" ? "size-10" : "h-12 w-full text-[15px]"} ${className}`}
    >
      {SOCIAL_ICONS.whatsapp(variant === "icon" ? 20 : 20)}
      {variant === "full" ? label : null}
    </a>
  );
}
