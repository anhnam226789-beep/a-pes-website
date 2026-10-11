/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ArticleSummary } from "@/types/article";

/** Card used by the "Bài Viết Liên Quan" grid on the detail page. */
export function RelatedArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/bai-viet/${article.slug}`}
      className="glass-card rounded-card overflow-hidden cursor-pointer hover:border-neon-primary/50 transition-all p-2.5 flex flex-col justify-between group"
    >
      <div className="space-y-2">
        {/* Fixed `h-24` made the crop depend on column width; 16:9 matches
            the uploaded covers at every breakpoint. */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-dark-bg">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <h4 className="font-bold text-xs text-txt-primary line-clamp-2 group-hover:text-neon-primary transition-colors">
          {article.title}
        </h4>
      </div>
      <div className="mt-2 text-[10px] text-neon-primary font-semibold">
        Tải ngay →
      </div>
    </Link>
  );
}
