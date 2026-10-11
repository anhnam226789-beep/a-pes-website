/**
 * Single source of truth for the studio's public contact channels.
 *
 * Kept in one module because the same number appears in the Zalo modal, the
 * clipboard copy and the toast fallback — three places that must never drift
 * apart. The footer social buttons read from here too.
 */
export const CONTACT = {
  phone: {
    /** Grouped for reading; the original page used dot separators. */
    display: "0974.983.160",
    /** Digits only — what gets copied and what `tel:` / zalo.me expect. */
    raw: "0974983160",
  },
  /** Deep link that opens a Zalo chat with the number above. */
  zaloUrl: "https://zalo.me/0974983160",
  telegram: {
    handle: "@apes_studio",
    url: "https://t.me/apes_studio",
  },
  facebookUrl: "https://www.facebook.com/share/1GVBN6ca9b/?mibextid=wwXIfr",
} as const;
