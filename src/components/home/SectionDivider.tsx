import { Container } from "@/components/shared/Container";
import { Diamond } from "@/components/shared/icons";

// Thin navy engineering-grid strip between curated home sections — a visual "feature" boundary so
// consecutive product rows don't blur together. Centred label = the shop's own name.
export function SectionDivider({ label }: { label?: string | undefined }) {
  return (
    <div className="bg-grid">
      <Container>
        <div className="flex items-center justify-center gap-4 py-4">
          <span className="h-px flex-1 bg-navy-600" />
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[2.4px] text-meta-on-navy">
            <Diamond size={7} className="text-amber" />
            {label?.trim() || "Shop online"}
            <Diamond size={7} className="text-amber" />
          </span>
          <span className="h-px flex-1 bg-navy-600" />
        </div>
      </Container>
    </div>
  );
}
