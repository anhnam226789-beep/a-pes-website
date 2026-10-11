"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import {
  createArticleAction,
  updateArticleAction,
} from "@/lib/actions/articles";
import { slugify } from "@/lib/slug";
import { EMPTY_FORM_STATE } from "@/types/form-state";
import type { AdminArticle } from "@/types/article";
import type { Category } from "@/types/category";
import { ArticleLinkRows } from "@/components/admin/article-link-rows";
import { FormMessage } from "@/components/admin/form-message";
import { keepFormValues } from "@/components/admin/form-reset";
import { ImageField } from "@/components/admin/image-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  ADMIN_CARD_CLASS,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_SECONDARY_BUTTON_CLASS,
} from "@/components/admin/styles";

export function ArticleForm({
  article,
  categories,
  uploadEnabled,
}: {
  /** Undefined when creating. */
  article?: AdminArticle;
  categories: Category[];
  uploadEnabled: boolean;
}) {
  const isEditing = article !== undefined;

  const [state, formAction] = useActionState(
    isEditing ? updateArticleAction : createArticleAction,
    EMPTY_FORM_STATE,
  );

  const slugInputRef = useRef<HTMLInputElement>(null);
  // Once the slug has been typed by hand, stop overwriting it from the title.
  const [isSlugTouched, setIsSlugTouched] = useState(isEditing);

  function handleTitleChange(title: string): void {
    if (isSlugTouched || !slugInputRef.current) return;
    slugInputRef.current.value = slugify(title);
  }

  return (
    // `onReset` keeps every field as the editor left it once the action
    // settles — see `keepFormValues`. Without it a successful save restored
    // the fields to the article as it was when the page loaded.
    <form action={formAction} onReset={keepFormValues} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={article.id} />}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] items-start">
        <div className="space-y-6 min-w-0">
          <section className={`${ADMIN_CARD_CLASS} p-5 space-y-4`}>
            <div>
              <label htmlFor="title" className={ADMIN_LABEL_CLASS}>
                Tiêu đề
              </label>
              <input
                id="title"
                name="title"
                required
                defaultValue={state.values?.title ?? article?.title ?? ""}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="eFootball 2026 Mod VIP Menu…"
                className={ADMIN_INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="slug" className={ADMIN_LABEL_CLASS}>
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                ref={slugInputRef}
                defaultValue={state.values?.slug ?? article?.slug ?? ""}
                onChange={() => setIsSlugTouched(true)}
                placeholder="Tự sinh từ tiêu đề"
                className={ADMIN_INPUT_CLASS}
              />
              <p className="mt-1 text-[11px] text-txt-secondary">
                Đường dẫn bài viết: <code>/bai-viet/&lt;slug&gt;</code>. Tự sinh
                theo tiêu đề cho tới khi bạn sửa tay.
              </p>
            </div>

            <div>
              <label htmlFor="excerpt" className={ADMIN_LABEL_CLASS}>
                Mô tả ngắn
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                required
                rows={3}
                defaultValue={state.values?.excerpt ?? article?.excerpt ?? ""}
                placeholder="Hiển thị trên thẻ bài viết và thẻ mô tả SEO."
                className={`${ADMIN_INPUT_CLASS} resize-y`}
              />
            </div>
          </section>

          <section className={`${ADMIN_CARD_CLASS} p-5`}>
            <RichTextEditor
              defaultValue={article?.content ?? ""}
              uploadEnabled={uploadEnabled}
            />
          </section>

          <section className={`${ADMIN_CARD_CLASS} p-5`}>
            <ArticleLinkRows defaultLinks={article?.links ?? []} />
          </section>
        </div>

        <div className="space-y-6 lg:sticky lg:top-20">
          <section className={`${ADMIN_CARD_CLASS} p-5 space-y-4`}>
            <ImageField
              id="coverImage"
              name="coverImage"
              folder="articles"
              required
              uploadEnabled={uploadEnabled}
              label="Ảnh cover"
              defaultValue={state.values?.coverImage ?? article?.coverImage ?? ""}
              previewAlt="Xem trước ảnh cover"
            />

            <div>
              <label htmlFor="categoryId" className={ADMIN_LABEL_CLASS}>
                Danh mục
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue={
                  state.values?.categoryId ?? article?.categoryId ?? ""
                }
                className={ADMIN_INPUT_CLASS}
              >
                <option value="" disabled>
                  — Chọn danh mục —
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                    {category.isActive ? "" : " (đang ẩn)"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="author" className={ADMIN_LABEL_CLASS}>
                Người đăng
              </label>
              <input
                id="author"
                name="author"
                defaultValue={state.values?.author ?? article?.author ?? ""}
                placeholder="A-Pes Studio"
                className={ADMIN_INPUT_CLASS}
              />
            </div>

            <label
              htmlFor="isFeatured"
              className="flex items-start gap-2 text-xs text-txt-secondary"
            >
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                defaultChecked={
                  state.values
                    ? state.values.isFeatured === "on"
                    : (article?.isFeatured ?? false)
                }
                className="w-4 h-4 mt-0.5 accent-[#36d96b]"
              />
              <span>
                Đánh dấu nổi bật — hiển thị trong lưới &quot;Bài Viết Nổi
                Bật&quot; ở trang chủ.
              </span>
            </label>

            <label
              htmlFor="isHidden"
              className="flex items-start gap-2 text-xs text-txt-secondary"
            >
              <input
                id="isHidden"
                name="isHidden"
                type="checkbox"
                defaultChecked={
                  state.values
                    ? state.values.isHidden === "on"
                    : (article?.isHidden ?? false)
                }
                className="w-4 h-4 mt-0.5 accent-[#36d96b]"
              />
              <span>
                Ẩn khỏi danh sách — bài vẫn mở được bằng đường dẫn riêng nhưng
                không xuất hiện ở trang chủ, trang <code>/bai-viet</code>, mục
                bài liên quan và ô tìm kiếm. Dùng cho các trang chính sách.
              </span>
            </label>
          </section>

          <section className={`${ADMIN_CARD_CLASS} p-5 space-y-3`}>
            <FormMessage state={state} />

            <SubmitButton className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-btn bg-neon-primary text-black font-bold text-sm hover:bg-neon-accent disabled:opacity-50 transition-all shadow-neon-sm">
              <i className="fa-solid fa-floppy-disk text-xs"></i>
              <span>{isEditing ? "Lưu bài viết" : "Tạo bài viết"}</span>
            </SubmitButton>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/articles"
                className={`${ADMIN_SECONDARY_BUTTON_CLASS} grow`}
              >
                Quay lại danh sách
              </Link>
              {isEditing && (
                <Link
                  href={`/bai-viet/${article.slug}`}
                  target="_blank"
                  className={ADMIN_SECONDARY_BUTTON_CLASS}
                  title="Xem bài viết"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                </Link>
              )}
            </div>

            <p className="text-[11px] text-txt-secondary">
              Ngày đăng, số phút đọc và lượt xem là tự động — không cần nhập.
            </p>
          </section>
        </div>
      </div>
    </form>
  );
}
