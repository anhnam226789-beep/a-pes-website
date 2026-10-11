import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/dal";
import { getAllCategories } from "@/lib/data/categories";
import { isR2Configured } from "@/lib/r2/client";
import { ArticleForm } from "@/components/admin/article-form";
import { ADMIN_CARD_CLASS } from "@/components/admin/styles";

export const metadata: Metadata = {
  title: "Viết bài mới | A-Pes Studio CMS",
};

export default async function AdminNewArticlePage() {
  await requireAdmin();

  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-txt-primary">
          Viết <span className="text-neon-primary">bài mới</span>
        </h1>
      </header>

      {categories.length === 0 ? (
        <p className={`${ADMIN_CARD_CLASS} p-6 text-sm text-txt-secondary text-center`}>
          Cần ít nhất một danh mục trước khi tạo bài viết.
        </p>
      ) : (
        <ArticleForm categories={categories} uploadEnabled={isR2Configured()} />
      )}
    </div>
  );
}
