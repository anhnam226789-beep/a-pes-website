import { Suspense } from "react";
import type { Metadata } from "next";
import { LISTING_PARAM, buildCategoryFilters, readParam } from "@/lib/articles";
import { getActiveCategories } from "@/lib/data/categories";
import { getPaginatedArticles } from "@/lib/data/articles";
import {
  ArticleListingResults,
  ArticleSearchInput,
} from "@/components/articles/article-listing";
import {
  ArticleListingTitle,
  ArticleResultsSkeleton,
} from "@/components/articles/article-listing-shell";

export const metadata: Metadata = {
  title: "Kho Bài Viết & Mod Games | A-Pes Studio",
  description: "Tìm kiếm công cụ và bản mod bạn cần",
  alternates: { canonical: "/bai-viet" },
};

/**
 * Reading `searchParams` makes this route render per request, which is what
 * URL-driven pagination requires — the filter, the keyword and the page number
 * are all part of the address. Only 20 rows are queried and shipped per view,
 * so each response is smaller than the old "fetch everything" listing.
 *
 * Nothing above the `<Suspense>` boundary touches MongoDB, so the page shell
 * is sent while the queries are still running: the visitor gets the heading
 * and a working search box straight away, and only the rows arrive late. See
 * `loading.tsx` for what covers the navigation itself.
 */
export default async function ArticlesPage(props: PageProps<"/bai-viet">) {
  const searchParams = await props.searchParams;

  const category = readParam(searchParams[LISTING_PARAM.category]);
  const query = readParam(searchParams[LISTING_PARAM.query]);
  const requestedPage = Number.parseInt(
    readParam(searchParams[LISTING_PARAM.page]),
    10,
  );
  const page = Number.isNaN(requestedPage) ? 1 : requestedPage;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ArticleListingTitle />
        <ArticleSearchInput category={category} query={query} />
      </div>

      {/*
        Keyed on the query so changing filter, keyword or page shows the
        skeleton again. Without the key React keeps the previous rows mounted
        until the new ones resolve, which looks like the click did nothing.
      */}
      <Suspense
        key={`${category}|${query}|${page}`}
        fallback={<ArticleResultsSkeleton />}
      >
        <ArticleResults category={category} query={query} page={page} />
      </Suspense>
    </div>
  );
}

async function ArticleResults({
  category,
  query,
  page,
}: {
  category: string;
  query: string;
  page: number;
}) {
  // Both reads share one request-cached query for the `categories` collection,
  // so this is two round trips to MongoDB, not four.
  const [categories, articles] = await Promise.all([
    getActiveCategories(),
    getPaginatedArticles({ page, categorySlug: category, query }),
  ]);

  return (
    <ArticleListingResults
      page={articles}
      filters={buildCategoryFilters(categories)}
      category={category}
      query={query}
    />
  );
}
