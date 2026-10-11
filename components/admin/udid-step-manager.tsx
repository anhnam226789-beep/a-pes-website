"use client";

import { useActionState } from "react";
import {
  createUdidStepAction,
  deleteUdidStepAction,
  moveUdidStepAction,
  updateUdidStepAction,
} from "@/lib/actions/udid-steps";
import { EMPTY_FORM_STATE } from "@/types/form-state";
import type { UdidStep } from "@/types/udid-step";
import { FormMessage } from "@/components/admin/form-message";
import { keepFormValues } from "@/components/admin/form-reset";
import { ImageField } from "@/components/admin/image-field";
import { RowActions } from "@/components/admin/row-actions";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  ADMIN_CARD_CLASS,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_SECONDARY_BUTTON_CLASS,
} from "@/components/admin/styles";

const UPLOAD_FOLDER = "udid-steps";

export function UdidStepManager({
  steps,
  uploadEnabled,
}: {
  steps: UdidStep[];
  /** Whether the server has R2 credentials; forwarded to every ImageField. */
  uploadEnabled: boolean;
}) {
  return (
    <div className="space-y-6">
      <CreateUdidStepForm uploadEnabled={uploadEnabled} />

      {steps.length === 0 ? (
        <p className={`${ADMIN_CARD_CLASS} p-6 text-sm text-txt-secondary text-center`}>
          Chưa có bước nào. Thêm bước đầu tiên ở khung phía trên.
        </p>
      ) : (
        <ul className="space-y-3">
          {steps.map((step, index) => (
            <UdidStepRow
              key={step.id}
              step={step}
              isFirst={index === 0}
              isLast={index === steps.length - 1}
              uploadEnabled={uploadEnabled}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function CreateUdidStepForm({ uploadEnabled }: { uploadEnabled: boolean }) {
  const [state, formAction] = useActionState(
    createUdidStepAction,
    EMPTY_FORM_STATE,
  );

  return (
    <section className={`${ADMIN_CARD_CLASS} p-5 space-y-4`}>
      <h2 className="text-sm font-bold text-txt-primary flex items-center gap-2">
        <i className="fa-solid fa-plus text-neon-primary text-xs"></i>
        Thêm bước hướng dẫn
      </h2>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="new-description" className={ADMIN_LABEL_CLASS}>
            Mô tả
          </label>
          <textarea
            id="new-description"
            name="description"
            required
            rows={3}
            placeholder="Nhấn vào nút Lấy UDID, sẽ có một cửa sổ hiện ra"
            defaultValue={state.values?.description ?? ""}
            className={`${ADMIN_INPUT_CLASS} resize-y`}
          />
        </div>

        <ImageField
          id="new-image"
          folder={UPLOAD_FOLDER}
          required
          uploadEnabled={uploadEnabled}
          defaultValue={state.values?.image ?? ""}
          previewAlt="Xem trước ảnh của bước sắp thêm"
        />

        <div className="flex justify-end">
          <SubmitButton>
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Thêm bước</span>
          </SubmitButton>
        </div>

        <FormMessage state={state} />
      </form>
    </section>
  );
}

function UdidStepRow({
  step,
  isFirst,
  isLast,
  uploadEnabled,
}: {
  step: UdidStep;
  isFirst: boolean;
  isLast: boolean;
  uploadEnabled: boolean;
}) {
  const [state, formAction] = useActionState(
    updateUdidStepAction,
    EMPTY_FORM_STATE,
  );

  return (
    <li className={`${ADMIN_CARD_CLASS} p-4 space-y-4`}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2.5 text-sm font-bold text-txt-primary">
          <span className="w-8 h-8 rounded-btn bg-neon-primary text-black flex items-center justify-center text-xs font-extrabold">
            {step.order}
          </span>
          Bước {step.order}
        </span>

        <RowActions
          id={step.id}
          isFirst={isFirst}
          isLast={isLast}
          moveAction={moveUdidStepAction}
          deleteAction={deleteUdidStepAction}
          deleteTitle="Xoá bước"
          deleteConfirmMessage={`Xoá bước ${step.order}?`}
        />
      </div>

      {/* `onReset` keeps the row as edited once the action settles — without
          it a successful save restored the fields to the values the page was
          loaded with. See `keepFormValues`. */}
      <form action={formAction} onReset={keepFormValues} className="space-y-4">
        <input type="hidden" name="id" value={step.id} />

        <div className="space-y-4">
          <div>
            <label
              htmlFor={`description-${step.id}`}
              className={ADMIN_LABEL_CLASS}
            >
              Mô tả
            </label>
            <textarea
              id={`description-${step.id}`}
              name="description"
              required
              rows={3}
              defaultValue={state.values?.description ?? step.description}
              className={`${ADMIN_INPUT_CLASS} resize-y`}
            />
          </div>

          <ImageField
            id={`image-${step.id}`}
            folder={UPLOAD_FOLDER}
            required
            uploadEnabled={uploadEnabled}
            defaultValue={state.values?.image ?? step.image}
            previewAlt={`Ảnh hiện tại của bước ${step.order}`}
          />
        </div>

        <div className="flex justify-end">
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
