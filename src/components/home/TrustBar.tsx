import { Container } from "@/components/shared/Container";
import { Diamond, FiCreditCard, FiRepeat, FiZap } from "@/components/shared/icons";

// Spec §4 — white, 4 equal cells divided by hairlines, bottom hairline. Each eyebrow a different
// accent. Mobile: 2×2.
const CELLS = [
  { mark: <Diamond size={9} />, tone: "text-blue", eyebrow: "Genuine stock", line: "Sealed boxes, real serials" },
  { mark: <FiRepeat size={11} />, tone: "text-red", eyebrow: "7-day returns", line: "Swap it if it's wrong" },
  { mark: <FiZap size={11} />, tone: "text-green", eyebrow: "Free setup", line: "POS installed on site" },
  { mark: <FiCreditCard size={11} />, tone: "text-amber-ink", eyebrow: "Pay your way", line: "M-Pesa, card or terms" },
];

export function TrustBar() {
  return (
    <div className="border-b border-line bg-white">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {CELLS.map((c, i) => (
            <div
              key={c.eyebrow}
              className={[
                "flex flex-col gap-1.5 py-5 md:px-6",
                i % 2 === 1 ? "border-l border-line pl-4 md:pl-6" : "",
                i > 0 ? "md:border-l md:border-line" : "",
                i < 2 ? "border-b border-line md:border-b-0" : "",
              ].join(" ")}
            >
              <span className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[2px] ${c.tone}`}>
                {c.mark}
                {c.eyebrow}
              </span>
              <span className="font-sans text-[14px] font-bold text-navy">{c.line}</span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
