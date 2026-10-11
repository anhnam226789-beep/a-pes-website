/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ArticleSummary } from "@/types/article";

/** Compact card used by the article listing grid. */
export function ArticleListCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/bai-viet/${article.slug}`}
      className="glass-card rounded-card overflow-hidden cursor-pointer hover:border-neon-primary/50 transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        {/* 16:9 to match the covers uploaded from the CMS — a 4:3 box cropped
            a quarter of their width away. */}
        <div className="relative aspect-[16/9] overflow-hidden bg-dark-bg">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 border border-neon-primary/30 text-neon-primary text-[10px] font-bold">
            {article.category}
          </span>
        </div>
        <div className="p-3 space-y-1.5">
          <h3 className="font-bold text-xs text-txt-primary line-clamp-2 group-hover:text-neon-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-[10px] text-txt-secondary line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>
      <div className="p-3 pt-0 flex justify-between items-center text-[10px] text-txt-secondary">
        <span>{article.date}</span>
        <span className="text-neon-primary font-semibold flex items-center gap-1">
          Xem <i className="fa-solid fa-angle-right text-[8px]"></i>
        </span>
      </div>
    </Link>
  );
}
