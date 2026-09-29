import { trustIcon } from "@/components/shared/trust-icons";
import type { ThemeTrustItem } from "@/lib/theme";
import { Container } from "../components/Container";

// Never a payment promise — how a customer pays is agreed with the shop, not stated by the template.
const DEFAULTS: ThemeTrustItem[] = [
  { icon: "truck", title: "Fast Delivery", subtitle: "To your door, countrywide" },
  { icon: "shield", title: "Genuine Products", subtitle: "Manufacturer warranty" },
  { icon: "tag", title: "Pick Up or Delivery", subtitle: "Whichever suits you" },
  { icon: "support", title: "Real Support", subtitle: "Talk to our team" },
];

/** The features band that overlaps the bottom of the hero — the shop's own trust points (POS
 * "Trust bar" editor), else Adia's defaults. */
export function Features({ items }: { items: ThemeTrustItem[] }) {
  const cells = items.length > 0 ? items : DEFAULTS;
  const cols = cells.length >= 4 ? "lg:grid-cols-4" : cells.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <Container className="relative z-10 -mt-12 lg:-mt-14">
      <div className={`grid grid-cols-2 gap-y-5 rounded-2xl border border-line bg-surface p-5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)] lg:divide-x lg:divide-line lg:p-6 ${cols}`}>
        {cells.map((it, i) => (
          <div key={`${it.title}-${i}`} className="flex items-center gap-3.5 lg:justify-center lg:px-5">
            <span className="grid size-12 flex-none place-items-center rounded-xl bg-primary-soft text-primary-ink">{trustIcon(it.icon, 22)}</span>
            <span className="min-w-0 leading-tight">
              <span className="block font-display text-[14px] font-semibold text-ink lg:text-[15px]">{it.title}</span>
              {it.subtitle ? <span className="mt-0.5 block text-[12px] text-ink-muted lg:text-[13px]">{it.subtitle}</span> : null}
            </span>
          </div>
        ))}
      </div>
    </Container>
  );
}
