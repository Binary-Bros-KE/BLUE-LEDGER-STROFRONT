/** "CCTV Cameras" → "cctv-cameras". Used for category URLs (/products/cctv-cameras). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
