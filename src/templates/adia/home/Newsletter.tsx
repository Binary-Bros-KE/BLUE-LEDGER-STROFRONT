"use client";

import { useState } from "react";
import { FiCheck } from "@/components/shared/icons";
import { whatsappLink } from "@/lib/contact-links";
import type { AdiaHome } from "../content";
import { Container } from "../components/Container";
import { SOCIAL_ICONS } from "../social-icons";

function MailIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

/** Red band: "Get the Latest Deals" + email sign-up (saved for the shop — POS Online Store tab),
 * and a WhatsApp chat pill when the shop has a WhatsApp number. */
export function Newsletter({ section, whatsapp }: { section: AdiaHome["newsletter"]; whatsapp?: string | undefined }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  if (!section.enabled) return null;

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      setMessage("Enter a valid email address");
      return;
    }
    setState("sending");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim() }) });
      const json = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(json?.error ?? "Could not subscribe just now — please try again.");
      setState("done");
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Could not subscribe just now — please try again.");
    }
  }

  return (
    <section className="mt-14 bg-[linear-gradient(120deg,var(--brand-primary-hover)_0%,var(--brand-primary)_100%)] lg:mt-20">
      <Container className="grid items-center gap-6 py-8 lg:grid-cols-[1fr_minmax(0,1.1fr)_auto] lg:gap-10 lg:py-10">
        <div className="flex items-center gap-4 text-on-primary">
          <span className="grid size-14 flex-none place-items-center rounded-full bg-white/15">
            <MailIcon />
          </span>
          <div>
            <h2 className="font-display text-[20px] font-bold lg:text-[24px]">{section.title}</h2>
            {section.body ? <p className="mt-0.5 text-[13px] text-on-primary-soft lg:text-[14px]">{section.body}</p> : null}
          </div>
        </div>

        {state === "done" ? (
          <p className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-4 font-semibold text-on-primary">
            <FiCheck size={18} /> You&rsquo;re subscribed — thank you!
          </p>
        ) : (
          <form onSubmit={subscribe} className="w-full">
            <div className="flex overflow-hidden rounded-xl bg-white p-1.5 shadow-lg">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={section.placeholder}
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-3 text-[14px] text-ink outline-none placeholder:text-ink-faint"
              />
              <button
                type="submit"
                disabled={state === "sending"}
                className="flex-none rounded-lg bg-secondary px-5 py-2.5 font-display text-[14px] font-semibold text-on-secondary transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {state === "sending" ? "…" : section.buttonLabel}
              </button>
            </div>
            {message ? <p className="mt-2 text-[13px] font-medium text-on-primary">{message}</p> : null}
          </form>
        )}

        {whatsapp ? (
          <a
            href={whatsappLink(whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl bg-[#0b0b0e] px-4 py-3 text-white transition-transform hover:-translate-y-0.5"
          >
            <span className="text-[#25D366]">{SOCIAL_ICONS.whatsapp(22)}</span>
            <span className="text-[13px] font-semibold leading-tight">{section.whatsappLabel}</span>
          </a>
        ) : null}
      </Container>
    </section>
  );
}
