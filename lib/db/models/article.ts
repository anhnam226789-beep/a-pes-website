import { Schema, model, models, type Model, type Types } from "mongoose";
import { ARTICLE_LINK_ICON_VALUES } from "@/lib/article-links";

export const DEFAULT_ARTICLE_AUTHOR = "A-Pes Studio";

export interface ArticleLinkSubdocument {
  icon: string;
  label: string;
  url: string;
}

export interface ArticleDocument {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  /** Sanitised HTML — see `lib/articles/sanitize.ts`. */
  content: string;
  category: Types.ObjectId;
  author: string;
  links: ArticleLinkSubdocument[];
  isFeatured: boolean;
  /**
   * Keeps the article out of the home grid, the listing, related articles and
   * the header search, while leaving it reachable at its own URL. Used by the
   * policy pages linked from the footer.
   */
  isHidden: boolean;
  views: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const articleLinkSchema = new Schema<ArticleLinkSubdocument>(
  {
    icon: { type: String, required: true, enum: ARTICLE_LINK_ICON_VALUES },
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const articleSchema = new Schema<ArticleDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    coverImage: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    // A reference rather than a copied name: renaming a category must not
    // orphan its articles from the listing filter.
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    author: { type: String, required: true, default: DEFAULT_ARTICLE_AUTHOR },
    links: { type: [articleLinkSchema], default: [] },
    isFeatured: { type: Boolean, required: true, default: false },
    isHidden: { type: Boolean, required: true, default: false },
    // Bumped by `POST /api/articles/[id]/view`, never edited by hand.
    views: { type: Number, required: true, default: 0, min: 0 },
    publishedAt: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true, collection: "articles" },
);

// Every public query filters out hidden articles and sorts newest-first;
// the home grid narrows that further by the featured flag.
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ isHidden: 1, publishedAt: -1 });
articleSchema.index({ isHidden: 1, isFeatured: 1, publishedAt: -1 });
// `/bai-viet?danh-muc=…`. The single-field index on `category` can find the
// rows but not return them in order, leaving the sort to run in memory on
// every filtered page view; this one serves the filter and the sort together.
articleSchema.index({ category: 1, isHidden: 1, publishedAt: -1 });

export const ArticleModel: Model<ArticleDocument> =
  (models.Article as Model<ArticleDocument>) ??
  model<ArticleDocument>("Article", articleSchema);
