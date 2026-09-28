import type { Metadata } from "next";
import { getDeliveryMethods } from "@/lib/shop-api";
import { loadShell } from "@/lib/store";
import { getTemplate } from "@/templates/registry";
import type { DeliveryOption } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const { shell, preview } = await loadShell();
  const T = getTemplate(shell.templateId);

  let methods: DeliveryOption[] = [];
  if (!preview) {
    try {
      methods = await getDeliveryMethods();
    } catch {
      methods = [];
    }
  }

  return (
    <T.Chrome {...shell}>
      <T.Checkout methods={methods} />
    </T.Chrome>
  );
}
