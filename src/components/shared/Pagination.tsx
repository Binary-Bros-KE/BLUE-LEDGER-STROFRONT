import Link from "next/link";
import { FiArrowRight } from "./icons";

/** Builds `<basePath>?page=N`, preserving any query already on basePath's `?`. */
function pageHref(basePath: string, page: number): string {
  const [path, qs] = basePath.split("?");
  const params = new URLSearchParams(qs);
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}

/** 1 … 4 5 [6] 7 8 … 20 */
function windowPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);
  if (from > 2) out.push("…");
  for (let p = from; p <= to; p++) out.push(p);
  if (to < total - 1) out.push("…");
  out.push(total);
  return out;
}

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;
  const cellBase =
    "grid h-10 min-w-10 place-items-center px-3 font-mono text-[12px] font-bold uppercase tracking-[1px] border-[1.5px] transition-colors";

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={pageHref(basePath, page - 1)} className={`${cellBase} border-navy text-navy hover:bg-navy hover:text-white`}>
          <span className="rotate-180">
            <FiArrowRight size={14} />
          </span>
        </Link>
      ) : (
        <span className={`${cellBase} border-line text-slate-dim`} aria-hidden="true">
          <span className="rotate-180">
            <FiArrowRight size={14} />
          </span>
        </span>
      )}

      {windowPages(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 font-mono text-[12px] text-slate">
            …
          </span>
        ) : p === page ? (
          <span key={p} aria-current="page" className={`${cellBase} border-navy bg-navy text-white`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={pageHref(basePath, p)} className={`${cellBase} border-line text-navy hover:border-navy`}>
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={pageHref(basePath, page + 1)} className={`${cellBase} border-navy text-navy hover:bg-navy hover:text-white`}>
          <FiArrowRight size={14} />
        </Link>
      ) : (
        <span className={`${cellBase} border-line text-slate-dim`} aria-hidden="true">
          <FiArrowRight size={14} />
        </span>
      )}
    </nav>
  );
}
