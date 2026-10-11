/**
 * Shared class strings for the admin CMS.
 *
 * The admin reuses the site's design tokens (see `app/globals.css`) but has a
 * denser, form-first look, so the classes live here instead of being repeated
 * across every table and form.
 */

export const ADMIN_CARD_CLASS =
  "glass-card rounded-card border border-dark-border";

export const ADMIN_INPUT_CLASS =
  "w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-sm text-txt-primary placeholder:text-txt-secondary/60 focus:outline-hidden focus:border-neon-primary transition-colors";

export const ADMIN_LABEL_CLASS =
  "block text-[11px] font-semibold uppercase tracking-wider text-txt-secondary mb-1.5";

export const ADMIN_PRIMARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-btn bg-neon-primary text-black font-bold text-sm hover:bg-neon-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-neon-sm";

export const ADMIN_SECONDARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-btn bg-dark-bg border border-dark-border text-txt-primary font-semibold text-sm hover:border-neon-primary/50 hover:text-neon-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all";

export const ADMIN_DANGER_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 h-10 px-3 rounded-btn bg-dark-bg border border-red-500/30 text-red-400 font-semibold text-sm hover:bg-red-500/10 hover:border-red-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all";

/** Square icon-only button used by the reorder arrows. */
export const ADMIN_ICON_BUTTON_CLASS =
  "inline-flex items-center justify-center w-9 h-9 rounded-btn bg-dark-bg border border-dark-border text-txt-secondary hover:text-neon-primary hover:border-neon-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all";
