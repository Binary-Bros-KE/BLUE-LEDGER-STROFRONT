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
