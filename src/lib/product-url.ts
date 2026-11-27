/** A product page's path. Uses the SERVER's URL slug (/product/android-tv-stick-128gb) — falls back
 * to the id for anything without one (the sample catalogue, an older API), which the product page
 * itself then redirects to the slug URL. */
export function productPath(p: { id: string; slug?: string | null | undefined }): string {
  return `/product/${encodeURIComponent(p.slug || p.id)}`;
}
