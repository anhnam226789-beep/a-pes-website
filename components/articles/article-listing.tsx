"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import {
  LISTING_PARAM,
  buildListingHref,
  type CategoryFilterOption,
} from "@/lib/articles";
import type { PaginatedArticles } from "@/lib/data/articles";
import { ArticleListCard } from "@/components/articles/article-list-card";
import { Pagination } from "@/components/ui/pagination";

const SEARCH_DEBOUNCE_MS = 350;

/**
 * Everything on `/bai-viet` that needs a database read: the filter pills, the
 * card grid and the pager.
 *
 * Rendered inside a `<Suspense>` boundary by the page, so the title and the
 * search box stay on screen — and the box stays typable — while these rows are
 * still being queried.
 */
export function ArticleListingResults({
  page,
  filters,
  category,
  query,
}: {
  page: PaginatedArticles;
  /** Built from the `categories` collection by the server component. */
  filters: CategoryFilterOption[];
  /** Active category slug, empty for "Tất Cả". */
  category: string;
  query: string;
}) {
  return (
    <div className="space-y-8">
      {/* Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 text-xs font-medium">
        {filters.map((filter) => {
          const isActive = filter.value === category;

          return (
            <Link
              key={filter.value || "all"}
              // Changing the filter always returns to page 1: page 4 of the
              // old result set rarely exists in the new one.
              href={buildListingHref({
                category: filter.value,
                query,
                page: 1,
              })}
              scroll={false}
              className={cn(
                "px-4 py-2 rounded-full whitespace-nowrap",
                isActive
                  ? "bg-neon-primary text-black font-bold"
                  : "bg-dark-card border border-dark-border text-txt-secondary hover:text-txt-primary",
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {/* Articles Grid: Mobile 2, Tablet 3, Desktop 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {page.articles.length === 0 ? (
          <div className="col-span-full text-center py-12 text-txt-secondary text-sm">
            Không tìm thấy bài viết phù hợp.
          </div>
        ) : (
          page.articles.map((article) => (
            <ArticleListCard key={article.id} article={article} />
          ))
        )}
      </div>

      {page.total > 0 && (
        <div className="space-y-4">
          <Pagination
            page={page.page}
            totalPages={page.totalPages}
            basePath="/bai-viet"
            params={{
              [LISTING_PARAM.category]: category,
              [LISTING_PARAM.query]: query,
            }}
            pageParam={LISTING_PARAM.page}
            label="Phân trang bài viết"
          />

          <p className="text-center text-xs text-txt-secondary">
            Hiển thị {page.from}–{page.to} trong {page.total} bài viết
            {page.totalPages > 1 && ` · trang ${page.page}/${page.totalPages}`}
          </p>
        </div>
      )}
    </div>
  );
}

export function ArticleSearchInput({
  category,
  query,
}: {
  category: string;
  query: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);

  // Follow the URL when it changes from outside the box — a category pill, the
  // back button — without clobbering what is being typed.
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setValue(query);
  }

  useEffect(() => {
    if (value === query) return;

    const timer = setTimeout(() => {
      router.replace(buildListingHref({ category, query: value, page: 1 }), {
        // Keeping the viewport still matters here: the results are below the
        // box, and jumping to the top on every keystroke is unusable.
        scroll: false,
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value, query, category, router]);

  return (
    <div className="relative w-full sm:w-72">
      <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-secondary text-sm"></i>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Tìm theo tên bài viết..."
        aria-label="Tìm bài viết"
        className="w-full bg-dark-card border border-dark-border rounded-btn pl-10 pr-4 py-2.5 text-sm text-txt-primary focus:outline-hidden focus:border-neon-primary transition-all"
      />
    </div>
  );
}
