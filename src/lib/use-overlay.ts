"use client";

import { useEffect } from "react";

/** While an overlay (drawer, sheet, menu) is open: lock page scroll and close on Escape. */
export function useOverlay(open: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
}
