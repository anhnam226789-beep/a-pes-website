import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { ADMIN_ARTICLE_PARAM, readParam } from "@/lib/articles";
import {
  getArticleStats,
  getPaginatedAdminArticles,
} from "@/lib/data/articles";
import { ArticleSearch } from "@/components/admin/article-search";
import { ArticleTable } from "@/components/admin/article-table";
import { ADMIN_PRIMARY_BUTTON_CLASS } from "@/components/admin/styles";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "Quản lý bài viết | A-Pes Studio CMS",
};

export default async function AdminArticlesPage(
  props: PageProps<"/admin/articles">,
) {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const query = readParam(searchParams[ADMIN_ARTICLE_PARAM.query]);
  const requestedPage = Number.parseInt(
    readParam(searchParams[ADMIN_ARTICLE_PARAM.page]),
    10,
  );

  // Counters come from the whole collection, the rows from the current page —
  // so a filtered or paged view never misreports how many articles exist.
  const [stats, page] = await Promise.all([
    getArticleStats(),
    getPaginatedAdminArticles({
      page: Number.isNaN(requestedPage) ? 1 : requestedPage,
      query,
    }),
  ]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-txt-primary">
              Quản lý <span className="text-neon-primary">bài viết</span>
            </h1>
            <p className="text-sm text-txt-secondary">
              {stats.total} bài · {stats.featured} nổi bật ở trang chủ
              {stats.hidden > 0 && ` · ${stats.hidden} bài ẩn`}
            </p>
          </div>

          <Link
            href="/admin/articles/new"
            className={`${ADMIN_PRIMARY_BUTTON_CLASS} shrink-0`}
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Viết bài mới</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <ArticleSearch query={query} />

          {isSearching && (
            <p className="text-xs text-txt-secondary">
              {page.total} kết quả cho{" "}
              <strong className="text-txt-primary">
                &quot;{query.trim()}&quot;
              </strong>
              {" · "}
              <Link
                href="/admin/articles"
                className="text-neon-primary hover:underline"
              >
                Xoá bộ lọc
              </Link>
            </p>
          )}
        </div>
      </header>

      {page.total === 0 ? (
        <p className="glass-card rounded-card border border-dark-border p-6 text-sm text-txt-secondary text-center">
          {isSearching
            ? "Không có bài viết nào khớp với từ khoá này."
            : "Chưa có bài viết nào. Bấm “Viết bài mới” để bắt đầu."}
        </p>
      ) : (
        <>
          <ArticleTable articles={page.articles} />

          <div className="space-y-4">
            <Pagination
              page={page.page}
              totalPages={page.totalPages}
              basePath="/admin/articles"
              params={{ [ADMIN_ARTICLE_PARAM.query]: query }}
              pageParam={ADMIN_ARTICLE_PARAM.page}
              label="Phân trang bài viết trong CMS"
            />

            <p className="text-center text-xs text-txt-secondary">
              Hiển thị {page.from}–{page.to} trong {page.total} bài
              {page.totalPages > 1 && ` · trang ${page.page}/${page.totalPages}`}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
