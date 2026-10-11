"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/lib/actions/auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password";
import { EMPTY_FORM_STATE } from "@/types/form-state";
import { FormMessage } from "@/components/admin/form-message";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
} from "@/components/admin/styles";

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(
    changePasswordAction,
    EMPTY_FORM_STATE,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className={ADMIN_LABEL_CLASS}>
          Mật khẩu hiện tại
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className={ADMIN_INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="newPassword" className={ADMIN_LABEL_CLASS}>
          Mật khẩu mới
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          className={ADMIN_INPUT_CLASS}
        />
        <p className="mt-1 text-[11px] text-txt-secondary">
          Tối thiểu {MIN_PASSWORD_LENGTH} ký tự.
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className={ADMIN_LABEL_CLASS}>
          Xác nhận mật khẩu mới
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          className={ADMIN_INPUT_CLASS}
        />
      </div>

      <FormMessage state={state} />

      <SubmitButton>
        <i className="fa-solid fa-key text-xs"></i>
        <span>Đổi mật khẩu</span>
      </SubmitButton>
    </form>
  );
}
