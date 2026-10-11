import "server-only";

import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { ArticleModel } from "@/lib/db/models/article";
import { CategoryModel } from "@/lib/db/models/category";
import { getCategoryLookup } from "@/lib/data/categories";
import { formatArticleDate } from "@/lib/format";
import { isArticleLinkIcon } from "@/lib/article-links";
import type {
  AdminArticle,
  Article,
  ArticleLink,
  ArticleSummary,
} from "@/types/article";

/**
 * Fields a card needs. `content` is deliberately absent: a 9-card grid must
 * not ship nine article bodies in the RSC payload.
 */
const SUMMARY_FIELDS =
  "title slug excerpt coverImage category isFeatured isHidden views publishedAt";

/**
 * Every public listing hides `isHidden` articles.
 *
 * `$ne: true` rather than `false` so documents written before the field
 * existed — which have no `isHidden` at all — still count as visible.
 */
const VISIBLE_ONLY = { isHidden: { $ne: true } } as const;

/** Shape returned by a `.lean()` query with a populated `category`. */
interface LeanArticle {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content?: string;
  category: { _id: Types.ObjectId; name: string } | Types.ObjectId | null;
  author?: string;
  links?: { icon: string; label: string; url: string }[];
  isFeatured: boolean;
  isHidden?: boolean;
  views: number;
  publishedAt: Date;
}

/**
 * Category name for a row.
 *
 * Single-document reads still `.populate()`, which carries the name inline.
 * List reads skip that extra round trip and pass the request-cached
 * `nameById` map instead — see `getCategoryLookup`.
 */
function readCategoryName(
  category: LeanArticle["category"],
  categoryNames?: Map<string, string>,
): string {
  if (!category) return "";
  if ("name" in category) return category.name;
  // Empty when the category row was deleted out from under the article.
  return categoryNames?.get(category.toString()) ?? "";
}

function toSummary(
  doc: LeanArticle,
  categoryNames?: Map<string, string>,
): ArticleSummary {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    coverImage: doc.coverImage,
    category: readCategoryName(doc.category, categoryNames),
    date: formatArticleDate(doc.publishedAt.toISOString()),
    views: doc.views,
    isFeatured: doc.isFeatured,
    isHidden: doc.isHidden ?? false,
  };
}

function toArticle(doc: LeanArticle): Article {
  const links: ArticleLink[] = (doc.links ?? [])
    // Drop rows whose icon is no longer part of the fixed set instead of
    // rendering a blank button.
    .filter((link) => isArticleLinkIcon(link.icon))
    .map((link) => ({
      icon: link.icon as ArticleLink["icon"],
      label: link.label,
      url: link.url,
    }));

  return {
    ...toSummary(doc),
    content: doc.content ?? "",
    author: doc.author ?? "",
    links,
  };
}

export const ARTICLES_PER_PAGE = 20;

export interface PaginatedArticles {
  articles: ArticleSummary[];
  /** Clamped into `1…totalPages`, so it is always a page that exists. */
  page: number;
  totalPages: number;
  total: number;
  /** 1-based index of the first item on this page; 0 when empty. */
  from: number;
  to: number;
}

/** Escapes a user string so it can be used inside a `$regex`. */
function toSafeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** One window of rows, newest first. No `populate` — see `readCategoryName`. */
function findPage(
  filter: Record<string, unknown>,
  page: number,
  pageSize: number,
): Promise<LeanArticle[]> {
  return ArticleModel.find(filter)
    .select(SUMMARY_FIELDS)
    .sort({ publishedAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean<LeanArticle[]>();
}

/**
 * Runs one page of a query. Shared by the public listing and the CMS list so
 * both clamp out-of-range pages and report ranges the same way.
 *
 * The count, the rows and the category names are three independent reads, so
 * they go out together instead of one after another: the listing renders per
 * request, and on a serverless deployment each extra round trip to Atlas is
 * time the visitor spends looking at a skeleton. The clamp still works — a
 * `?trang=999` that overshoots simply costs one follow-up query, which is the
 * rare case rather than every page view.
 */
async function paginate(
  filter: Record<string, unknown>,
  page: number,
  pageSize: number,
): Promise<PaginatedArticles> {
  const requestedPage = Math.max(1, Math.trunc(page) || 1);

  const [total, lookup, requestedDocs] = await Promise.all([
    ArticleModel.countDocuments(filter),
    getCategoryLookup(),
    findPage(filter, requestedPage, pageSize),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // `?trang=999` lands on the last page instead of an empty screen.
  const currentPage = Math.min(requestedPage, totalPages);

  const docs =
    currentPage === requestedPage
      ? requestedDocs
      : await findPage(filter, currentPage, pageSize);

  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  return {
    articles: docs.map((doc) => toSummary(doc, lookup.nameById)),
    page: currentPage,
    totalPages,
    total,
    from,
    to: from === 0 ? 0 : from + docs.length - 1,
  };
}

/**
 * One page of the public listing.
 *
 * Filtering and paging both happen in MongoDB rather than in the browser:
 * the page only ever ships the 20 rows it shows, and every combination of
 * filter + page is a real URL that can be shared, bookmarked and crawled.
 */
export async function getPaginatedArticles({
  page = 1,
  categorySlug,
  query = "",
  pageSize = ARTICLES_PER_PAGE,
}: {
  page?: number;
  categorySlug?: string;
  query?: string;
  pageSize?: number;
}): Promise<PaginatedArticles> {
  await connectToDatabase();

  const filter: Record<string, unknown> = { ...VISIBLE_ONLY };

  if (categorySlug) {
    // Resolved from the request-cached category list rather than its own
    // `findOne`, so filtering by category costs no extra round trip.
    const categoryId = (await getCategoryLookup()).idBySlug.get(categorySlug);

    // Unknown slug means no article can match — not "show everything".
    if (!categoryId) {
      return { articles: [], page: 1, totalPages: 1, total: 0, from: 0, to: 0 };
    }

    filter.category = new Types.ObjectId(categoryId);
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    const regex = { $regex: toSafeRegex(trimmedQuery), $options: "i" };
    // Same scope as the old client-side filter: title + short description.
    filter.$or = [{ title: regex }, { excerpt: regex }];
  }

  return paginate(filter, page, pageSize);
}

/**
 * One page of the CMS list.
 *
 * Unlike the public listing this keeps hidden articles — the policy pages
 * have to be reachable from the screen that edits them — and matches `slug`
 * as well, because an editor is often handed a URL rather than a title.
 */
export async function getPaginatedAdminArticles({
  page = 1,
  query = "",
  pageSize = ARTICLES_PER_PAGE,
}: {
  page?: number;
  query?: string;
  pageSize?: number;
}): Promise<PaginatedArticles> {
  await connectToDatabase();

  const trimmedQuery = query.trim();
  const filter: Record<string, unknown> = trimmedQuery
    ? {
        $or: [
          { title: { $regex: toSafeRegex(trimmedQuery), $options: "i" } },
          { slug: { $regex: toSafeRegex(trimmedQuery), $options: "i" } },
          { excerpt: { $regex: toSafeRegex(trimmedQuery), $options: "i" } },
        ],
      }
    : {};

  return paginate(filter, page, pageSize);
}

/** The "Bài Viết Nổi Bật" grid on the home page. */
export async function getFeaturedArticles(limit = 9): Promise<ArticleSummary[]> {
  await connectToDatabase();

  const [lookup, docs] = await Promise.all([
    getCategoryLookup(),
    ArticleModel.find({ isFeatured: true, ...VISIBLE_ONLY })
      .select(SUMMARY_FIELDS)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean<LeanArticle[]>(),
  ]);

  return docs.map((doc) => toSummary(doc, lookup.nameById));
}

/**
 * Detail lookup. Accepts a slug, and falls back to the object id so links
 * built before an article was renamed keep working.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  await connectToDatabase();

  const query = Types.ObjectId.isValid(slug)
    ? { $or: [{ slug }, { _id: new Types.ObjectId(slug) }] }
    : { slug };

  const doc = await ArticleModel.findOne(query)
    .populate<{ category: { _id: Types.ObjectId; name: string } }>(
      "category",
      "name",
      CategoryModel,
    )
    .lean<LeanArticle | null>();

  return doc ? toArticle(doc) : null;
}

/** Same category first, topped up with the newest articles when short. */
export async function getRelatedArticles(
  article: Pick<Article, "id">,
  categoryName: string,
  limit = 4,
): Promise<ArticleSummary[]> {
  await connectToDatabase();

  const category = categoryName
    ? await CategoryModel.findOne({ name: categoryName }).select("_id").lean()
    : null;

  const excluded = [new Types.ObjectId(article.id)];

  const sameCategory = category
    ? await ArticleModel.find({
        category: category._id,
        _id: { $nin: excluded },
        ...VISIBLE_ONLY,
      })
        .select(SUMMARY_FIELDS)
        .populate<{ category: { _id: Types.ObjectId; name: string } }>(
          "category",
          "name",
          CategoryModel,
        )
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean<LeanArticle[]>()
    : [];

  // Wrapped rather than passed straight to `.map`, which would hand the array
  // index to `toSummary`'s second parameter.
  if (sameCategory.length >= limit)
    return sameCategory.map((doc) => toSummary(doc));

  const fillers = await ArticleModel.find({
    _id: { $nin: [...excluded, ...sameCategory.map((doc) => doc._id)] },
    ...VISIBLE_ONLY,
  })
    .select(SUMMARY_FIELDS)
    .populate<{ category: { _id: Types.ObjectId; name: string } }>(
      "category",
      "name",
      CategoryModel,
    )
    .sort({ publishedAt: -1 })
    .limit(limit - sameCategory.length)
    .lean<LeanArticle[]>();

  return [...sameCategory, ...fillers].map((doc) => toSummary(doc));
}

/** Full record for the CMS edit form, including the raw category id. */
export async function getArticleForAdmin(
  id: string,
): Promise<AdminArticle | null> {
  if (!Types.ObjectId.isValid(id)) return null;

  await connectToDatabase();

  const doc = await ArticleModel.findById(id)
    .populate<{ category: { _id: Types.ObjectId; name: string } }>(
      "category",
      "name",
      CategoryModel,
    )
    .lean<LeanArticle | null>();

  if (!doc) return null;

  const categoryId =
    doc.category && "name" in doc.category
      ? doc.category._id.toString()
      : doc.category?.toString() ?? "";

  return { ...toArticle(doc), categoryId };
}

/** Dashboard counters — cheap `countDocuments`, no rows fetched. */
export async function getArticleStats(): Promise<{
  total: number;
  /** Articles that appear in public listings, i.e. everything but `isHidden`. */
  publicTotal: number;
  featured: number;
  hidden: number;
  /** Public articles whose "Liên Kết Tải Xuống" block would render empty. */
  withoutLinks: number;
}> {
  await connectToDatabase();

  const [total, publicTotal, featured, hidden, withoutLinks] = await Promise.all([
    ArticleModel.countDocuments(),
    ArticleModel.countDocuments(VISIBLE_ONLY),
    ArticleModel.countDocuments({ isFeatured: true, ...VISIBLE_ONLY }),
    ArticleModel.countDocuments({ isHidden: true }),
    // Both sides of this ratio count public articles only. Policy pages are
    // not supposed to carry download links, so including them would raise a
    // warning that can never be cleared.
    ArticleModel.countDocuments({ links: { $size: 0 }, ...VISIBLE_ONLY }),
  ]);

  return { total, publicTotal, featured, hidden, withoutLinks };
}

/** Slugs for `generateStaticParams` on the detail route. */
export async function getArticleSlugs(): Promise<string[]> {
  await connectToDatabase();
  const docs = await ArticleModel.find().select("slug").lean<{ slug: string }[]>();
  return docs.map((doc) => doc.slug);
}

/** Sitemap: public URLs only, so hidden articles stay out of the index. */
export async function getArticleSitemapEntries(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  await connectToDatabase();
  const docs = await ArticleModel.find(VISIBLE_ONLY)
    .select("slug updatedAt")
    .lean<{ slug: string; updatedAt: Date }[]>();
  return docs.map((doc) => ({ slug: doc.slug, updatedAt: doc.updatedAt }));
}

/** Header search modal: title match only, same scope as before. */
export async function searchArticlesByTitle(
  query: string,
  limit = 8,
): Promise<Pick<ArticleSummary, "id" | "slug" | "title" | "category">[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  await connectToDatabase();

  const [lookup, docs] = await Promise.all([
    getCategoryLookup(),
    ArticleModel.find({
      // Escaped so a user typing `(` cannot throw an invalid-regex error.
      title: {
        $regex: trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      },
      ...VISIBLE_ONLY,
    })
      .select("title slug category")
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean<LeanArticle[]>(),
  ]);

  return docs.map((doc) => ({
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    category: readCategoryName(doc.category, lookup.nameById),
  }));
}
