"use client";

import type { ReactNode } from "react";
import { useContact } from "./ContactModal";

/** A button that opens the shared Contact pop-up — drop it in wherever a "contact us / talk to
 * sales" CTA lives (works inside server components). */
export function ContactButton({
  children,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const { open } = useContact();
  return (
    <button type="button" onClick={open} className={className} aria-label={ariaLabel} aria-haspopup="dialog">
      {children}
    </button>
  );
}
