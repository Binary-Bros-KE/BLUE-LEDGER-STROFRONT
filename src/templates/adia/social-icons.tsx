import type { ReactNode } from "react";
import { whatsappLink } from "@/lib/contact-links";

// Filled social brand marks (24×24), inline like the rest of the icon set — no icon dependency.

function Mark({ size = 16, children }: { size?: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {children}
    </svg>
  );
}

export const SOCIAL_ICONS = {
  facebook: (s?: number) => (
    <Mark size={s}>
      <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.56V4.63A20.9 20.9 0 0 0 14.25 4.5c-2.25 0-3.79 1.37-3.79 3.9v2.16H7.92v2.94h2.54V21h3.04Z" />
    </Mark>
  ),
  instagram: (s?: number) => (
    <Mark size={s}>
      <path d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21.4 8.1c-.06-1.4-.37-2.64-1.39-3.66C19 3.43 17.76 3.12 16.36 3.06 14.92 2.98 9.08 2.98 7.64 3.06 6.25 3.12 5 3.43 3.99 4.44 2.97 5.46 2.66 6.7 2.6 8.1c-.08 1.44-.08 6.36 0 7.8.06 1.4.37 2.64 1.39 3.66C5 20.57 6.24 20.88 7.64 20.94c1.44.08 7.28.08 8.72 0 1.4-.06 2.64-.37 3.66-1.38 1.01-1.02 1.32-2.26 1.38-3.66.08-1.44.08-6.36 0-7.8Zm-2.1 9.9a2.8 2.8 0 0 1-1.58 1.58c-1.1.44-3.7.34-4.92.34s-3.82.1-4.92-.34A2.8 2.8 0 0 1 6.3 18c-.44-1.1-.34-3.72-.34-4.93s-.1-3.83.34-4.93a2.8 2.8 0 0 1 1.58-1.58c1.1-.44 3.7-.34 4.92-.34s3.82-.1 4.92.34A2.8 2.8 0 0 1 19.3 8.14c.44 1.1.34 3.72.34 4.93s.1 3.83-.34 4.93Z" />
    </Mark>
  ),
  tiktok: (s?: number) => (
    <Mark size={s}>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.59-2.6 2.6 2.6 0 0 1 3.37-2.48V9.66a5.69 5.69 0 0 0-6.46 5.64 5.7 5.7 0 0 0 5.68 5.7 5.69 5.69 0 0 0 5.68-5.7V9.01a7.34 7.34 0 0 0 4.3 1.38V7.32a4.28 4.28 0 0 1-3.24-1.5Z" />
    </Mark>
  ),
  youtube: (s?: number) => (
    <Mark size={s}>
      <path d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41a2.51 2.51 0 0 0-1.77 1.78A26.3 26.3 0 0 0 2 12a26.3 26.3 0 0 0 .42 4.81 2.47 2.47 0 0 0 1.77 1.75C5.75 19 12 19 12 19s6.25 0 7.81-.44a2.47 2.47 0 0 0 1.77-1.75A26.3 26.3 0 0 0 22 12a26.3 26.3 0 0 0-.42-4.81ZM10 15V9l5.2 3L10 15Z" />
    </Mark>
  ),
  x: (s?: number) => (
    <Mark size={s}>
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z" />
    </Mark>
  ),
  whatsapp: (s?: number) => (
    <Mark size={s}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.96L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.09.89.9-3-.2-.31a8.2 8.2 0 1 1 6.87 3.75Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.53.06a6.73 6.73 0 0 1-3.37-2.94c-.25-.44.25-.41.72-1.36.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.77 4.77 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.69c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.66-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </Mark>
  ),
} as const;

export type SocialKey = keyof typeof SOCIAL_ICONS;

/** A social handle or URL → a link. Bare handles become the network's profile URL. */
export function socialHref(key: SocialKey, value: string): string {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, "");
  switch (key) {
    case "facebook":
      return `https://facebook.com/${handle}`;
    case "instagram":
      return `https://instagram.com/${handle}`;
    case "tiktok":
      return `https://www.tiktok.com/@${handle}`;
    case "youtube":
      return `https://youtube.com/@${handle}`;
    case "x":
      return `https://x.com/${handle}`;
    case "whatsapp":
      return whatsappLink(handle);
  }
}
