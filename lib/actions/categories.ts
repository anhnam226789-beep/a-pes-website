"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { requireAdmin } from "@/lib/auth/dal";
import { connectToDatabase } from "@/lib/db/connect";
import { CategoryModel } from "@/lib/db/models/category";
import { isDuplicateKeyError } from "@/lib/db/errors";
import { toWriteFailure } from "@/lib/actions/form-error";
import { moveInOrder } from "@/lib/actions/reorder";
import { slugify } from "@/lib/slug";
import type { FormState } from "@/types/form-state";

/** Pages whose content depends on the `categories` collection. */
function revalidateCategoryConsumers(): void {
  revalidatePath("/bai-viet");
  // Article cards carry the category **name**, so renaming one has to reach
  // every page that renders a card, not just the filter bar.
  revalidatePath("/");
  revalidatePath("/bai-viet/[slug]", "page");
  revalidatePath("/admin/articles");
  // The admin table renders dynamically, but this drops the client-side
  // router cache so the list reflects the write immediately.
  revalidatePath("/admin/categories");
}

interface CategoryInput {
  name: string;
  label: string;
  slug: string;
  isActive: boolean;
}

function readCategoryInput(formData: FormData): CategoryInput | null {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return null;

  const label = String(formData.get("label") ?? "").trim() || name;
  const slug = slugify(String(formData.get("slug") ?? "").trim() || name);
  if (!slug) return null;

  return { name, label, slug, isActive: formData.get("isActive") === "on" };
}

/** Raw field values echoed back so a rejected submit keeps what was typed. */
function readSubmittedValues(formData: FormData): Record<string, string> {
  return {
    name: String(formData.get("name") ?? ""),
    label: String(formData.get("label") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    isActive: formData.get("isActive") === "on" ? "on" : "",
  };
}

function readObjectId(formData: FormData): string | null {
  const id = String(formData.get("id") ?? "");
  return Types.ObjectId.isValid(id) ? id : null;
}

/** Rewrites `order` to 1..N following the current sort, closing any gaps. */
async function normalizeOrder(): Promise<void> {
  const docs = await CategoryModel.find()
    .sort({ order: 1, name: 1 })
    .select("_id")
    .lean();

  await CategoryModel.bulkWrite(
    docs.map((doc, index) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { order: index + 1 } },
      },
    })),
  );
}

export async function createCategoryAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const values = readSubmittedValues(formData);
  const input = readCategoryInput(formData);
  if (!input) return { error: "Tên danh mục không được để trống.", values };

  try {
    await connectToDatabase();

    const last = await CategoryModel.findOne().sort({ order: -1 }).lean();
    await CategoryModel.create({ ...input, order: (last?.order ?? 0) + 1 });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return {
        error: `Danh mục "${input.name}" hoặc slug đã tồn tại.`,
        values,
      };
    }
    return toWriteFailure("create category", error, values);
  }

  revalidateCategoryConsumers();
  return { success: `Đã thêm danh mục "${input.name}".` };
}

export async function updateCategoryAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const values = readSubmittedValues(formData);
  const id = readObjectId(formData);
  if (!id) return { error: "Danh mục không hợp lệ.", values };

  const input = readCategoryInput(formData);
  if (!input) return { error: "Tên danh mục không được để trống.", values };

  try {
    await connectToDatabase();

    const updated = await CategoryModel.findByIdAndUpdate(id, { $set: input });
    if (!updated) return { error: "Danh mục không còn tồn tại.", values };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return {
        error: `Danh mục "${input.name}" hoặc slug đã tồn tại.`,
        values,
      };
    }
    return toWriteFailure("update category", error, values);
  }

  revalidateCategoryConsumers();

  // The stored row, not the raw submission: `label` and `slug` are both filled
  // in from the name when left blank.
  return {
    success: "Đã lưu thay đổi.",
    values: {
      name: input.name,
      label: input.label,
      slug: input.slug,
      isActive: input.isActive ? "on" : "",
    },
  };
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = readObjectId(formData);
  if (!id) return;

  await connectToDatabase();
  await CategoryModel.findByIdAndDelete(id);
  await normalizeOrder();

  revalidateCategoryConsumers();
}

export async function moveCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = readObjectId(formData);
  const direction = formData.get("direction");
  if (!id || (direction !== "up" && direction !== "down")) return;

  await connectToDatabase();

  const docs = await CategoryModel.find()
    .sort({ order: 1, name: 1 })
    .select("_id")
    .lean();

  const reordered = moveInOrder(
    docs.map((doc) => doc._id.toString()),
    id,
    direction,
  );
  if (!reordered) return;

  await CategoryModel.bulkWrite(
    reordered.map((docId, index) => ({
      updateOne: {
        filter: { _id: docId },
        update: { $set: { order: index + 1 } },
      },
    })),
  );

  revalidateCategoryConsumers();
}
