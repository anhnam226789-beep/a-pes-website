"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Types } from "mongoose";
import { requireAdmin } from "@/lib/auth/dal";
import { connectToDatabase } from "@/lib/db/connect";
import { ArticleModel, DEFAULT_ARTICLE_AUTHOR } from "@/lib/db/models/article";
import { CategoryModel } from "@/lib/db/models/category";
import { isDuplicateKeyError } from "@/lib/db/errors";
import { toWriteFailure } from "@/lib/actions/form-error";
import { isArticleLinkIcon } from "@/lib/article-links";
import {
  MAX_CONTENT_LABEL,
  isContentEmpty,
  isContentWithinLimit,
  sanitizeArticleContent,
} from "@/lib/articles/sanitize";
import { slugify } from "@/lib/slug";
import type { FormState } from "@/types/form-state";

/**
 * Pages whose content depends on the `articles` collection.
 *
 * The detail page is revalidated by slug; both the old and the new slug are
 * passed on a rename so the previous URL stops serving stale content.
 */
function revalidateArticleConsumers(slugs: string[] = []): void {
  revalidatePath("/");
  revalidatePath("/bai-viet");
  revalidatePath("/admin/articles");
  // The editor itself. `/admin/articles` does not cover it — a path without a
  // matching dynamic segment leaves `/admin/articles/<id>` cached, so the form
  // was still being handed the article as it looked before the save.
  revalidatePath("/admin/articles/[id]", "page");

  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(`/bai-viet/${slug}`);
  }
}

interface ArticleInput {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string;
  category: Types.ObjectId;
  author: string;
  isFeatured: boolean;
  isHidden: boolean;
  links: { icon: string; label: string; url: string }[];
}

/**
 * Link rows arrive as three parallel arrays because the form posts one
 * `linkIcon` / `linkLabel` / `linkUrl` field per row. A row is kept only when
 * both label and URL are filled, which lets the CMS render a blank spare row.
 */
function readLinks(formData: FormData): {
  links: ArticleInput["links"];
  error?: string;
} {
  const icons = formData.getAll("linkIcon").map(String);
  const labels = formData.getAll("linkLabel").map(String);
  const urls = formData.getAll("linkUrl").map(String);

  const links: ArticleInput["links"] = [];

  for (let index = 0; index < icons.length; index += 1) {
    const label = (labels[index] ?? "").trim();
    const url = (urls[index] ?? "").trim();

    if (!label && !url) continue;

    if (!label || !url) {
      return { links: [], error: "Mỗi liên kết cần đủ cả nhãn và đường dẫn." };
    }

    if (!/^https?:\/\//i.test(url)) {
      return {
        links: [],
        error: `Đường dẫn "${label}" phải bắt đầu bằng http:// hoặc https://.`,
      };
    }

    const icon = icons[index];
    if (!isArticleLinkIcon(icon)) {
      return { links: [], error: `Icon của liên kết "${label}" không hợp lệ.` };
    }

    links.push({ icon, label, url });
  }

  return { links };
}

function readValues(formData: FormData): Record<string, string> {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    author: String(formData.get("author") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    isFeatured: formData.get("isFeatured") === "on" ? "on" : "",
    isHidden: formData.get("isHidden") === "on" ? "on" : "",
  };
}

async function readArticleInput(
  formData: FormData,
): Promise<{ input?: ArticleInput; error?: string }> {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Tiêu đề không được để trống." };

  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  if (!slug) return { error: "Không sinh được slug từ tiêu đề." };

  const excerpt = String(formData.get("excerpt") ?? "").trim();
  if (!excerpt) return { error: "Mô tả ngắn không được để trống." };

  const coverImage = String(formData.get("coverImage") ?? "").trim();
  if (!coverImage) return { error: "Ảnh cover không được để trống." };

  const categoryId = String(formData.get("categoryId") ?? "");
  if (!Types.ObjectId.isValid(categoryId)) {
    return { error: "Vui lòng chọn danh mục." };
  }

  const rawContent = String(formData.get("content") ?? "");
  if (!isContentWithinLimit(rawContent)) {
    return { error: `Nội dung vượt quá ${MAX_CONTENT_LABEL}.` };
  }

  // Sanitise before the empty check: a body of nothing but disallowed tags
  // must be rejected, not stored as an empty article.
  const content = sanitizeArticleContent(rawContent);
  if (isContentEmpty(content)) return { error: "Nội dung bài viết trống." };

  const { links, error: linkError } = readLinks(formData);
  if (linkError) return { error: linkError };

  await connectToDatabase();
  const category = await CategoryModel.findById(categoryId).select("_id").lean();
  if (!category) return { error: "Danh mục không còn tồn tại." };

  return {
    input: {
      title,
      slug,
      excerpt,
      coverImage,
      content,
      category: category._id,
      author: String(formData.get("author") ?? "").trim() || DEFAULT_ARTICLE_AUTHOR,
      isFeatured: formData.get("isFeatured") === "on",
      isHidden: formData.get("isHidden") === "on",
      links,
    },
  };
}

export async function createArticleAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const values = readValues(formData);
  // Assigned inside the `try` and read after it: every path out of `catch`
  // returns, so reaching the revalidate means the write went through.
  let input: ArticleInput | undefined;
  let createdSlug: string;

  try {
    const parsed = await readArticleInput(formData);
    if (!parsed.input) return { error: parsed.error, values };
    input = parsed.input;

    const created = await ArticleModel.create(input);
    createdSlug = created.slug;
  } catch (caught) {
    if (isDuplicateKeyError(caught)) {
      return { error: `Slug "${input?.slug}" đã được dùng cho bài khác.`, values };
    }
    return toWriteFailure("create article", caught, values);
  }

  revalidateArticleConsumers([createdSlug]);

  // Outside any try/catch on purpose: `redirect` signals by throwing.
  redirect("/admin/articles");
}

export async function updateArticleAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const values = readValues(formData);
  const id = String(formData.get("id") ?? "");
  if (!Types.ObjectId.isValid(id)) return { error: "Bài viết không hợp lệ.", values };

  // Assigned inside the `try` and read after it: every path out of `catch`
  // returns, so reaching the revalidate means the write went through.
  let input: ArticleInput | undefined;
  let previousSlug: string;

  try {
    const parsed = await readArticleInput(formData);
    if (!parsed.input) return { error: parsed.error, values };
    input = parsed.input;

    const previous = await ArticleModel.findById(id).select("slug").lean();
    if (!previous) return { error: "Bài viết không còn tồn tại.", values };
    previousSlug = previous.slug;

    await ArticleModel.findByIdAndUpdate(id, { $set: input });
  } catch (caught) {
    if (isDuplicateKeyError(caught)) {
      return { error: `Slug "${input?.slug}" đã được dùng cho bài khác.`, values };
    }
    return toWriteFailure("update article", caught, values);
  }

  revalidateArticleConsumers([previousSlug, input.slug]);

  // Echo back what was stored, not what was typed: the slug may have been
  // generated from the title and the author may have fallen back to the
  // default, and the form should show the record as it now is.
  return {
    success: "Đã lưu bài viết.",
    values: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      coverImage: input.coverImage,
      author: input.author,
      categoryId: input.category.toString(),
      isFeatured: input.isFeatured ? "on" : "",
      isHidden: input.isHidden ? "on" : "",
    },
  };
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!Types.ObjectId.isValid(id)) return;

  await connectToDatabase();
  const deleted = await ArticleModel.findByIdAndDelete(id).select("slug").lean();

  revalidateArticleConsumers(deleted ? [deleted.slug] : []);
}

/** Featured toggle straight from the list, without opening the editor. */
export async function toggleArticleFeaturedAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!Types.ObjectId.isValid(id)) return;

  await connectToDatabase();
  const article = await ArticleModel.findById(id).select("slug isFeatured");
  if (!article) return;

  article.isFeatured = !article.isFeatured;
  await article.save();

  revalidateArticleConsumers([article.slug]);
}
