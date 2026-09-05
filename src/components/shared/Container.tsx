import type { ReactNode } from "react";

/** Spec §5 — 1440 artboard, 40px content padding desktop / 16px mobile. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-4 md:px-10 ${className}`}>{children}</div>;
}
