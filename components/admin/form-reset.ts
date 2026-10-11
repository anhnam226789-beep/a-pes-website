"use client";

import type { FormEvent } from "react";

/**
 * Cancels the form reset React 19 performs once a form action settles.
 *
 * `<form action={…}>` is reset by React as soon as its action resolves, which
 * restores every uncontrolled field to the `defaultValue` it was rendered
 * with. On an **edit** form that default is the row as it looked when the page
 * was opened, so a successful save visibly rolled the fields back to the old
 * values — and pressing save again then wrote those stale values straight over
 * the record that had just been stored.
 *
 * `form.reset()` fires a cancelable `reset` event, so preventing its default
 * keeps whatever is on screen: after a save that is exactly what was stored,
 * and after a validation error it is what the editor typed.
 *
 * The "create" forms deliberately do **not** use this — clearing themselves
 * after a successful insert is the wanted behaviour there.
 */
export function keepFormValues(event: FormEvent<HTMLFormElement>): void {
  event.preventDefault();
}
