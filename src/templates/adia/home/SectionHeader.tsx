import Link from "next/link";
import { FiArrowRight } from "@/components/shared/icons";

export function SectionHeader({ title, href, cta = "View All" }: { title: string; href?: string; cta?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 lg:mb-5">
      <h2 className="font-display text-[20px] font-bold leading-tight text-ink lg:text-[24px]">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="flex flex-none items-center gap-1 text-[13px] font-semibold text-primary-ink hover:underline lg:text-[14px]"
        >
          {cta} <FiArrowRight size={14} />
        </Link>
      ) : null}
    </div>
  );
}
