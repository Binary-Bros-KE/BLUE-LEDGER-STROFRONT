import { InfoPage, InfoSection } from "@/components/pages/InfoPage";
import { loadPolicyPage, paymentList, PolicyContact, policyMetadata } from "@/lib/policies";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return policyMetadata("/terms-of-sale", "Terms of sale", (name) => `The terms that apply when you buy from ${name}.`);
}

export default async function TermsOfSalePage() {
  const { shell, policies: p, email, whatsapp } = await loadPolicyPage();
  const T = getTemplate(shell.templateId);

  return (
    <T.Chrome {...shell}>
      <InfoPage title="Terms of sale" intro={`These terms apply to orders placed with ${shell.storeName} through this website.`}>
        <InfoSection heading="Who you are buying from">
          <p>
            {shell.storeName}
            {shell.address ? `, ${shell.address}` : ""}
            {shell.phone ? `. Phone ${shell.phone}` : ""}
            {email ? `. Email ${email}` : ""}.
          </p>
        </InfoSection>

        <InfoSection heading="Orders">
          <p>
            Placing an order on this website sends us an order request. We contact you to confirm availability, delivery and
            payment, and the sale is agreed once we confirm your order. If an item is unavailable we&apos;ll tell you before
            taking any payment.
          </p>
        </InfoSection>

        <InfoSection heading="Prices">
          <p>
            Prices are shown in Kenya Shillings ({shell.currency || "KES"}). The price that applies is the one shown when you
            place your order. Delivery charges, where they apply, are explained in our{" "}
            <a href="/delivery-policy">delivery policy</a>.
          </p>
        </InfoSection>

        <InfoSection heading="Payment">
          <p>
            No payment is taken on this website. We accept {paymentList(p)}, and agree payment with you when we confirm your
            order.
          </p>
        </InfoSection>

        <InfoSection heading="Returns and warranty">
          <p>
            Returns, exchanges and warranty claims are covered by our <a href="/returns-refunds">returns &amp; refunds
            policy</a>.
          </p>
        </InfoSection>

        <InfoSection heading="Governing law">
          <p>These terms are governed by the laws of Kenya.</p>
        </InfoSection>

        <PolicyContact storeName={shell.storeName} address={shell.address} phone={shell.phone} email={email} whatsapp={whatsapp} />
      </InfoPage>
    </T.Chrome>
  );
}
