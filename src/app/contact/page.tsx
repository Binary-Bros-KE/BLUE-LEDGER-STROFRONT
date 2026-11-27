import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/pages/InfoPage";
import { emailLink, telLink, whatsappLink } from "@/lib/contact-links";
import { getStore } from "@/lib/shop-api";
import { pageOpenGraph } from "@/lib/seo";
import { loadShell } from "@/lib/store";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const store = await getStore();
    const description = `Contact ${store.name}${store.contact.address ? ` — ${store.contact.address}` : ""}${
      store.contact.phone ? `, ${store.contact.phone}` : ""
    }.`;
    return {
      title: "Contact us",
      description,
      alternates: { canonical: "/contact" },
      openGraph: pageOpenGraph(store, { url: "/contact", title: `Contact ${store.name}`, description }),
    };
  } catch {
    return { title: "Contact us" };
  }
}

/** The shop's real contact details — name, address, phone, email (Business Profile + Online Store
 * contact channels). Nothing here is template wording: a missing detail is simply left out. */
export default async function ContactPage() {
  const { shell } = await loadShell();
  const T = getTemplate(shell.templateId);
  const store = await getStore().catch(() => null);
  const contact = shell.theme.contact;
  const email = contact.email || store?.contact.email || null;
  const whatsapp = [
    contact.whatsappSalesNumber ? { label: contact.whatsappSalesLabel || "Sales", number: contact.whatsappSalesNumber } : null,
    contact.whatsappSupportNumber && contact.whatsappSupportNumber !== contact.whatsappSalesNumber
      ? { label: contact.whatsappSupportLabel || "Support", number: contact.whatsappSupportNumber }
      : null,
  ].filter((w): w is { label: string; number: string } => w !== null);

  return (
    <T.Chrome {...shell}>
      <InfoPage title="Contact us" intro={`Questions about a product, an order or a delivery? Reach ${shell.storeName} directly.`}>
        <InfoSection heading={shell.storeName}>
          {shell.address ? (
            <p>
              <strong className="text-navy">Address:</strong> {shell.address}{" "}
              (<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shell.storeName}, ${shell.address}`)}`} target="_blank" rel="noopener noreferrer">
                open in Google Maps
              </a>
              )
            </p>
          ) : null}
          {shell.phone ? (
            <p>
              <strong className="text-navy">Phone:</strong> <a href={telLink(shell.phone)}>{shell.phone}</a>
            </p>
          ) : null}
          {email ? (
            <p>
              <strong className="text-navy">Email:</strong> <a href={emailLink(email)}>{email}</a>
            </p>
          ) : null}
        </InfoSection>

        {whatsapp.length > 0 ? (
          <InfoSection heading="WhatsApp">
            {whatsapp.map((w) => (
              <p key={w.number + w.label}>
                <strong className="text-navy">{w.label}:</strong>{" "}
                <a href={whatsappLink(w.number)} target="_blank" rel="noopener noreferrer">
                  {w.number}
                </a>
              </p>
            ))}
          </InfoSection>
        ) : null}
      </InfoPage>
    </T.Chrome>
  );
}
