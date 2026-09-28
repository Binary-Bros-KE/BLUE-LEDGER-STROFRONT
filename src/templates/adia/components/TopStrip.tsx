import { ContactButton } from "@/components/contact/ContactButton";
import { Container } from "./Container";

/** Slim announcement line above the header — rendered only when the shop has set one. */
export function TopStrip({ announcement }: { announcement?: string }) {
  const text = announcement?.trim();
  if (!text) return null;
  return (
    <div className="bg-secondary text-on-secondary-soft">
      <Container className="flex h-9 items-center justify-center gap-6 text-[12px] font-medium sm:justify-between">
        <span className="truncate">{text}</span>
        <ContactButton className="hidden flex-none transition-colors hover:text-on-secondary sm:block">
          Contact us
        </ContactButton>
      </Container>
    </div>
  );
}
