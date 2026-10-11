"use client";

import { useActionState } from "react";
import {
  createCategoryAction,
  deleteCategoryAction,
  moveCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/categories";
import { EMPTY_FORM_STATE } from "@/types/form-state";
import type { Category } from "@/types/category";
import { FormMessage } from "@/components/admin/form-message";
import { keepFormValues } from "@/components/admin/form-reset";
import { RowActions } from "@/components/admin/row-actions";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  ADMIN_CARD_CLASS,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_SECONDARY_BUTTON_CLASS,
} from "@/components/admin/styles";

export function CategoryManager({ categories }: { categories: Category[] }) {
  return (
    <div className="space-y-6">
      <CreateCategoryForm />

      {categories.length === 0 ? (
        <p className={`${ADMIN_CARD_CLASS} p-6 text-sm text-txt-secondary text-center`}>
          Chưa có danh mục nào. Thêm danh mục đầu tiên ở khung phía trên.
        </p>
      ) : (
        <ul className="space-y-3">
          {categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              isFirst={index === 0}
              isLast={index === categories.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function CreateCategoryForm() {
  const [state, formAction] = useActionState(
    createCategoryAction,
    EMPTY_FORM_STATE,
  );

  return (
    <section className={`${ADMIN_CARD_CLASS} p-5 space-y-4`}>
      <h2 className="text-sm font-bold text-txt-primary flex items-center gap-2">
        <i className="fa-solid fa-plus text-neon-primary text-xs"></i>
        Thêm danh mục
      </h2>

      <form action={formAction} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="new-name" className={ADMIN_LABEL_CLASS}>
              Tên danh mục
            </label>
            <input
              id="new-name"
              name="name"
              required
              placeholder="Game Mod"
              defaultValue={state.values?.name ?? ""}
              className={ADMIN_INPUT_CLASS}
            />
            <p className="mt-1 text-[11px] text-txt-secondary">
              Giá trị khớp với trường <code>category</code> của bài viết.
            </p>
          </div>

          <div>
            <label htmlFor="new-label" className={ADMIN_LABEL_CLASS}>
              Nhãn hiển thị
            </label>
            <input
              id="new-label"
              name="label"
              placeholder="Để trống sẽ lấy theo tên"
              defaultValue={state.values?.label ?? ""}
              className={ADMIN_INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="new-slug" className={ADMIN_LABEL_CLASS}>
              Slug
            </label>
            <input
              id="new-slug"
              name="slug"
              placeholder="Để trống sẽ tự sinh"
              defaultValue={state.values?.slug ?? ""}
              className={ADMIN_INPUT_CLASS}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <ActiveCheckbox
            id="new-isActive"
            defaultChecked={state.values ? state.values.isActive === "on" : true}
          />
          <SubmitButton>
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Thêm danh mục</span>
          </SubmitButton>
        </div>

        <FormMessage state={state} />
      </form>
    </section>
  );
}

function CategoryRow({
  category,
  isFirst,
  isLast,
}: {
  category: Category;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [state, formAction] = useActionState(
    updateCategoryAction,
    EMPTY_FORM_STATE,
  );

  return (
    <li className={`${ADMIN_CARD_CLASS} p-4 space-y-4`}>
      <div className="flex items-center justify-between gap-3">
        <span className="w-8 h-8 shrink-0 rounded-btn bg-dark-bg border border-dark-border text-txt-secondary flex items-center justify-center text-xs font-bold">
          {category.order}
        </span>

        <RowActions
          id={category.id}
          isFirst={isFirst}
          isLast={isLast}
          moveAction={moveCategoryAction}
          deleteAction={deleteCategoryAction}
          deleteTitle="Xoá danh mục"
          deleteConfirmMessage={`Xoá danh mục "${category.name}"? Bài viết đang thuộc danh mục này sẽ không còn bộ lọc tương ứng.`}
        />
      </div>

      {/* `onReset` keeps the row as edited once the action settles — without
          it a successful save restored the fields to the values the page was
          loaded with. See `keepFormValues`. */}
      <form action={formAction} onReset={keepFormValues} className="space-y-4">
        <input type="hidden" name="id" value={category.id} />

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor={`name-${category.id}`} className={ADMIN_LABEL_CLASS}>
              Tên danh mục
            </label>
            <input
              id={`name-${category.id}`}
              name="name"
              required
              defaultValue={state.values?.name ?? category.name}
              className={ADMIN_INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor={`label-${category.id}`} className={ADMIN_LABEL_CLASS}>
              Nhãn hiển thị
            </label>
            <input
              id={`label-${category.id}`}
              name="label"
              defaultValue={state.values?.label ?? category.label}
              className={ADMIN_INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor={`slug-${category.id}`} className={ADMIN_LABEL_CLASS}>
              Slug
            </label>
            <input
              id={`slug-${category.id}`}
              name="slug"
              defaultValue={state.values?.slug ?? category.slug}
              className={ADMIN_INPUT_CLASS}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <ActiveCheckbox
            id={`isActive-${category.id}`}
            defaultChecked={
              state.values
                ? state.values.isActive === "on"
                : category.isActive
            }
          />
          <SubmitButton className={ADMIN_SECONDARY_BUTTON_CLASS}>
            <i className="fa-solid fa-floppy-disk text-xs"></i>
            <span>Lưu</span>
          </SubmitButton>
        </div>

        <FormMessage state={state} />
      </form>
    </li>
  );
}

function ActiveCheckbox({
  id,
  defaultChecked,
}: {
  id: string;
  defaultChecked?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-xs text-txt-secondary">
      <input
        id={id}
        name="isActive"
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-4 h-4 accent-[#36d96b]"
      />
      <span>Hiển thị trên bộ lọc trang /bai-viet</span>
    </label>
  );
}
