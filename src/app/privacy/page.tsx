import { InfoPage, InfoSection } from "@/components/pages/InfoPage";
import { loadPolicyPage, PolicyContact, policyMetadata } from "@/lib/policies";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return policyMetadata("/privacy", "Privacy policy", (name) => `What personal information ${name} collects and how it is used.`);
}

/** Describes what this website actually does: no analytics or advertising trackers and no cookies;
 * cart/favourites/checkout drafts live in the shopper's own browser storage. Keep it in step with the
 * code if that ever changes. */
export default async function PrivacyPage() {
  const { shell, email, whatsapp } = await loadPolicyPage();
  const T = getTemplate(shell.templateId);

  return (
    <T.Chrome {...shell}>
      <InfoPage title="Privacy policy" intro={`How ${shell.storeName} handles your personal information.`}>
        <InfoSection heading="What we collect">
          <ul className="list-disc pl-5">
            <li>When you place an order: your name, phone number, delivery address (if you choose delivery) and any notes you add.</li>
            <li>If you subscribe to our updates: your email address.</li>
            <li>When you contact us by phone, WhatsApp or email: the details you share with us.</li>
          </ul>
        </InfoSection>

        <InfoSection heading="How we use it">
          <p>
            Only to process and deliver your order, contact you about it, handle returns and warranty claims, and — if you
            subscribed — send you updates. To stop receiving updates at any time, contact us and we&apos;ll remove you.
          </p>
        </InfoSection>

        <InfoSection heading="Who we share it with">
          <p>
            We don&apos;t sell your information. We share delivery details only with the courier or rider delivering your
            order.
          </p>
        </InfoSection>

        <InfoSection heading="Cookies and tracking">
          <p>
            This website doesn&apos;t use advertising or analytics trackers, and doesn&apos;t set cookies. Your cart,
            favourites and checkout details are kept in your own browser so they&apos;re still there when you come back; you
            can clear them by clearing your browser data.
          </p>
        </InfoSection>

        <InfoSection heading="Your rights">
          <p>
            Under Kenya&apos;s Data Protection Act, 2019 you can ask to see, correct or delete the personal information we
            hold about you. Contact us using the details below and we&apos;ll respond.
          </p>
        </InfoSection>

        <PolicyContact storeName={shell.storeName} address={shell.address} phone={shell.phone} email={email} whatsapp={whatsapp} />
      </InfoPage>
    </T.Chrome>
  );
}
