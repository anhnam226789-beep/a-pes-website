import type { FormState } from "@/types/form-state";

/** Inline feedback for a Server Action result. Renders nothing when idle. */
export function FormMessage({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p className="flex items-center gap-2 text-xs text-red-400" role="alert">
        <i className="fa-solid fa-circle-exclamation"></i>
        <span>{state.error}</span>
      </p>
    );
  }

  if (state.success) {
    return (
      <p className="flex items-center gap-2 text-xs text-neon-primary" role="status">
        <i className="fa-solid fa-circle-check"></i>
        <span>{state.success}</span>
      </p>
    );
  }

  return null;
}
