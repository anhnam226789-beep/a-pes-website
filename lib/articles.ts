import type { Category } from "@/types/category";

/**
 * Shared shape of the `/bai-viet` listing URL.
 *
 * Filter, search and page all live in the query string so every view of the
 * listing is a real address: shareable, bookmarkable, restored by the back
 * button and crawlable. The articles themselves come from MongoDB — see
 * `getPaginatedArticles` in `lib/data/articles.ts`.
 */
export const LISTING_PARAM = {
  category: "danh-muc",
  query: "tim",
  page: "trang",
} as const;

/**
 * Query-string key for the CMS article search (`/admin/articles?tim=…`).
 *
 * Same name as the public listing on purpose — one habit for both screens —
 * but declared separately so changing one URL shape cannot silently move the
 * other.
 */
export const ADMIN_ARTICLE_PARAM = { query: "tim", page: "trang" } as const;

export interface CategoryFilterOption {
  /** Category slug, or an empty string for the "Tất Cả" pill. */
  value: string;
  /** Label shown on the pill (may differ from the category name). */
  label: string;
}

export interface ListingState {
  category: string;
  query: string;
  page: number;
}

/**
 * Builds the filter pills from the categories stored in MongoDB, prepending
 * the "Tất Cả" pill which is UI-only and has no row of its own.
 */
export function buildCategoryFilters(
  categories: Category[],
): CategoryFilterOption[] {
  return [
    { value: "", label: "Tất Cả" },
    ...categories.map((category) => ({
      value: category.slug,
      label: category.label,
    })),
  ];
}

/**
 * Serialises listing state back into a URL.
 *
 * Defaults are omitted rather than written out as `?trang=1&tim=`, so the
 * unfiltered listing keeps the bare `/bai-viet` address.
 */
export function buildListingHref(state: ListingState): string {
  const params = new URLSearchParams();

  if (state.category) params.set(LISTING_PARAM.category, state.category);
  if (state.query.trim()) params.set(LISTING_PARAM.query, state.query.trim());
  if (state.page > 1) params.set(LISTING_PARAM.page, String(state.page));

  const search = params.toString();
  return search ? `/bai-viet?${search}` : "/bai-viet";
}

/** Reads one query-string value, tolerating the repeated-param array form. */
export function readParam(
  value: string | string[] | undefined,
): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/**
 * Page numbers to render, with `null` marking an ellipsis.
 *
 * Always shows the first and last page plus a window around the current one,
 * so the control stays a fixed width no matter how many pages exist.
 */
export function getPageWindow(
  currentPage: number,
  totalPages: number,
): (number | null)[] {
  const MAX_SHOWN = 7;

  if (totalPages <= MAX_SHOWN) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);
  if (currentPage - 1 > 1) pages.add(currentPage - 1);
  if (currentPage + 1 < totalPages) pages.add(currentPage + 1);

  // Pad towards the middle so the control does not shrink at the edges.
  if (currentPage <= 3) {
    pages.add(2).add(3).add(4);
  } else if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1).add(totalPages - 2).add(totalPages - 3);
  }

  const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);

  const result: (number | null)[] = [];
  let previous = 0;

  for (const page of sorted) {
    if (previous && page - previous > 1) result.push(null);
    result.push(page);
    previous = page;
  }

  return result;
}
