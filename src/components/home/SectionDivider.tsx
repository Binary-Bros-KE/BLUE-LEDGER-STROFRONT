import { Container } from "@/components/shared/Container";
import { Diamond } from "@/components/shared/icons";

// Thin navy engineering-grid strip between curated home sections — a visual "feature" boundary so
// consecutive product rows don't blur together. Optional centred label.
export function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="bg-grid">
      <Container>
        <div className="flex items-center justify-center gap-4 py-4">
          <span className="h-px flex-1 bg-navy-600" />
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[2.4px] text-meta-on-navy">
            <Diamond size={7} className="text-amber" />
            {label ?? "Blue Ledger POS"}
            <Diamond size={7} className="text-amber" />
          </span>
          <span className="h-px flex-1 bg-navy-600" />
        </div>
      </Container>
    </div>
  );
}
