import { Diamond, FiArrowRight } from "@/components/shared/icons";

// Spec §4 — the blue tile that fills slot 8 of the product grid.
export function PromoTile() {
  return (
    <div className="flex flex-col justify-between gap-6 bg-blue p-6 text-white">
      <div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1.6px] text-on-blue">
          <Diamond size={9} /> Trylist service
        </span>
        <h3 className="mt-3 font-sans text-[22px] font-black leading-[1.1] tracking-[-0.5px] lg:text-[28px]">
          We install it,
          <br />
          then we train
          <br />
          your cashiers.
        </h3>
        <p className="mt-4 font-mono text-[11px] leading-[1.65] text-on-blue-body">
          Free on-site setup on every POS bundle within Nairobi. Two hours of staff training included.
        </p>
      </div>
      <a
        href="#"
        className="inline-flex w-fit items-center gap-2 bg-amber px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-navy transition-colors hover:bg-amber-ink hover:text-white"
      >
        Book an install <FiArrowRight size={13} />
      </a>
    </div>
  );
}
