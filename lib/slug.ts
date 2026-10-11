/**
 * Turns a Vietnamese label into a URL-safe slug.
 *
 * NFD splits accented characters into base + combining mark so the marks
 * (U+0300–U+036F) can be stripped in one pass; `đ`/`Đ` have no decomposition
 * and are mapped by hand.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
