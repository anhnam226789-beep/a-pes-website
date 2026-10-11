import "server-only";

import type { FlattenMaps, Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { UdidStepModel, type UdidStepDocument } from "@/lib/db/models/udid-step";
import type { UdidStep } from "@/types/udid-step";

type LeanUdidStep = FlattenMaps<UdidStepDocument> & { _id: Types.ObjectId };

function toUdidStep(doc: LeanUdidStep): UdidStep {
  return {
    id: doc._id.toString(),
    order: doc.order,
    description: doc.description,
    image: doc.image,
  };
}

/** Steps of the "lấy UDID" tutorial, in display order. */
export async function getUdidSteps(): Promise<UdidStep[]> {
  await connectToDatabase();
  const docs = await UdidStepModel.find().sort({ order: 1 }).lean();
  return docs.map(toUdidStep);
}
