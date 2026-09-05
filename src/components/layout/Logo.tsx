// Spec §4 — blue square with the store's initial in Archivo 900, then the store name over a
// mono sub-label. `name` is the live store name (defaults to the Trylist reference).
export function Logo({
  name = "TRYLIST",
  sub = "Online store",
  size = 34,
  onDark = false,
}: {
  name?: string;
  sub?: string;
  size?: number;
  onDark?: boolean;
}) {
  const mark = name.trim().charAt(0).toUpperCase() || "S";
  return (
    <a
      href="/"
      className={onDark ? "flex items-center gap-2.5 text-white" : "flex items-center gap-2.5 text-navy"}
      aria-label={`${name} — home`}
    >
      <span
        className="grid flex-none place-items-center bg-blue font-sans font-black leading-none text-white"
        style={{ width: size, height: size, fontSize: size * 0.53 }}
      >
        {mark}
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={`truncate font-sans text-[18px] font-black uppercase tracking-[-0.3px] ${
            onDark ? "text-white" : "text-navy"
          }`}
          style={{ maxWidth: 180 }}
        >
          {name}
        </span>
        <span
          className={`mt-[3px] truncate font-mono text-[9px] uppercase tracking-[2.6px] ${
            onDark ? "text-meta-on-navy" : "text-slate"
          }`}
          style={{ maxWidth: 180 }}
        >
          {sub}
        </span>
      </span>
    </a>
  );
}
