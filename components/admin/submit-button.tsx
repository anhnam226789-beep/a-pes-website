"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";
import { ADMIN_PRIMARY_BUTTON_CLASS } from "@/components/admin/styles";

/**
 * Submit button that disables itself while its own `<form>` is pending.
 *
 * `useFormStatus` reads the status of the nearest parent form, which is why
 * this has to be a separate component from the form itself.
 */
export function SubmitButton({
  children,
  className = ADMIN_PRIMARY_BUTTON_CLASS,
  pendingIcon = "fa-solid fa-spinner fa-spin",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  pendingIcon?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={cn(className)} title={title}>
      {pending ? <i className={pendingIcon}></i> : children}
    </button>
  );
}
