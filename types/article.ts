import type { ArticleLinkIcon } from "@/lib/article-links";

/**
 * Category an article belongs to. Stored as a reference to the `categories`
 * collection and resolved to the category **name** when read, so renaming a
 * category updates every article at once.
 */
export type ArticleCategory = string;

/** One row of the "Liên Kết Tải Xuống" block. Always an external URL. */
export interface ArticleLink {
  icon: ArticleLinkIcon;
  label: string;
  url: string;
}

/**
 * Shape used by every card and listing.
 *
 * Deliberately excludes `content`: the listing queries project it away so a
 * grid of 9 cards never ships nine article bodies to the client.
 */
export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: ArticleCategory;
  /** Preformatted dd/MM/yyyy — see `formatArticleDate`. */
  date: string;
  views: number;
  isFeatured: boolean;
  /** Reachable at its own URL, but kept out of every public listing. */
  isHidden: boolean;
}

export interface Article extends ArticleSummary {
  /** Sanitised HTML produced by the CMS editor. */
  content: string;
  author: string;
  links: ArticleLink[];
}

/** Adds the raw category id, which the CMS `<select>` needs. */
export interface AdminArticle extends Article {
  categoryId: string;
}
