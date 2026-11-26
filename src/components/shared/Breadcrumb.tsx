import Link from "next/link";

// Mono, "Home / Products / …", spec §2 label style. `onDark` is for header bands with a background
// image under a navy scrim: there the current (last) item is white, since navy would vanish into it.
export function Breadcrumb({ trail, onDark = false }: { trail: { label: string; href?: string }[]; onDark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[1.4px] text-slate">
      {trail.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 ? <span className={onDark ? "text-white/40" : "text-slate/40"}>/</span> : null}
          {item.href && i < trail.length - 1 ? (
            <Link href={item.href} className="text-slate transition-colors hover:text-navy">
              {item.label}
            </Link>
          ) : (
            <span className={i === trail.length - 1 ? (onDark ? "text-white" : "text-navy") : ""}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
