import Link from "next/link";

// Mono, "Home / Products / …", spec §2 label style.
export function Breadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[1.4px] text-slate">
      {trail.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 ? <span className="text-slate/40">/</span> : null}
          {item.href && i < trail.length - 1 ? (
            <Link href={item.href} className="text-slate transition-colors hover:text-navy">
              {item.label}
            </Link>
          ) : (
            <span className={i === trail.length - 1 ? "text-navy" : ""}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
