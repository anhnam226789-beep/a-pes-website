"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  deleteArticleAction,
  toggleArticleFeaturedAction,
} from "@/lib/actions/articles";
import { formatViews } from "@/lib/format";
import type { ArticleSummary } from "@/types/article";
import {
  ADMIN_CARD_CLASS,
  ADMIN_DANGER_BUTTON_CLASS,
  ADMIN_ICON_BUTTON_CLASS,
  ADMIN_SECONDARY_BUTTON_CLASS,
} from "@/components/admin/styles";

export function ArticleTable({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) {
    return (
      <p className={`${ADMIN_CARD_CLASS} p-6 text-sm text-txt-secondary text-center`}>
        Chưa có bài viết nào. Bấm &quot;Viết bài mới&quot; để bắt đầu.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {articles.map((article) => (
        <li
          key={article.id}
          className={`${ADMIN_CARD_CLASS} p-3 flex flex-col sm:flex-row sm:items-center gap-3`}
        >
          <img
            src={article.coverImage}
            alt=""
            className="w-full sm:w-28 h-28 sm:h-16 object-cover rounded-btn border border-dark-border shrink-0"
          />

          <div className="grow min-w-0 space-y-1">
            <p className="text-sm font-bold text-txt-primary line-clamp-1">
              {article.isHidden && (
                <span
                  className="me-1.5 align-middle px-1.5 py-0.5 rounded-sm bg-dark-bg border border-dark-border text-[10px] font-semibold text-txt-secondary"
                  title="Không hiển thị ở trang chủ, danh sách, bài liên quan và tìm kiếm"
                >
                  <i className="fa-solid fa-eye-slash me-1"></i>Ẩn
                </span>
              )}
              {article.title}
            </p>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-txt-secondary">
              <span className="text-neon-primary font-semibold">
                {article.category || "— chưa có danh mục —"}
              </span>
              <span>
                <i className="fa-regular fa-calendar me-1"></i>
                {article.date}
              </span>
              <span>
                <i className="fa-regular fa-eye me-1"></i>
                {formatViews(article.views)}
              </span>
              <code className="text-txt-secondary/80">/{article.slug}</code>
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Separate forms: sibling, never nested inside another form. */}
            <form action={toggleArticleFeaturedAction}>
              <input type="hidden" name="id" value={article.id} />
              <button
                type="submit"
                title={
                  article.isFeatured
                    ? "Bỏ nổi bật (ẩn khỏi trang chủ)"
                    : "Đánh dấu nổi bật (hiện ở trang chủ)"
                }
                className={ADMIN_ICON_BUTTON_CLASS}
              >
                <i
                  className={
                    article.isFeatured
                      ? "fa-solid fa-star text-yellow-400 text-xs"
                      : "fa-regular fa-star text-xs"
                  }
                ></i>
              </button>
            </form>

            <Link
              href={`/admin/articles/${article.id}`}
              title="Sửa bài viết"
              className={ADMIN_SECONDARY_BUTTON_CLASS}
            >
              <i className="fa-solid fa-pen text-xs"></i>
              <span className="hidden sm:inline">Sửa</span>
            </Link>

            <form action={deleteArticleAction}>
              <input type="hidden" name="id" value={article.id} />
              <button
                type="submit"
                onClick={(event) => {
                  if (!window.confirm(`Xoá bài viết "${article.title}"?`)) {
                    event.preventDefault();
                  }
                }}
                title="Xoá bài viết"
                className={ADMIN_DANGER_BUTTON_CLASS}
              >
                <i className="fa-solid fa-trash text-xs"></i>
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
