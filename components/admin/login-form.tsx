"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { EMPTY_FORM_STATE } from "@/types/form-state";
import { FormMessage } from "@/components/admin/form-message";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_PRIMARY_BUTTON_CLASS,
} from "@/components/admin/styles";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, EMPTY_FORM_STATE);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className={ADMIN_LABEL_CLASS}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="admin@a-pes.studio"
          defaultValue={state.values?.email ?? ""}
          className={ADMIN_INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="password" className={ADMIN_LABEL_CLASS}>
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={ADMIN_INPUT_CLASS}
        />
      </div>

      <FormMessage state={state} />

      <SubmitButton className={`${ADMIN_PRIMARY_BUTTON_CLASS} w-full`}>
        <i className="fa-solid fa-right-to-bracket"></i>
        <span>Đăng nhập</span>
      </SubmitButton>
    </form>
  );
}
