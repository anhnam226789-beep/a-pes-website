import { Schema, model, models, type Model } from "mongoose";

export interface CategoryDocument {
  /** Value stored on an article and matched by the listing filter. */
  name: string;
  /** Text rendered on the filter pill (may differ from `name`). */
  label: string;
  /** URL-safe identifier, reserved for future category routes. */
  slug: string;
  /** Sort position, 1-based and contiguous after every admin mutation. */
  order: number;
  /** Inactive categories stay in the DB but disappear from the filter bar. */
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, collection: "categories" },
);

export const CategoryModel: Model<CategoryDocument> =
  (models.Category as Model<CategoryDocument>) ??
  model<CategoryDocument>("Category", categorySchema);
