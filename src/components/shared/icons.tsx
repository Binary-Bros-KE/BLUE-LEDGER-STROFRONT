import type { ReactNode, SVGProps } from "react";

/*
 * Inline Feather-equivalent icons. The spec (§3) lists react-icons (`Fi*`, `Fa*`); Feather and
 * lucide/react-icons/fi share the same 24×24 / stroke-2 / round-cap geometry, so these render
 * identically. Kept local to avoid a dependency. Swapping to `react-icons/fi` later is a
 * one-line-per-icon import change — the names here mirror theirs.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Line({ size = 16, strokeWidth = 2, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

function Solid({ size = 16, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

/* ── Feather line icons ─────────────────────────────────────────────────────── */

export const FiHeart = (p: IconProps) => (
  <Line {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  </Line>
);

export const FiSearch = (p: IconProps) => (
  <Line {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </Line>
);

export const FiX = (p: IconProps) => (
  <Line {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Line>
);

export const FiMinus = (p: IconProps) => (
  <Line {...p}>
    <path d="M5 12h14" />
  </Line>
);

export const FiPlus = (p: IconProps) => (
  <Line {...p}>
    <path d="M12 5v14M5 12h14" />
  </Line>
);

export const FiMaximize2 = (p: IconProps) => (
  <Line {...p}>
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </Line>
);

export const FiRepeat = (p: IconProps) => (
  <Line {...p}>
    <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
  </Line>
);

export const FiClock = (p: IconProps) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Line>
);

export const FiZap = (p: IconProps) => (
  <Line {...p}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </Line>
);

export const FiShield = (p: IconProps) => (
  <Line {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Line>
);

export const FiCreditCard = (p: IconProps) => (
  <Line {...p}>
    <rect x="1" y="4" width="22" height="16" />
    <path d="M1 10h22" />
  </Line>
);

export const FiArrowRight = (p: IconProps) => (
  <Line {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </Line>
);

export const FiMessageCircle = (p: IconProps) => (
  <Line {...p}>
    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
  </Line>
);

export const FiMenu = (p: IconProps) => (
  <Line {...p}>
    <path d="M3 12h18M3 6h18M3 18h18" />
  </Line>
);

export const FiShoppingCart = (p: IconProps) => (
  <Line {...p}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </Line>
);

export const FiShoppingBag = (p: IconProps) => (
  <Line {...p}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Line>
);

export const FiGrid = (p: IconProps) => (
  <Line {...p}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </Line>
);

export const FiChevronDown = (p: IconProps) => (
  <Line {...p}>
    <path d="M6 9l6 6 6-6" />
  </Line>
);

export const FiUser = (p: IconProps) => (
  <Line {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Line>
);

export const FiPlay = (p: IconProps) => (
  <Solid {...p}>
    <path d="M8 5v14l11-7z" />
  </Solid>
);

/* ── Solid icons ───────────────────────────────────────────────────────────── */

export const FaHeart = (p: IconProps) => (
  <Solid {...p}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </Solid>
);

export const FaStar = (p: IconProps) => (
  <Solid {...p}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Solid>
);

/** ◆ — the small mark that prefixes mono eyebrows. */
export const Diamond = (p: IconProps) => (
  <Solid {...p}>
    <path d="M12 2l10 10-10 10L2 12z" />
  </Solid>
);

/* ── Added for the Adia template (same Feather geometry) ───────────────────── */

export const FiTruck = (p: IconProps) => (
  <Line {...p}>
    <rect x="1" y="3" width="15" height="13" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </Line>
);

export const FiSmartphone = (p: IconProps) => (
  <Line {...p}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </Line>
);

export const FiHeadphones = (p: IconProps) => (
  <Line {...p}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </Line>
);

export const FiChevronLeft = (p: IconProps) => (
  <Line {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Line>
);

export const FiChevronRight = (p: IconProps) => (
  <Line {...p}>
    <path d="M9 18l6-6-6-6" />
  </Line>
);

export const FiHome = (p: IconProps) => (
  <Line {...p}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </Line>
);

export const FiMapPin = (p: IconProps) => (
  <Line {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </Line>
);

export const FiPhone = (p: IconProps) => (
  <Line {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </Line>
);

export const FiTrash2 = (p: IconProps) => (
  <Line {...p}>
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
  </Line>
);

export const FiTag = (p: IconProps) => (
  <Line {...p}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <path d="M7 7h.01" />
  </Line>
);

export const FiSliders = (p: IconProps) => (
  <Line {...p}>
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
  </Line>
);

export const FiCheckCircle = (p: IconProps) => (
  <Line {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4 12 14.01l-3-3" />
  </Line>
);

export const FiCheck = (p: IconProps) => (
  <Line {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Line>
);

export const FiLock = (p: IconProps) => (
  <Line {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Line>
);
