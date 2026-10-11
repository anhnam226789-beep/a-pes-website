"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_ARTICLE_PARAM } from "@/lib/articles";
import { ADMIN_INPUT_CLASS } from "@/components/admin/styles";

const DEBOUNCE_MS = 350;

function buildHref(query: string): string {
  const trimmed = query.trim();
  return trimmed
    ? `/admin/articles?${ADMIN_ARTICLE_PARAM.query}=${encodeURIComponent(trimmed)}`
    : "/admin/articles";
}

/**
 * Search box for the CMS article list.
 *
 * Drives the URL rather than local state, matching the public listing: the
 * filtering runs in MongoDB, so a search reaches every article rather than
 * only the page already loaded, and a filtered view can be shared or reloaded.
 */
export function ArticleSearch({ query }: { query: string }) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);

  // Follow the URL when it changes from outside the box (back button, a link)
  // without clobbering what is being typed.
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setValue(query);
  }

  useEffect(() => {
    if (value === query) return;

    const timer = setTimeout(() => {
      // `replace` so each keystroke does not add a history entry, and
      // `scroll: false` because the results sit below the box.
      router.replace(buildHref(value), { scroll: false });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value, query, router]);

  return (
    <div className="relative w-full sm:w-80">
      <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-secondary text-sm"></i>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Tìm theo tiêu đề, slug hoặc mô tả..."
        aria-label="Tìm bài viết trong CMS"
        className={`${ADMIN_INPUT_CLASS} pl-10 pr-9`}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Xoá từ khoá"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-txt-secondary hover:text-txt-primary hover:bg-dark-card transition-colors"
        >
          <i className="fa-solid fa-xmark text-xs"></i>
        </button>
      )}
    </div>
  );
}
