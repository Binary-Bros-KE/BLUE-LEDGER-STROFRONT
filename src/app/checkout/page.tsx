import type { Metadata } from "next";
import { StoreChrome } from "@/components/StoreChrome";
import { CheckoutView } from "@/components/pages/CheckoutView";
import { getDeliveryMethods } from "@/lib/shop-api";
import { loadShell } from "@/lib/store";
import type { DeliveryOption } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const { shell, preview } = await loadShell();

  let methods: DeliveryOption[] = [];
  if (!preview) {
    try {
      methods = await getDeliveryMethods();
    } catch {
      methods = [];
    }
  }

  return (
    <StoreChrome {...shell}>
      <CheckoutView methods={methods} />
    </StoreChrome>
  );
}
