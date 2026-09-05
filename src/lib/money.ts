/**
 * Spec §7 — `KSH 78,900`: a space after the currency code, comma thousands, no decimals.
 * The code defaults to `KSH` (the Trylist reference); a live store passes its own
 * `web_stores.currency` (e.g. `KES`) via <CurrencyProvider> / useCurrency().
 */
export function money(cents: number, currency = "KSH"): string {
  return `${currency} ${Math.round(cents / 100).toLocaleString("en-KE")}`;
}
