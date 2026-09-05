import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { FiArrowRight } from "@/components/shared/icons";
import type { Category } from "@/lib/products";
import { slugify } from "@/lib/slug";

// Spec §4 — amber band, 11px 40px, border-bottom 2px navy. Mono 12px navy, tracking 1.6px.
// Mobile: horizontal scroll, 10px. Driven by the tenant's real categories.
export function CategoryRibbon({ categories }: { categories: Category[] }) {
  const items = [
    { label: "Shop all", href: "/products" },
    ...categories.slice(0, 6).map((c) => ({ label: c.name, href: `/products/${slugify(c.name)}` })),
  ];
  const mobileItems = items.slice(0, 5);

  return (
    <div className="border-b-2 border-navy bg-amber">
      <Container className="hidden items-center justify-between gap-6 py-[11px] sm:flex">
        <nav className="flex items-center gap-6 font-mono text-[12px] uppercase tracking-[1.6px]">
          {items.map((item, i) => (
            <Link
              key={item.href + i}
              href={item.href}
              className={`text-navy transition-opacity hover:opacity-60 ${i === 0 ? "font-bold" : "font-normal"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/products"
          className="flex items-center gap-1 font-mono text-[12px] font-bold uppercase tracking-[1.6px] text-[#b3271a] transition-opacity hover:opacity-70"
        >
          All products <FiArrowRight size={13} />
        </Link>
      </Container>

      <div className="no-scrollbar flex gap-5 overflow-x-auto px-4 py-2.5 sm:hidden">
        {mobileItems.map((item, i) => (
          <Link
            key={item.href + i}
            href={item.href}
            className={`flex-none font-mono text-[10px] uppercase tracking-[1.6px] text-navy ${i === 0 ? "font-bold" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
