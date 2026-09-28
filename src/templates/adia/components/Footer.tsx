import Link from "next/link";
import { ContactButton } from "@/components/contact/ContactButton";
import { FiMapPin, FiPhone } from "@/components/shared/icons";
import type { Category } from "@/lib/products";
import { slugify } from "@/lib/slug";
import type { ThemeBrand } from "@/lib/theme";
import { Container } from "./Container";
import { Logo } from "./Logo";

const PAY = ["M-PESA", "VISA", "MASTERCARD"];

export function Footer({
  storeName,
  brand,
  address,
  phone,
  categories,
}: {
  storeName: string;
  brand?: ThemeBrand;
  address?: string | null;
  phone?: string | null;
  categories: Category[];
}) {
  const head = "mb-4 font-display text-[15px] font-semibold text-on-secondary";
  const link = "text-left text-[14px] text-on-secondary-body transition-colors hover:text-on-secondary";

  return (
    <footer className="mt-14 bg-secondary pt-12 pb-6">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Logo storeName={storeName} brand={brand} onDark />
            <p className="max-w-[300px] text-[14px] leading-relaxed text-on-secondary-body">
              Genuine products, fair prices and reliable delivery — shop {storeName} online.
            </p>
            <ul className="flex flex-col gap-2 text-[14px] text-on-secondary-body">
              {address ? (
                <li className="flex items-start gap-2">
                  <FiMapPin size={16} className="mt-0.5 flex-none" /> {address}
                </li>
              ) : null}
              {phone ? (
                <li className="flex items-center gap-2">
                  <FiPhone size={16} className="flex-none" /> {phone}
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <p className={head}>Shop</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/products" className={link}>
                  All products
                </Link>
              </li>
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link href={`/products/${slugify(c.name)}`} className={link}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={head}>Customer care</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <ContactButton className={link}>Contact us</ContactButton>
              </li>
              <li>
                <ContactButton className={link}>Order enquiries</ContactButton>
              </li>
              <li>
                <Link href="/checkout" className={link}>
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className={head}>We accept</p>
            <div className="flex flex-wrap gap-2">
              {PAY.map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-secondary-raised-2 px-2.5 py-1.5 text-[11px] font-bold tracking-wide text-on-secondary-body"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-secondary-raised pt-5 text-[13px] text-on-secondary-faint">
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
