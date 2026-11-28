import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoSection } from "@/components/pages/InfoPage";
import { emailLink, telLink, whatsappLink } from "@/lib/contact-links";
import { getStore } from "@/lib/shop-api";
import { pageOpenGraph } from "@/lib/seo";
import { loadShell } from "@/lib/store";
import type { ShopPolicies } from "@/lib/theme";

const PAYMENT_LABEL: Record<ShopPolicies["payments"][number], string> = {
  mpesa: "M-Pesa",
  cash: "cash",
  card: "card (Visa / Mastercard)",
  bank: "bank transfer or invoice (for businesses)",
};

/** "M-Pesa, cash and card (Visa / Mastercard)" */
export function paymentList(p: ShopPolicies): string {
  const items = p.payments.map((k) => PAYMENT_LABEL[k]);
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Shell + the shop's terms + its contact details — or a 404 for a shop that hasn't saved terms (it must
 * never publish policies it didn't choose). */
export async function loadPolicyPage() {
  const { shell } = await loadShell();
  const policies = shell.theme.policies;
  if (!policies) notFound();
  const store = await getStore().catch(() => null);
  const email = shell.theme.contact.email || store?.contact.email || null;
  const whatsapp = shell.theme.contact.whatsappSalesNumber || shell.theme.contact.whatsappSupportNumber || null;
  return { shell, policies, email, whatsapp };
}

export async function policyMetadata(path: string, title: string, describe: (storeName: string) => string): Promise<Metadata> {
  try {
    const store = await getStore();
    const description = describe(store.name);
    return {
      title,
      description,
      alternates: { canonical: path },
      openGraph: pageOpenGraph(store, { url: path, title: `${title} — ${store.name}`, description }),
    };
  } catch {
    return { title };
  }
}

/** "Contact us" block with the shop's real name, address, phone, email and WhatsApp. */
export function PolicyContact({
  storeName,
  address,
  phone,
  email,
  whatsapp,
}: {
  storeName: string;
  address?: string | null | undefined;
  phone?: string | null | undefined;
  email: string | null;
  whatsapp: string | null;
}) {
  return (
    <InfoSection heading="Contact us">
      <p>
        <strong className="text-navy">{storeName}</strong>
        {address ? <>, {address}</> : null}
      </p>
      {phone ? (
        <p>
          Phone: <a href={telLink(phone)}>{phone}</a>
        </p>
      ) : null}
      {whatsapp ? (
        <p>
          WhatsApp:{" "}
          <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer">
            {whatsapp}
          </a>
        </p>
      ) : null}
      {email ? (
        <p>
          Email: <a href={emailLink(email)}>{email}</a>
        </p>
      ) : null}
    </InfoSection>
  );
}
