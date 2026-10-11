import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/dal";
import { getAllCategories } from "@/lib/data/categories";
import { CategoryManager } from "@/components/admin/category-manager";

export const metadata: Metadata = {
  title: "Quản lý danh mục | A-Pes Studio CMS",
};

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-txt-primary">
          Quản lý <span className="text-neon-primary">danh mục</span>
        </h1>
        <p className="text-sm text-txt-secondary">
          Danh mục điều khiển các pill lọc trên trang{" "}
          <code className="text-txt-primary">/bai-viet</code>. Thứ tự ở đây là
          thứ tự hiển thị.
        </p>
      </header>

      <CategoryManager categories={categories} />
    </div>
  );
}
