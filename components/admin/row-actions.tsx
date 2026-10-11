"use client";

import {
  ADMIN_DANGER_BUTTON_CLASS,
  ADMIN_ICON_BUTTON_CLASS,
} from "@/components/admin/styles";

type RowAction = (formData: FormData) => Promise<void>;

/**
 * Reorder + delete controls for one row.
 *
 * Each button gets its own `<form>` rather than an override on the edit
 * form's submit button: a `formAction` pointing at a different Server Action
 * is silently ignored when the parent form is driven by `useActionState`.
 * These forms are siblings of the edit form — never nested inside it, which
 * HTML does not allow.
 */
export function RowActions({
  id,
  isFirst,
  isLast,
  moveAction,
  deleteAction,
  deleteConfirmMessage,
  deleteTitle,
}: {
  id: string;
  isFirst: boolean;
  isLast: boolean;
  moveAction: RowAction;
  deleteAction: RowAction;
  deleteConfirmMessage: string;
  deleteTitle: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <form action={moveAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <button
          type="submit"
          disabled={isFirst}
          className={ADMIN_ICON_BUTTON_CLASS}
          title="Đưa lên trên"
        >
          <i className="fa-solid fa-arrow-up text-xs"></i>
        </button>
      </form>

      <form action={moveAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <button
          type="submit"
          disabled={isLast}
          className={ADMIN_ICON_BUTTON_CLASS}
          title="Đưa xuống dưới"
        >
          <i className="fa-solid fa-arrow-down text-xs"></i>
        </button>
      </form>

      <form action={deleteAction}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          onClick={(event) => {
            if (!window.confirm(deleteConfirmMessage)) event.preventDefault();
          }}
          className={ADMIN_DANGER_BUTTON_CLASS}
          title={deleteTitle}
        >
          <i className="fa-solid fa-trash text-xs"></i>
        </button>
      </form>
    </div>
  );
}
