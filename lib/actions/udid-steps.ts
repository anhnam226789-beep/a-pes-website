"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { requireAdmin } from "@/lib/auth/dal";
import { connectToDatabase } from "@/lib/db/connect";
import { UdidStepModel } from "@/lib/db/models/udid-step";
import { moveInOrder } from "@/lib/actions/reorder";
import { toWriteFailure } from "@/lib/actions/form-error";
import type { FormState } from "@/types/form-state";

/** Pages whose content depends on the `udid_steps` collection. */
function revalidateUdidConsumers(): void {
  revalidatePath("/huong-dan-lay-udid");
  // The admin table renders dynamically, but this drops the client-side
  // router cache so the list reflects the write immediately.
  revalidatePath("/admin/udid-steps");
}

interface UdidStepInput {
  description: string;
  image: string;
}

function readUdidStepInput(formData: FormData): UdidStepInput | null {
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  if (!description || !image) return null;

  return { description, image };
}

function readObjectId(formData: FormData): string | null {
  const id = String(formData.get("id") ?? "");
  return Types.ObjectId.isValid(id) ? id : null;
}

/** Raw field values echoed back so a rejected submit keeps what was typed. */
function readSubmittedValues(formData: FormData): Record<string, string> {
  return {
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? ""),
  };
}

/** Rewrites `order` to 1..N following the current sort, closing any gaps. */
async function normalizeOrder(): Promise<void> {
  const docs = await UdidStepModel.find().sort({ order: 1 }).select("_id").lean();

  await UdidStepModel.bulkWrite(
    docs.map((doc, index) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { order: index + 1 } },
      },
    })),
  );
}

export async function createUdidStepAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const values = readSubmittedValues(formData);
  const input = readUdidStepInput(formData);
  if (!input) return { error: "Mô tả và ảnh minh hoạ đều bắt buộc.", values };

  try {
    await connectToDatabase();

    const last = await UdidStepModel.findOne().sort({ order: -1 }).lean();
    await UdidStepModel.create({ ...input, order: (last?.order ?? 0) + 1 });
  } catch (error) {
    return toWriteFailure("create udid step", error, values);
  }

  revalidateUdidConsumers();
  return { success: "Đã thêm bước mới." };
}

export async function updateUdidStepAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const values = readSubmittedValues(formData);
  const id = readObjectId(formData);
  if (!id) return { error: "Bước hướng dẫn không hợp lệ.", values };

  const input = readUdidStepInput(formData);
  if (!input) return { error: "Mô tả và ảnh minh hoạ đều bắt buộc.", values };

  try {
    await connectToDatabase();

    const updated = await UdidStepModel.findByIdAndUpdate(id, { $set: input });
    if (!updated) return { error: "Bước hướng dẫn không còn tồn tại.", values };
  } catch (error) {
    return toWriteFailure("update udid step", error, values);
  }

  revalidateUdidConsumers();
  return {
    success: "Đã lưu thay đổi.",
    values: { description: input.description, image: input.image },
  };
}

export async function deleteUdidStepAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = readObjectId(formData);
  if (!id) return;

  await connectToDatabase();
  await UdidStepModel.findByIdAndDelete(id);
  // Keeps the "Bước N" badges contiguous after a deletion in the middle.
  await normalizeOrder();

  revalidateUdidConsumers();
}

export async function moveUdidStepAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = readObjectId(formData);
  const direction = formData.get("direction");
  if (!id || (direction !== "up" && direction !== "down")) return;

  await connectToDatabase();

  const docs = await UdidStepModel.find().sort({ order: 1 }).select("_id").lean();

  const reordered = moveInOrder(
    docs.map((doc) => doc._id.toString()),
    id,
    direction,
  );
  if (!reordered) return;

  await UdidStepModel.bulkWrite(
    reordered.map((docId, index) => ({
      updateOne: {
        filter: { _id: docId },
        update: { $set: { order: index + 1 } },
      },
    })),
  );

  revalidateUdidConsumers();
}
