/** Shared return shape for Server Actions driven by `useActionState`. */
export interface FormState {
  error?: string;
  success?: string;
  /**
   * The values the fields should fall back to.
   *
   * React 19 resets an uncontrolled `<form action={...}>` once the action
   * settles, which would restore every field to the value the page was
   * rendered with. The CMS edit forms cancel that reset (see
   * `keepFormValues`), and these are the belt to that pair of braces: fed back
   * through `defaultValue`, they make a reset that does slip through land on
   * the submitted values after a failure and on the stored ones after a save,
   * never on the row as it looked when the page opened.
   *
   * Left undefined after a successful **insert**, so the create forms clear
   * themselves.
   */
  values?: Record<string, string>;
}

export const EMPTY_FORM_STATE: FormState = {};
