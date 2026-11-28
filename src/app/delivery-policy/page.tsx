import { InfoPage, InfoSection } from "@/components/pages/InfoPage";
import { loadPolicyPage, PolicyContact, policyMetadata } from "@/lib/policies";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return policyMetadata("/delivery-policy", "Delivery policy", (name) => `Delivery areas, costs and pickup at ${name}.`);
}

export default async function DeliveryPolicyPage() {
  const { shell, policies: p, email, whatsapp } = await loadPolicyPage();
  const T = getTemplate(shell.templateId);
  const area = p.freeDeliveryArea;

  return (
    <T.Chrome {...shell}>
      <InfoPage title="Delivery policy" intro={`How orders from ${shell.storeName} reach you.`}>
        <InfoSection heading="Confirming your order">
          <p>
            After you place an order on this website we contact you by phone or WhatsApp to confirm it, the delivery
            details and payment. Your order is dispatched once it is confirmed.
          </p>
        </InfoSection>

        <InfoSection heading="Delivery areas and costs">
          {area ? <p>Delivery within {area} is free.</p> : null}
          {p.delivery === "courier_cost_agreed" ? (
            <p>
              We deliver {area ? "elsewhere in Kenya" : "across Kenya"} by courier or rider. The delivery cost and expected
              delivery time depend on your location and are agreed with you when we confirm your order, before anything is
              dispatched.
            </p>
          ) : p.delivery === "local_only" ? (
            <p>
              We only deliver {area ? `within ${area}` : "locally"}. Customers elsewhere can collect their order from our shop
              or arrange their own courier.
            </p>
          ) : (
            <p>Delivery outside {area ?? "our local area"} is charged at a fixed rate, which we confirm with your order.</p>
          )}
        </InfoSection>

        <InfoSection heading="Pickup">
          <p>
            You can choose to collect your order from our shop{shell.address ? ` at ${shell.address}` : ""} once we&apos;ve
            confirmed it is ready.
          </p>
        </InfoSection>

        <InfoSection heading="Damaged or wrong deliveries">
          <p>
            Please check your order when it arrives. If anything is damaged or not what you ordered, contact us within{" "}
            {p.returnDays} day{p.returnDays === 1 ? "" : "s"} — see our <a href="/returns-refunds">returns policy</a>.
          </p>
        </InfoSection>

        <PolicyContact storeName={shell.storeName} address={shell.address} phone={shell.phone} email={email} whatsapp={whatsapp} />
      </InfoPage>
    </T.Chrome>
  );
}
