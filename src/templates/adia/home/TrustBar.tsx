import type { ReactNode } from "react";
import { FiRepeat, FiShield, FiSmartphone, FiTruck } from "@/components/shared/icons";
import { Container } from "../components/Container";

const ITEMS: { icon: ReactNode; title: string; sub: string }[] = [
  { icon: <FiTruck size={20} />, title: "Free Delivery", sub: "On selected items" },
  { icon: <FiShield size={20} />, title: "Genuine Products", sub: "Official warranty" },
  { icon: <FiSmartphone size={20} />, title: "Secure M-Pesa Payments", sub: "Safe & convenient" },
  { icon: <FiRepeat size={20} />, title: "Easy Returns", sub: "Hassle free" },
];

export function TrustBar() {
  return (
    <Container className="mt-4 lg:mt-5">
      <div className="grid grid-cols-2 gap-y-4 rounded-xl border border-line bg-surface p-4 lg:grid-cols-4 lg:divide-x lg:divide-line lg:p-5">
        {ITEMS.map((it) => (
          <div key={it.title} className="flex items-center gap-3 lg:justify-center lg:px-4">
            <span className="grid size-11 flex-none place-items-center rounded-full bg-primary-soft text-primary-ink">
              {it.icon}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-[13px] font-semibold text-ink lg:text-[14px]">{it.title}</span>
              <span className="block text-[12px] text-ink-muted">{it.sub}</span>
            </span>
          </div>
        ))}
      </div>
    </Container>
  );
}
