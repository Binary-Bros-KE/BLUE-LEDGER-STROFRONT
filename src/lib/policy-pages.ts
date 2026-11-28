/** The four policy pages a shop gets once it has saved its terms (theme.policies — lib/policies.tsx).
 * Kept apart from lib/policies.tsx so the client-side footer can import it without server code. */
export const POLICY_PAGES = [
  { href: "/returns-refunds", label: "Returns & refunds" },
  { href: "/delivery-policy", label: "Delivery policy" },
  { href: "/terms-of-sale", label: "Terms of sale" },
  { href: "/privacy", label: "Privacy" },
] as const;
