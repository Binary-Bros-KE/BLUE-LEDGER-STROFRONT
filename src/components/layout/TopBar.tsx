import { Container } from "@/components/shared/Container";
import { Diamond, FiChevronDown } from "@/components/shared/icons";

// Spec §4 — navy band, 10px 40px. Mono 12px, tracking 1.4px. Mobile: one centred amber line.
export function TopBar() {
  return (
    <div className="bg-navy">
      <Container className="flex items-center justify-between gap-4 py-2.5 font-mono text-[12px] uppercase tracking-[1.4px] text-[#c9cce6]">
        {/* mobile */}
        <div className="flex flex-1 items-center justify-center gap-2 sm:hidden">
          <Diamond size={9} className="text-amber" />
          <span className="text-amber">Free delivery over KSH 20,000</span>
        </div>

        {/* desktop */}
        <div className="hidden items-center gap-2 sm:flex">
          <Diamond size={9} className="text-amber" />
          <span>Free delivery in Nairobi over KSH 20,000</span>
        </div>
        <div className="hidden items-center gap-6 sm:flex">
          <a href="#" className="text-[#c9cce6] hover:text-amber">
            Track order
          </a>
          <span>Support · 0700 000 000</span>
          <button type="button" className="flex items-center gap-1 text-amber">
            KES <FiChevronDown size={12} />
          </button>
        </div>
      </Container>
    </div>
  );
}
