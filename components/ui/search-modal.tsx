"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUi } from "@/components/providers/ui-provider";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  category: string;
}

/** Matches the server-side floor in `/api/articles/search`. */
const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;

export function SearchModal() {
  const { isSearchModalOpen } = useUi();

  // Mounting only while open keeps the keyword cleared between openings
  // and lets `autoFocus` do the focusing the original page did by hand.
  if (!isSearchModalOpen) return null;

  return <SearchModalContent />;
}

function SearchModalContent() {
  const { closeSearchModal } = useUi();
  const [query, setQuery] = useState("");
  /**
   * Results are stored together with the query they belong to, so "đang tìm"
   * and the visible list are both derived. Tracking them as separate state
   * would mean setting state synchronously inside the effect, which triggers
   * a cascading render.
   */
  const [data, setData] = useState<{ query: string; results: SearchResult[] }>({
    query: "",
    results: [],
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSearchModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeSearchModal]);

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length >= MIN_QUERY_LENGTH;

  const isSettled = data.query === trimmedQuery;
  const results = isSettled ? data.results : [];
  const isSearching = hasQuery && !isSettled;

  /**
   * Articles are queried on demand instead of being shipped with every page.
   * The debounce plus the two-character floor keeps this to roughly one
   * request per search rather than one per keystroke.
   */
  useEffect(() => {
    if (!hasQuery) return;

    const controller = new AbortController();

    const timer = setTimeout(() => {
      fetch(`/api/articles/search?q=${encodeURIComponent(trimmedQuery)}`, {
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : { results: [] }))
        .then((payload: { results?: SearchResult[] }) => {
          setData({ query: trimmedQuery, results: payload.results ?? [] });
        })
        .catch((error: unknown) => {
          // Aborted by the next keystroke — the newer request owns the state.
          if (error instanceof DOMException && error.name === "AbortError") return;
          setData({ query: trimmedQuery, results: [] });
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [hasQuery, trimmedQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop — clicking it dismisses the modal */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xs"
        onClick={closeSearchModal}
        aria-hidden="true"
      ></div>

      <div className="relative glass-card rounded-card max-w-xl w-full p-4 space-y-4 border border-dark-border">
        <div className="flex items-center gap-3 border-b border-dark-border pb-3">
          <i className="fa-solid fa-magnifying-glass text-neon-primary"></i>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nhập tên ứng dụng, game mod..."
            className="bg-transparent text-sm text-txt-primary w-full focus:outline-hidden"
            autoFocus
          />
          <button
            type="button"
            onClick={closeSearchModal}
            aria-label="Đóng tìm kiếm"
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-txt-secondary hover:text-txt-primary hover:bg-dark-bg transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
          {!hasQuery && (
            <p className="text-txt-secondary text-center py-4">
              Nhập ít nhất {MIN_QUERY_LENGTH} ký tự để bắt đầu tìm kiếm...
            </p>
          )}

          {hasQuery && isSearching && results.length === 0 && (
            <p className="text-txt-secondary text-center py-4">
              <i className="fa-solid fa-spinner fa-spin me-1"></i> Đang tìm...
            </p>
          )}

          {hasQuery && !isSearching && results.length === 0 && (
            <p className="text-txt-secondary text-center py-4">
              Không tìm thấy kết quả phù hợp.
            </p>
          )}

          {results.map((article) => (
            <Link
              key={article.id}
              href={`/bai-viet/${article.slug}`}
              onClick={closeSearchModal}
              className="p-2.5 rounded-btn bg-dark-bg hover:bg-dark-surface border border-dark-border flex items-center justify-between gap-2 cursor-pointer"
            >
              <span className="font-medium text-txt-primary line-clamp-1">
                {article.title}
              </span>
              {article.category && (
                <span className="shrink-0 text-neon-primary text-[10px] font-bold px-2 py-0.5 rounded-sm bg-neon-primary/10">
                  {article.category}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
