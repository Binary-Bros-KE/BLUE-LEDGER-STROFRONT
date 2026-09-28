import Link from "next/link";
import { pageHref, windowPages } from "@/components/shared/Pagination";
import { FiChevronLeft, FiChevronRight } from "@/components/shared/icons";

/** Rounded Prev · 1 … 4 [5] 6 … 20 · Next. Links keep every other query param (q, sort, price). */
export function Pager({ page, totalPages, basePath }: { page: number; totalPages: number; basePath: string }) {
  if (totalPages <= 1) return null;
  const cell = "grid h-10 min-w-10 place-items-center rounded-lg px-3 text-[14px] font-medium transition-colors";
  const idle = `${cell} border border-line bg-surface text-ink hover:border-primary hover:text-primary-ink`;
  const off = `${cell} border border-line bg-surface text-ink-faint opacity-50`;

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={pageHref(basePath, page - 1)} className={idle} aria-label="Previous page">
          <FiChevronLeft size={16} />
        </Link>
      ) : (
        <span className={off} aria-hidden="true">
          <FiChevronLeft size={16} />
        </span>
      )}
      {windowPages(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-ink-faint">
            …
          </span>
        ) : p === page ? (
          <span key={p} aria-current="page" className={`${cell} bg-primary font-semibold text-on-primary`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={pageHref(basePath, p)} className={idle}>
            {p}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link href={pageHref(basePath, page + 1)} className={idle} aria-label="Next page">
          <FiChevronRight size={16} />
        </Link>
      ) : (
        <span className={off} aria-hidden="true">
          <FiChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
