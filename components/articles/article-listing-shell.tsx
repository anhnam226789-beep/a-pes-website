/**
 * Static frame of `/bai-viet` plus the skeletons that stand in for the parts
 * that need MongoDB.
 *
 * The listing renders per request — filter, keyword and page number all live
 * in the URL — so the rows cannot be prerendered. What *can* be prerendered is
 * everything around them, which is why the title lives here as plain markup:
 * `loading.tsx` ships it as the prefetched shell, so clicking "Bài Viết & Mod"
 * paints the page immediately instead of holding the old screen while the
 * server queries the database.
 */

/** Number of placeholder cards; roughly two rows on a desktop grid. */
const SKELETON_CARDS = 8;

/** Placeholder pills. The real count comes from the `categories` collection. */
const SKELETON_FILTERS = 5;

const PLACEHOLDER_BOX = "bg-dark-card border border-dark-border animate-pulse";

export function ArticleListingTitle() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-txt-primary">
        Kho <span className="text-neon-primary">Bài Viết &amp; Mod Games</span>
      </h1>
      <p className="text-sm text-txt-secondary">
        Tìm kiếm công cụ và bản mod bạn cần
      </p>
    </div>
  );
}

/**
 * Everything below the title: filter pills, the card grid and the pager.
 *
 * Kept in the same shape as the real results so swapping one for the other
 * does not shift the page.
 */
export function ArticleResultsSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {Array.from({ length: SKELETON_FILTERS }, (_, index) => (
          <div
            key={index}
            className={`h-9 w-24 shrink-0 rounded-full ${PLACEHOLDER_BOX}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {Array.from({ length: SKELETON_CARDS }, (_, index) => (
          <div
            key={index}
            className="glass-card rounded-card overflow-hidden animate-pulse"
          >
            <div className="aspect-[16/9] bg-white/5" />
            <div className="p-3 space-y-2">
              <div className="h-3 rounded bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-white/10" />
              <div className="h-2 rounded bg-white/5" />
              <div className="h-2 w-1/2 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Whole-page fallback used by `loading.tsx`.
 *
 * The search box is a dead placeholder rather than a real `<input>`: text
 * typed into it would be thrown away the moment the page streams in.
 */
export function ArticleListingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ArticleListingTitle />

        <div
          className={`w-full sm:w-72 h-[45px] rounded-btn ${PLACEHOLDER_BOX}`}
          aria-hidden="true"
        />
      </div>

      <ArticleResultsSkeleton />
    </div>
  );
}
