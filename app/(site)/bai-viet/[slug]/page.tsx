/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/lib/data/articles";
import { formatViews } from "@/lib/format";
import { getReadingMinutes } from "@/lib/reading-time";
import { ArticleViewCounter } from "@/components/articles/article-view-counter";
import { DownloadSection } from "@/components/articles/download-section";
import { RelatedArticleCard } from "@/components/articles/related-article-card";

// ISR: prerendered and refreshed every 5 minutes, plus an immediate
// `revalidatePath` from the CMS whenever the article is saved.
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/bai-viet/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Không tìm thấy bài viết | A-Pes Studio" };
  }

  return {
    title: `${article.title} | A-Pes Studio`,
    description: article.excerpt,
    alternates: { canonical: `/bai-viet/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
      type: "article",
    },
  };
}

/** Initials for the author avatar, e.g. "A-Pes Studio" → "AS". */
function getAuthorInitials(author: string): string {
  const initials = author
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "AP";
}

export default async function ArticleDetailPage(
  props: PageProps<"/bai-viet/[slug]">,
) {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  // A policy page is a utility page, not content: suggesting game mods at the
  // bottom of the terms of use reads as a mistake, and the query is skipped.
  const relatedArticles = article.isHidden
    ? []
    : await getRelatedArticles(article, article.category);

  const readingMinutes = getReadingMinutes(article.content);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ArticleViewCounter articleId={article.id} />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-txt-secondary">
        <Link href="/" className="hover:text-neon-primary">
          Trang chủ
        </Link>
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        <Link href="/bai-viet" className="hover:text-neon-primary">
          {article.category || "Bài viết"}
        </Link>
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        <span className="text-txt-primary font-medium truncate max-w-[200px]">
          {article.title}
        </span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4">
        {article.category && (
          <span className="inline-block px-3 py-1 rounded-full bg-neon-primary/10 border border-neon-primary/30 text-neon-primary text-xs font-bold uppercase tracking-wider">
            {article.category}
          </span>
        )}

        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-txt-primary leading-tight [overflow-wrap:break-word]">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-txt-secondary border-b border-dark-border pb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neon-primary/20 flex items-center justify-center text-neon-primary font-bold text-[10px]">
              {getAuthorInitials(article.author)}
            </div>
            <span className="text-txt-primary font-medium">
              {article.author}
            </span>
          </div>
          <span>•</span>
          <span>
            <i className="fa-regular fa-calendar me-1"></i> {article.date}
          </span>
          <span>•</span>
          <span>
            <i className="fa-regular fa-clock me-1"></i> {readingMinutes} phút đọc
          </span>
          <span>•</span>
          <span>
            <i className="fa-regular fa-eye me-1"></i>{" "}
            {formatViews(article.views)} lượt xem
          </span>
        </div>
      </header>

      {/*
        Cover Image — a real 16:9 box.

        This used to be `max-h-[420px]` on the wrapper with `h-full` on the
        image. `h-full` resolves to `auto` when the parent has no definite
        height, so the image rendered at its natural size and `overflow-hidden`
        simply chopped the bottom off: 10% of a 16:9 cover, 33% of a 4:3 one.
        A declared aspect ratio gives the image a definite box, which is what
        `object-cover` needs to scale instead of crop.
      */}
      <div className="rounded-card overflow-hidden border border-dark-border shadow-2xl relative aspect-[16/9] bg-dark-bg">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/*
        Lead paragraph with the neon rule down its left edge.

        The original static page hardcoded this as the first paragraph of the
        body. Now that "mô tả ngắn" is its own CMS field, the excerpt fills the
        role — the styling would otherwise have been lost when the body moved
        into the editor, since a rule like this cannot survive as markup an
        editor types.
      */}
      <p className="text-lg font-medium text-txt-primary/90 leading-relaxed border-l-4 border-neon-primary pl-4 py-1 [overflow-wrap:break-word]">
        {article.excerpt}
      </p>

      {/*
        Content is sanitised on write (`lib/articles/sanitize.ts`) against an
        allow-list matching what the CMS editor can produce.
      */}
      <article
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <DownloadSection links={article.links} />

      {relatedArticles.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-dark-border">
          <h3 className="text-xl font-bold text-txt-primary flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-neon-primary"></i> Bài Viết
            Liên Quan
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {relatedArticles.map((related) => (
              <RelatedArticleCard key={related.id} article={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
