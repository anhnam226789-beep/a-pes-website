import "server-only";

import type { FormState } from "@/types/form-state";

/**
 * Turns an unexpected write failure into an inline form message.
 *
 * Letting it propagate would replace the whole CMS screen with the error
 * boundary and take the unsaved draft with it: the editor loses the body they
 * just typed and has nothing left to retry from. Reporting it on the form
 * keeps both the message and the draft on screen.
 *
 * Only genuinely unexpected failures reach here — validation and duplicate
 * slugs are handled by the actions themselves, and `redirect()` throws from
 * outside every `try` so it is never swallowed.
 */
export function toWriteFailure(
  scope: string,
  caught: unknown,
  values: Record<string, string>,
): FormState {
  console.error(`[cms] ${scope} failed`, caught);

  return {
    error:
      "Lưu thất bại do lỗi máy chủ. Nội dung trên form vẫn được giữ nguyên — vui lòng thử lưu lại.",
    values,
  };
}
