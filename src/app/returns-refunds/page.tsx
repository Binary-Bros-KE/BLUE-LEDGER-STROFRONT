import { InfoPage, InfoSection } from "@/components/pages/InfoPage";
import { loadPolicyPage, PolicyContact, policyMetadata } from "@/lib/policies";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return policyMetadata("/returns-refunds", "Returns & refunds", (name) => `How returns, exchanges and refunds work at ${name}.`);
}

export default async function ReturnsPage() {
  const { shell, policies: p, email, whatsapp } = await loadPolicyPage();
  const T = getTemplate(shell.templateId);
  const days = `${p.returnDays} day${p.returnDays === 1 ? "" : "s"}`;

  return (
    <T.Chrome {...shell}>
      <InfoPage title="Returns & refunds" intro={`How returns work when you buy from ${shell.storeName}.`}>
        <InfoSection heading="What can be returned">
          {p.returnScope === "none" ? (
            <p>
              All sales are final. Faulty items are handled under their warranty — see below. If an item arrives damaged or is
              not what you ordered, contact us within {days} of receiving it.
            </p>
          ) : p.returnScope === "faulty_or_wrong" ? (
            <>
              <p>You can return an item within {days} of receiving it if it is:</p>
              <ul className="list-disc pl-5">
                <li>faulty or damaged on arrival, or</li>
                <li>not the item you ordered.</li>
              </ul>
              <p>We don&apos;t accept returns of working items for a change of mind.</p>
            </>
          ) : (
            <p>You can return any item within {days} of receiving it, for any reason.</p>
          )}
        </InfoSection>

        <InfoSection heading="Condition of returned items">
          <p>
            Please return the item with its original packaging, accessories, manuals and your receipt or invoice number.
            {p.returnScope === "any_reason" ? " Items returned for a reason other than a fault must be unused." : ""}
          </p>
        </InfoSection>

        <InfoSection heading="How to return an item">
          <p>
            Contact us first by phone, WhatsApp or email with your order details and what is wrong. We&apos;ll check the item
            and agree how to get it back to us{shell.address ? `, or you can bring it to our shop at ${shell.address}` : ""}.
          </p>
        </InfoSection>

        <InfoSection heading={p.refund === "exchange_or_credit" ? "Exchanges and store credit" : "Refunds"}>
          {p.refund === "exchange_or_credit" ? (
            <p>
              Once we&apos;ve confirmed the return, we replace the item with the same product, exchange it for another product,
              or give you store credit for its value. We don&apos;t give cash refunds.
            </p>
          ) : p.refund === "original_method" ? (
            <p>Once we&apos;ve confirmed the return, we refund you the way you paid.</p>
          ) : (
            <p>
              Once we&apos;ve confirmed the return, you choose: a refund the way you paid, or an exchange for another product.
            </p>
          )}
        </InfoSection>

        <InfoSection heading="Warranty">
          <p>
            Many products carry a warranty of up to 12 months, depending on the product. A fault that appears during the
            warranty period is handled by repair or replacement under that product&apos;s warranty terms — contact us and
            we&apos;ll arrange it.
          </p>
        </InfoSection>

        <PolicyContact storeName={shell.storeName} address={shell.address} phone={shell.phone} email={email} whatsapp={whatsapp} />
      </InfoPage>
    </T.Chrome>
  );
}
