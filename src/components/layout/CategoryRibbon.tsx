import { Container } from "@/components/shared/Container";
import { FiArrowRight } from "@/components/shared/icons";
import { CATEGORY_RIBBON } from "@/lib/products";

const MOBILE_ITEMS = ["ALL", "LAPTOPS", "PHONES", "POS", "DEALS"];

// Spec §4 — amber band, 11px 40px, border-bottom 2px navy. Mono 12px navy, tracking 1.6px.
// Mobile: horizontal scroll, 10px, 5 items.
export function CategoryRibbon() {
  return (
    <div className="border-b-2 border-navy bg-amber">
      <Container className="hidden items-center justify-between gap-6 py-[11px] sm:flex">
        <nav className="flex items-center gap-6 font-mono text-[12px] uppercase tracking-[1.6px]">
          {CATEGORY_RIBBON.map((label, i) => (
            <a
              key={label}
              href="#"
              className={`text-navy transition-opacity hover:opacity-60 ${i === 0 ? "font-bold" : "font-normal"}`}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#"
          className="flex items-center gap-1 font-mono text-[12px] font-bold uppercase tracking-[1.6px] text-[#b3271a] transition-opacity hover:opacity-70"
        >
          Clearance <FiArrowRight size={13} />
        </a>
      </Container>

      <div className="no-scrollbar flex gap-5 overflow-x-auto px-4 py-2.5 sm:hidden">
        {MOBILE_ITEMS.map((label, i) => (
          <a
            key={label}
            href="#"
            className={`flex-none font-mono text-[10px] uppercase tracking-[1.6px] text-navy ${i === 0 ? "font-bold" : ""}`}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
