// Turns the free-text contact fields (theme.contact) into real links. Numbers are entered however
// the shop owner likes ("0791 880 412", "+254791880412", …) and normalised to wa.me form here.

const PREFILL = "Hi, I'm interested in your products.";

/** 0712345678 / +254712345678 / 254 712 345 678  →  254712345678 */
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

export function whatsappLink(number: string, text = PREFILL): string {
  return `https://wa.me/${normalisePhone(number)}?text=${encodeURIComponent(text)}`;
}

export function telLink(number: string): string {
  return `tel:+${normalisePhone(number)}`;
}

export function emailLink(email: string, subject = "Product enquiry", body = PREFILL): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const handle = (h: string) => h.replace(/^@+/, "").replace(/^https?:\/\/[^/]+\//, "").replace(/\/+$/, "");

export function instagramLink(h: string): string {
  return h.startsWith("http") ? h : `https://instagram.com/${handle(h)}`;
}

export function facebookLink(h: string): string {
  return h.startsWith("http") ? h : `https://facebook.com/${handle(h)}`;
}
