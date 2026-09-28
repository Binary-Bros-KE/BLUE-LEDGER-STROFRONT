import Link from "next/link";
import { FiArrowRight } from "@/components/shared/icons";

export function AdiaNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <div className="w-full max-w-[460px] rounded-2xl border border-line bg-surface p-8 text-center shadow-sm lg:p-10">
        <p className="font-display text-[64px] font-extrabold leading-none text-primary-ink">404</p>
        <h1 className="mt-3 font-display text-[22px] font-bold text-ink">Page not found</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
          That page or product doesn&rsquo;t exist — it may have sold out or been renamed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display text-[14px] font-semibold text-on-primary transition-colors hover:bg-primary-hover"
        >
          Back to the shop <FiArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
