/**
 * Display formatters shared by Server and Client Components.
 *
 * Both are hand-rolled instead of using `Intl`: the article cards render
 * inside a Client Component, so a server/client difference in locale data or
 * time zone would show up as a hydration mismatch.
 */

/** Vietnam is UTC+7 and the site has no other audience. */
const VN_UTC_OFFSET_MINUTES = 7 * 60;

function padStart2(value: number): string {
  return value.toString().padStart(2, "0");
}

/** `2026-08-05T…Z` → `05/08/2026`, always in Vietnam time. */
export function formatArticleDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  const shifted = new Date(date.getTime() + VN_UTC_OFFSET_MINUTES * 60_000);

  return [
    padStart2(shifted.getUTCDate()),
    padStart2(shifted.getUTCMonth() + 1),
    shifted.getUTCFullYear(),
  ].join("/");
}

/** `12450` → `12.450`, matching the dot grouping used on the original page. */
export function formatViews(views: number): string {
  return Math.max(0, Math.trunc(views))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
