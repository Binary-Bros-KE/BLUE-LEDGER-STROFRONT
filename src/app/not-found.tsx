import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-grid flex min-h-screen flex-col items-center justify-center px-6 text-center text-cream">
      <span className="font-mono text-[11px] uppercase tracking-[2px] text-amber">404</span>
      <h1 className="mt-4 font-sans text-[40px] font-black leading-[0.95] tracking-[-1.4px] sm:text-[56px]">
        Not on the shelf.
      </h1>
      <p className="mt-4 max-w-[380px] font-mono text-[13px] leading-[1.7] text-body-on-navy">
        That page or product doesn&rsquo;t exist — it may have sold out or been renamed.
      </p>
      <Link
        href="/"
        className="blk mt-8 bg-blue px-8 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[1.6px] text-white transition-colors hover:bg-blue-press"
      >
        Back to the shop
      </Link>
    </div>
  );
}
