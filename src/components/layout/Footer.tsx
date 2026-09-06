import { ContactButton } from "@/components/contact/ContactButton";
import { Container } from "@/components/shared/Container";
import { Logo } from "./Logo";

const COLUMNS: { head: string; links: string[] }[] = [
  { head: "Shop", links: ["Laptops", "Phones & Tablets", "POS & Printers", "Monitors", "Networking"] },
  { head: "Business", links: ["Trade accounts", "Bulk quotations", "LPO & tenders", "Blue Ledger POS", "Installation"] },
  { head: "Support", links: ["Track my order", "Returns & refunds", "Warranty claim", "Repair bench", "Contact us"] },
  { head: "Company", links: ["About Trylist", "Careers", "Terms of sale", "Privacy", "Delivery policy"] },
];

const SOCIALS = ["IG", "X", "FB", "WA"];
const PAY = ["M-PESA", "VISA", "MASTERCARD", "INVOICE"];

// Spec §4 — navy, 52px 40px 26px. Grid 1.5fr 1fr 1fr 1fr 1fr. Amber mono 10px heads.
export function Footer({
  storeName = "TRYLIST",
  address,
  phone,
}: {
  storeName?: string;
  address?: string | null;
  phone?: string | null;
}) {
  const lines = [
    "Tech supply and POS hardware for Kenyan retail.",
    address ?? "Biashara Street, Nairobi CBD",
    phone ? `Tel · ${phone}` : "Mon–Sat · 8:30 – 18:00",
  ];
  return (
    <footer className="bg-navy pt-[52px] pb-[26px]">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          {/* brand column */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Logo name={storeName} onDark />
            <p className="max-w-[240px] font-mono text-[11px] leading-[1.8] text-body-on-navy">
              {lines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < lines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <ContactButton
                  key={s}
                  ariaLabel={`${s} — contact us`}
                  className="grid size-8 place-items-center border border-navy-600 font-mono text-[10px] font-bold uppercase tracking-[1px] text-body-on-navy transition-colors hover:border-amber hover:text-amber"
                >
                  {s}
                </ContactButton>
              ))}
            </div>
          </div>

          {/* link columns — mobile shows 2 */}
          {COLUMNS.map((col, i) => (
            <div key={col.head} className={`flex flex-col ${i >= 2 ? "hidden md:flex" : ""}`}>
              <span className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[1.8px] text-amber">
                {col.head}
              </span>
              <ul className="flex flex-col gap-0">
                {col.links.map((link) =>
                  link === "Contact us" ? (
                    <li key={link}>
                      <ContactButton className="font-mono text-[11px] leading-[2] text-body-on-navy transition-colors hover:text-white">
                        {link}
                      </ContactButton>
                    </li>
                  ) : (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-mono text-[11px] leading-[2] text-body-on-navy transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom rule */}
        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-navy-700 pt-5 md:flex-row md:items-center">
          <span className="font-mono text-[10px] uppercase tracking-[1.4px] text-faint-on-navy">
            © {new Date().getFullYear()} {storeName} · PIN P05XXXXXXXX
          </span>
          <div className="flex gap-2">
            {PAY.map((p, i) => (
              <span
                key={p}
                className={`grid h-7 place-items-center border border-navy-600 px-2.5 font-mono text-[9px] font-bold uppercase tracking-[1px] text-body-on-navy ${
                  i >= 3 ? "hidden md:grid" : ""
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
