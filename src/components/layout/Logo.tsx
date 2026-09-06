// Header logo — a square mark (an uploaded logo image, or the store's initial) plus a two-line
// store name. `line1`/`line2` come from theme.brand; when unset the store `name` is split on its
// first space (falling back to `name` + `sub`).
export function Logo({
  name = "TRYLIST",
  sub = "Online store",
  line1,
  line2,
  logoUrl,
  size = 34,
  onDark = false,
}: {
  name?: string;
  sub?: string;
  line1?: string;
  line2?: string;
  logoUrl?: string;
  size?: number;
  onDark?: boolean;
}) {
  const mark = name.trim().charAt(0).toUpperCase() || "S";

  // Resolve the two lines: explicit theme values → else split the name → else name + sub.
  let l1 = line1?.trim();
  let l2 = line2?.trim();
  if (!l1 && !l2) {
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      l1 = parts[0];
      l2 = parts.slice(1).join(" ");
    } else {
      l1 = name;
      l2 = sub;
    }
  }

  return (
    <a
      href="/"
      className={onDark ? "flex items-center gap-2.5 text-white" : "flex items-center gap-2.5 text-navy"}
      aria-label={`${l1 ?? name}${l2 ? ` ${l2}` : ""} — home`}
    >
      {logoUrl ? (
        <span
          className="grid flex-none place-items-center overflow-hidden bg-white"
          style={{ width: size, height: size }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="" className="size-full object-contain" />
        </span>
      ) : (
        <span
          className="grid flex-none place-items-center bg-blue font-sans font-black leading-none text-white"
          style={{ width: size, height: size, fontSize: size * 0.53 }}
        >
          {mark}
        </span>
      )}
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={`truncate font-sans text-[18px] font-black uppercase tracking-[-0.3px] ${
            onDark ? "text-white" : "text-navy"
          }`}
          style={{ maxWidth: 180 }}
        >
          {l1}
        </span>
        {l2 ? (
          <span
            className={`mt-[3px] truncate font-sans text-[12px] font-extrabold uppercase tracking-[0.5px] ${
              onDark ? "text-body-on-navy" : "text-slate"
            }`}
            style={{ maxWidth: 180 }}
          >
            {l2}
          </span>
        ) : null}
      </span>
    </a>
  );
}
