import Link from "next/link";
import { FiArrowRight } from "@/components/shared/icons";

/** Home section heading: title + subtitle on the left, an optional "View all →" on the right. */
export function SectionHead({
  title,
  subtitle,
  href,
  cta,
  inverse = false,
}: {
  title: string;
  subtitle?: string | undefined;
  href?: string | undefined;
  cta?: string | undefined;
  inverse?: boolean;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 lg:mb-6">
      <div className="min-w-0">
        <h2 className={`font-display text-[22px] font-bold leading-tight lg:text-[28px] ${inverse ? "text-on-primary" : "text-ink"}`}>{title}</h2>
        {subtitle ? <p className={`mt-1 text-[13px] lg:text-[15px] ${inverse ? "text-on-primary-soft" : "text-ink-muted"}`}>{subtitle}</p> : null}
      </div>
      {href && cta ? (
        <Link
          href={href}
          className={`flex flex-none items-center gap-1.5 text-[13px] font-semibold lg:text-[14px] ${
            inverse
              ? "rounded-lg border border-on-primary/60 px-3.5 py-2 text-on-primary hover:bg-on-primary/10"
              : "text-primary-ink hover:underline"
          }`}
        >
          {cta} <FiArrowRight size={14} />
        </Link>
      ) : null}
    </div>
  );
}
