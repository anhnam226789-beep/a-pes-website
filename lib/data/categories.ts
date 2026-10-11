import "server-only";

import { cache } from "react";
import type { FlattenMaps, Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { CategoryModel, type CategoryDocument } from "@/lib/db/models/category";
import type { Category } from "@/types/category";

type LeanCategory = FlattenMaps<CategoryDocument> & { _id: Types.ObjectId };

/** Mongoose documents are not serialisable across the RSC boundary. */
function toCategory(doc: LeanCategory): Category {
  return {
    id: doc._id.toString(),
    name: doc.name,
    label: doc.label,
    slug: doc.slug,
    order: doc.order,
    isActive: doc.isActive,
  };
}

/**
 * The whole collection in a single query, memoised for the current request.
 *
 * Categories are counted in dozens, so reading all of them costs the same one
 * round trip as reading a filtered subset — and `cache()` means a render that
 * needs the filter bar, the `slug → _id` lookup **and** the `_id → name` map
 * pays for one query instead of three. Every round trip saved here is latency
 * the visitor waits through, because the listing renders per request.
 */
const loadCategories = cache(async (): Promise<Category[]> => {
  await connectToDatabase();
  const docs = await CategoryModel.find().sort({ order: 1, name: 1 }).lean();
  return docs.map(toCategory);
});

/** Every category, active or not — used by the admin table. */
export async function getAllCategories(): Promise<Category[]> {
  return loadCategories();
}

/** Active categories only — used by the public filter bar. */
export async function getActiveCategories(): Promise<Category[]> {
  const categories = await loadCategories();
  return categories.filter((category) => category.isActive);
}

/** Indexes over the same request-cached rows, so neither costs a query. */
export interface CategoryLookup {
  /** `_id` → name, used to stamp a category name onto article rows. */
  nameById: Map<string, string>;
  /** `slug` → `_id`, used to turn `?danh-muc=…` into a query filter. */
  idBySlug: Map<string, string>;
}

export async function getCategoryLookup(): Promise<CategoryLookup> {
  const categories = await loadCategories();

  return {
    nameById: new Map(categories.map((category) => [category.id, category.name])),
    idBySlug: new Map(categories.map((category) => [category.slug, category.id])),
  };
}
