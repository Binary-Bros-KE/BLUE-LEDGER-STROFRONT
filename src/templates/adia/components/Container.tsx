import type { ReactNode } from "react";

/** Adia content width — 1280px, 16px gutters on phones, 24px from lg. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-4 lg:px-6 ${className}`}>{children}</div>;
}
