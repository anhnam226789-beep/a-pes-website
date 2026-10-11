import { ArticleListingSkeleton } from "@/components/articles/article-listing-shell";

/**
 * Instant loading state for `/bai-viet`.
 *
 * The listing is a dynamic route (it reads `searchParams`), and Next.js only
 * prefetches such a route when this file exists. Without it, clicking "Bài
 * Viết & Mod" left the previous screen frozen for the whole server round trip
 * — database included — which read as an unresponsive site. With it, the
 * skeleton is already in the browser when the click happens and the rows
 * stream into it.
 */
export default function Loading() {
  return <ArticleListingSkeleton />;
}
