"use client";

import { ContactButton } from "@/components/contact/ContactButton";
import { Container } from "@/components/shared/Container";
import { Diamond, FiChevronDown } from "@/components/shared/icons";

const DEFAULT_ANNOUNCEMENT = "Free Delivery within Nairobi - CBD.";

// Navy band above the header. `announcement` is theme-configurable; "Contact" opens the shared
// contact pop-up. Track-order and the currency selector are inert for now.
export function TopBar({ announcement }: { announcement?: string }) {
  const text = announcement?.trim() || DEFAULT_ANNOUNCEMENT;

  return (
    <div className="bg-navy">
      <Container className="flex items-center justify-between gap-4 py-1 font-mono text-[11px] uppercase tracking-[1.4px] text-[#c9cce6] sm:py-2.5 sm:text-[12px]">
        {/* mobile */}
        <div className="flex flex-1 items-center justify-center gap-1.5 py-0.5 sm:hidden">
          <Diamond size={8} className="text-amber" />
          <span className="text-amber">{text}</span>
        </div>

        {/* desktop */}
        <div className="hidden items-center gap-2 sm:flex">
          <Diamond size={9} className="text-amber" />
          <span>{text}</span>
        </div>
        <div className="hidden items-center gap-6 sm:flex">
          <a href="#" className="text-[#c9cce6] hover:text-amber">
            Track order
          </a>
          <ContactButton className="uppercase tracking-[1.4px] text-[#c9cce6] transition-colors hover:text-amber">
            Contact
          </ContactButton>
          <button type="button" className="flex items-center gap-1 text-amber">
            KES <FiChevronDown size={12} />
          </button>
        </div>
      </Container>
    </div>
  );
}
