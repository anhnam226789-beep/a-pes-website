import Link from "next/link";
import { getFeaturedArticles } from "@/lib/data/articles";
import { FeaturedArticleCard } from "@/components/articles/featured-article-card";

export async function FeaturedPostsSection() {
  const articles = await getFeaturedArticles();

  return (
    <section 
      id="featured-posts-grid"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-txt-primary">
            Bài Viết <span className="text-neon-primary">Nổi Bật</span>
          </h2>
          <p className="text-sm text-txt-secondary">
            Cập nhật ứng dụng, game mod &amp; thủ thuật mới nhất
          </p>
        </div>
        <Link
          href="/bai-viet"
          className="text-sm font-semibold text-neon-primary hover:underline flex items-center gap-1"
        >
          Xem tất cả bài viết{" "}
          <i className="fa-solid fa-arrow-right text-xs"></i>
        </Link>
      </div>

      {/* Featured Grid: Mobile 2 columns, Desktop 3 columns */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
        {articles.length === 0 ? (
          <p className="col-span-full glass-card rounded-card p-6 text-sm text-txt-secondary text-center">
            Chưa có bài viết nào được đánh dấu nổi bật.
          </p>
        ) : (
          articles.map((article) => (
            <FeaturedArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
    </section>
  );
}
