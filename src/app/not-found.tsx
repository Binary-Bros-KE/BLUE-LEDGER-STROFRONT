import { getTemplate } from "@/templates/registry";
import { loadLook } from "@/lib/store";

export default async function NotFound() {
  const { template } = await loadLook();
  const T = getTemplate(template);
  return <T.NotFound />;
}
