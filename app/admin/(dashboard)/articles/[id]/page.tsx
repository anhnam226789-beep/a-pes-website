import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { getAllCategories } from "@/lib/data/categories";
import { getArticleForAdmin } from "@/lib/data/articles";
import { isR2Configured } from "@/lib/r2/client";
import { ArticleForm } from "@/components/admin/article-form";

export const metadata: Metadata = {
  title: "Sửa bài viết | A-Pes Studio CMS",
};

export default async function AdminEditArticlePage(
  props: PageProps<"/admin/articles/[id]">,
) {
  await requireAdmin();

  const { id } = await props.params;

  const [article, categories] = await Promise.all([
    getArticleForAdmin(id),
    getAllCategories(),
  ]);

  if (!article) notFound();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-txt-primary line-clamp-2">
          {article.title}
        </h1>
        <p className="text-sm text-txt-secondary">
          Đăng ngày {article.date} · {article.views} lượt xem
        </p>
      </header>

      <ArticleForm
        article={article}
        categories={categories}
        uploadEnabled={isR2Configured()}
      />
    </div>
  );
}
