/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { formatViews } from "@/lib/format";
import type { ArticleSummary } from "@/types/article";

/** Card used by the "Bài Viết Nổi Bật" grid on the home page. */
export function FeaturedArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/bai-viet/${article.slug}`}
      className="glass-card rounded-card overflow-hidden cursor-pointer hover:-translate-y-1 hover:border-neon-primary/50 transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        {/* Thumbnail aspect 4:5 mobile friendly */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-dark-bg">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-neon-primary/30 text-neon-primary text-[10px] font-bold">
            {article.category}
          </span>
        </div>
        <div className="p-3 sm:p-4 space-y-2">
          <h3 className="font-bold text-xs sm:text-sm text-txt-primary line-clamp-2 group-hover:text-neon-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-txt-secondary line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>
      <div className="p-3 sm:p-4 pt-2.5 sm:pt-3 mt-2 flex justify-between items-center text-[10px] text-txt-secondary border-t border-white/5">
        <span>
          <i className="fa-regular fa-calendar me-1"></i> {article.date}
        </span>
        <span>
          <i className="fa-regular fa-eye me-1"></i> {formatViews(article.views)}
        </span>
      </div>
    </Link>
  );
}
