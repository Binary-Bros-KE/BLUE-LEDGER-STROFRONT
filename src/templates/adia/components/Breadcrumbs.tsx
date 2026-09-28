import Link from "next/link";
import { FiChevronRight } from "@/components/shared/icons";

export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-muted">
      {trail.map((item, i) => {
        const last = i === trail.length - 1;
        return (
          <span key={i} className="flex min-w-0 items-center gap-1.5">
            {i > 0 ? <FiChevronRight size={13} className="flex-none text-ink-faint" /> : null}
            {item.href && !last ? (
              <Link href={item.href} className="transition-colors hover:text-primary-ink">
                {item.label}
              </Link>
            ) : (
              <span className={`line-clamp-1 ${last ? "font-medium text-primary-ink" : ""}`}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
