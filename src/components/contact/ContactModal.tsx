"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FiArrowRight, FiX } from "@/components/shared/icons";
import type { ThemeContact } from "@/lib/theme";
import {
  emailLink,
  facebookLink,
  instagramLink,
  telLink,
  whatsappLink,
} from "@/lib/contact-links";

type Channel = {
  key: string;
  label: string;
  sub: string;
  href: string;
  icon: ReactNode;
  tint: string;
};

// --- brand marks (inline, no dependency) ---------------------------------------------------------
const IWhatsApp = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.96 1.36-.5.05-1.14.24-3.67-.77-3.09-1.22-5.08-4.35-5.24-4.55-.15-.2-1.25-1.66-1.25-3.17 0-1.5.79-2.24 1.07-2.55.28-.3.6-.38.8-.38l.58.01c.19 0 .44-.07.68.52.24.6.83 2.06.9 2.2.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.07 1.31 2.36 1.46.3.15.47.13.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.24.67-.15.28.1 1.74.82 2.04.97.3.15.5.22.57.35.07.12.07.72-.17 1.4Z" />
  </svg>
);
const IPhone = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IMail = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" /><path d="m3 6 9 7 9-7" />
  </svg>
);
const IInstagram = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);
const IFacebook = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z" />
  </svg>
);

function buildChannels(contact: ThemeContact, fallbackPhone?: string | null): Channel[] {
  const out: Channel[] = [];
  const any =
    contact.whatsappSalesNumber ||
    contact.whatsappSupportNumber ||
    contact.email ||
    contact.instagram ||
    contact.facebook;

  if (contact.whatsappSalesNumber) {
    out.push({
      key: "wa-sales",
      label: "WhatsApp",
      sub: `${contact.whatsappSalesLabel || "Sales"} · ${contact.whatsappSalesNumber}`,
      href: whatsappLink(contact.whatsappSalesNumber),
      icon: IWhatsApp,
      tint: "text-green",
    });
  }
  if (contact.whatsappSupportNumber) {
    out.push({
      key: "wa-support",
      label: "WhatsApp",
      sub: `${contact.whatsappSupportLabel || "Support"} · ${contact.whatsappSupportNumber}`,
      href: whatsappLink(contact.whatsappSupportNumber),
      icon: IWhatsApp,
      tint: "text-green",
    });
  }
  if (contact.email) {
    out.push({
      key: "email",
      label: "Email",
      sub: contact.email,
      href: emailLink(contact.email),
      icon: IMail,
      tint: "text-navy",
    });
  }
  if (contact.instagram) {
    out.push({
      key: "ig",
      label: "Instagram",
      sub: contact.instagram.startsWith("@") ? contact.instagram : `@${contact.instagram}`,
      href: instagramLink(contact.instagram),
      icon: IInstagram,
      tint: "text-red",
    });
  }
  if (contact.facebook) {
    out.push({
      key: "fb",
      label: "Facebook",
      sub: contact.facebook.startsWith("@") ? contact.facebook : `@${contact.facebook}`,
      href: facebookLink(contact.facebook),
      icon: IFacebook,
      tint: "text-blue",
    });
  }

  // Nothing configured — fall back to the store's own phone as a call + WhatsApp row.
  if (!any && fallbackPhone) {
    out.push({
      key: "wa-fallback",
      label: "WhatsApp",
      sub: fallbackPhone,
      href: whatsappLink(fallbackPhone),
      icon: IWhatsApp,
      tint: "text-green",
    });
    out.push({
      key: "call",
      label: "Call us",
      sub: fallbackPhone,
      href: telLink(fallbackPhone),
      icon: IPhone,
      tint: "text-navy",
    });
  }
  return out;
}

// --- look per template ------------------------------------------------------------------------
// The pop-up's behaviour is shared; its skin follows the template ("classic" = Trylist's square,
// mono, offset-shadow card — unchanged; "soft" = Adia's rounded card).
export type ContactVariant = "classic" | "soft";

const SKIN: Record<ContactVariant, Record<string, string>> = {
  classic: {
    overlay: "bg-[rgba(11,14,40,0.55)]",
    card: "blk relative w-full max-w-[440px] border-[1.5px] border-navy bg-cream",
    eyebrow: "font-mono text-[11px] font-bold uppercase tracking-[3px] text-green",
    title: "mt-1 font-sans text-[28px] font-black leading-none tracking-[-0.5px] text-navy",
    close: "grid size-9 flex-none place-items-center border-[1.5px] border-navy text-navy transition-colors hover:bg-navy hover:text-white",
    rule: "border-t border-dashed border-slate/40",
    empty: "py-6 text-center font-mono text-[11px] uppercase tracking-[1.4px] text-slate",
    row: "group flex items-center gap-4 border-b border-dashed border-slate/40 py-3.5",
    icon: "grid size-14 flex-none place-items-center border border-navy/15 bg-white",
    label: "block font-sans text-[16px] font-black text-navy",
    sub: "block truncate font-mono text-[12px] uppercase tracking-[0.5px] text-slate",
    arrow: "flex-none -rotate-45 text-slate transition-colors group-hover:text-navy",
  },
  soft: {
    overlay: "bg-black/50",
    card: "relative w-full max-w-[440px] rounded-2xl bg-surface shadow-2xl",
    eyebrow: "text-[12px] font-semibold uppercase tracking-wide text-primary-ink",
    title: "mt-1 font-display text-[24px] font-bold leading-tight text-ink",
    close: "grid size-9 flex-none place-items-center rounded-full bg-surface-alt text-ink transition-colors hover:bg-line",
    rule: "border-t border-line",
    empty: "py-6 text-center text-[14px] text-ink-muted",
    row: "group -mx-2 flex items-center gap-4 rounded-xl border-b border-line px-2 py-3 transition-colors last:border-b-0 hover:bg-surface-alt",
    icon: "grid size-12 flex-none place-items-center rounded-full bg-surface-alt",
    label: "block font-display text-[15px] font-semibold text-ink",
    sub: "block truncate text-[13px] text-ink-muted",
    arrow: "flex-none -rotate-45 text-ink-faint transition-colors group-hover:text-primary-ink",
  },
};

// --- context ----------------------------------------------------------------------------------
type ContactCtx = { open: () => void; hasChannels: boolean };
const Ctx = createContext<ContactCtx | null>(null);

export function useContact(): ContactCtx {
  return useContext(Ctx) ?? { open: () => undefined, hasChannels: false };
}

export function ContactProvider({
  contact,
  fallbackPhone,
  variant = "classic",
  children,
}: {
  contact: ThemeContact;
  fallbackPhone?: string | null;
  variant?: ContactVariant;
  children: ReactNode;
}) {
  const k = SKIN[variant];
  const [isOpen, setOpen] = useState(false);
  const channels = useMemo(() => buildChannels(contact, fallbackPhone), [contact, fallbackPhone]);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  return (
    <Ctx.Provider value={{ open, hasChannels: channels.length > 0 }}>
      {children}
      {isOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Contact us">
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className={`animate-overlay absolute inset-0 ${k.overlay}`}
          />
          <div className={`${k.card} animate-[sheet-in_200ms_cubic-bezier(0.2,0.8,0.2,1)]`}>
            <div className="flex items-start justify-between gap-4 p-6 pb-4">
              <div>
                <span className={k.eyebrow}>Get in touch</span>
                <h2 className={k.title}>
                  Contact Us
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className={k.close}
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="px-6 pb-6">
              <div className={k.rule} />
              {channels.length === 0 ? (
                <p className={k.empty}>
                  No contact details yet
                </p>
              ) : (
                channels.map((c) => (
                  <a
                    key={c.key}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={k.row}
                  >
                    <span className={`${k.icon} ${c.tint}`}>
                      {c.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={k.label}>{c.label}</span>
                      <span className={k.sub}>
                        {c.sub}
                      </span>
                    </span>
                    <FiArrowRight
                      size={15}
                      className={k.arrow}
                    />
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </Ctx.Provider>
  );
}
