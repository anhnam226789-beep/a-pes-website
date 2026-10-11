import { Schema, model, models, type Model } from "mongoose";

export interface UdidStepDocument {
  /** Sort position, 1-based and contiguous after every admin mutation. */
  order: number;
  description: string;
  /** Illustration URL (external for now, R2 once the bucket is wired up). */
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const udidStepSchema = new Schema<UdidStepDocument>(
  {
    // Not unique: reordering swaps two rows and would trip a unique index
    // halfway through. `normalizeUdidStepOrder()` keeps the values contiguous.
    order: { type: Number, required: true, default: 0 },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
  },
  { timestamps: true, collection: "udid_steps" },
);

export const UdidStepModel: Model<UdidStepDocument> =
  (models.UdidStep as Model<UdidStepDocument>) ??
  model<UdidStepDocument>("UdidStep", udidStepSchema);
