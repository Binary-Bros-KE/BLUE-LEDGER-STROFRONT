import Link from "next/link";
import type { ThemeStoryRow } from "@/lib/theme";
import { Container } from "../components/Container";

/** The shop's story rows (themeJson.story) as up to three image promo cards. Hidden if none. */
export function Promos({ rows }: { rows: ThemeStoryRow[] }) {
  if (rows.length === 0) return null;
  return (
    <Container className="mt-10 lg:mt-12">
      <div className={`grid gap-4 ${rows.length === 1 ? "" : rows.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {rows.map((r, i) => (
          <article
            key={i}
            className="relative isolate flex min-h-[200px] flex-col justify-end overflow-hidden rounded-2xl bg-secondary p-6"
          >
            {r.imageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.imageUrl} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
              </>
            ) : null}
            {r.title ? <h3 className="font-display text-[20px] font-bold leading-tight text-white">{r.title}</h3> : null}
            {r.body ? <p className="mt-1.5 line-clamp-3 text-[14px] text-white/85">{r.body}</p> : null}
            {r.ctaLabel ? (
              <Link
                href={r.ctaHref?.trim() || "/products"}
                className="mt-4 inline-flex w-fit rounded-lg bg-primary px-4 py-2 font-display text-[13px] font-semibold text-on-primary"
              >
                {r.ctaLabel}
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </Container>
  );
}
