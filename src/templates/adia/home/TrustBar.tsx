import { trustIcon } from "@/components/shared/trust-icons";
import type { ThemeTrustItem } from "@/lib/theme";
import { Container } from "../components/Container";

const DEFAULTS: ThemeTrustItem[] = [
  { icon: "truck", title: "Free Delivery", subtitle: "On selected items" },
  { icon: "shield", title: "Genuine Products", subtitle: "Official warranty" },
  { icon: "phone", title: "Secure M-Pesa Payments", subtitle: "Safe & convenient" },
  { icon: "returns", title: "Easy Returns", subtitle: "Hassle free" },
];

/** The shop's own trust points (edited in the POS Online Store tab), else Adia's defaults. */
export function TrustBar({ items }: { items: ThemeTrustItem[] }) {
  const cells = items.length > 0 ? items : DEFAULTS;
  const cols = cells.length >= 4 ? "lg:grid-cols-4" : cells.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <Container className="mt-4 lg:mt-5">
      <div className={`grid grid-cols-2 gap-y-4 rounded-xl border border-line bg-surface p-4 lg:divide-x lg:divide-line lg:p-5 ${cols}`}>
        {cells.map((it, i) => (
          <div key={`${it.title}-${i}`} className="flex items-center gap-3 lg:justify-center lg:px-4">
            <span className="grid size-11 flex-none place-items-center rounded-full bg-primary-soft text-primary-ink">
              {trustIcon(it.icon, 20)}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-[13px] font-semibold text-ink lg:text-[14px]">{it.title}</span>
              {it.subtitle ? <span className="block text-[12px] text-ink-muted">{it.subtitle}</span> : null}
            </span>
          </div>
        ))}
      </div>
    </Container>
  );
}
