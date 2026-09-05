// Spec §4 — cream strip: mono 10px note + 5px cream-line track with a green fill, square ends.
export function FreeShipProgress({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="bg-cream px-6 py-4">
      <span className="font-mono text-[10px] uppercase tracking-[1.4px] text-slate">{label}</span>
      <div className="mt-2 h-[5px] w-full bg-cream-line">
        <div className="h-full bg-green" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
      </div>
    </div>
  );
}
