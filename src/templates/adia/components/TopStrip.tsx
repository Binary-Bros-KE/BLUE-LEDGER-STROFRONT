import Link from "next/link";
import type { AdiaHome } from "../content";
import { SOCIAL_ICONS, socialHref, type SocialKey } from "../social-icons";
import { Container } from "./Container";

const ORDER: SocialKey[] = ["facebook", "instagram", "tiktok", "youtube", "x", "whatsapp"];

/**
 * The black strip above the header on every Adia page: "🔥 Hot Deals · Grab them now · Shop now"
 * on the left, the shop's social links on the right. All wording + links come from the POS
 * (themeJson.adia.topStrip / .socials); the shop's older announcement line shows when set.
 */
export function TopStrip({
  strip,
  socials,
  announcement,
}: {
  strip: AdiaHome["topStrip"];
  socials: AdiaHome["socials"];
  announcement?: string | undefined;
}) {
  const links = ORDER.flatMap((key) => (socials[key] ? [{ key, href: socialHref(key, socials[key]!) }] : []));
  if (!strip.enabled && links.length === 0 && !announcement) return null;

  return (
    <div className="bg-[#0b0b0e] text-white">
      <Container className="flex h-9 items-center justify-between gap-4 text-[12px] lg:text-[13px]">
        {strip.enabled ? (
          <p className="flex min-w-0 items-center gap-2 truncate">
            <span aria-hidden="true">🔥</span>
            <span className="font-display font-bold uppercase tracking-wide text-accent">{strip.label}</span>
            <span className="hidden text-white/80 sm:inline">{strip.highlight}</span>
            <Link href={strip.cta.href} className="font-semibold underline decoration-primary decoration-2 underline-offset-4 hover:text-accent">
              {strip.cta.label}
            </Link>
          </p>
        ) : (
          <p className="truncate text-white/80">{announcement}</p>
        )}
        {links.length > 0 ? (
          <nav aria-label="Follow us" className="flex flex-none items-center gap-3.5">
            {links.map((l) => (
              <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.key} className="text-white/75 transition-colors hover:text-accent">
                {SOCIAL_ICONS[l.key](15)}
              </a>
            ))}
          </nav>
        ) : null}
      </Container>
    </div>
  );
}
