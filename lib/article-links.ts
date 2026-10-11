/**
 * The four fixed icons an article download link can use.
 *
 * Shared by the CMS picker and the public download section, so the icon a
 * row renders is decided in exactly one place. Adding a fifth entry is the
 * only change needed to offer a new icon.
 *
 * `variant` decides the button style on the public page: the platform links
 * are the primary call to action, the extras are secondary — which reproduces
 * the look of the original static page.
 */
export const ARTICLE_LINK_ICONS = [
  {
    value: "android",
    name: "Android",
    icon: "fa-brands fa-android",
    iconClassName: "",
    variant: "primary",
  },
  {
    value: "ios",
    name: "iOS",
    icon: "fa-brands fa-apple",
    iconClassName: "",
    variant: "primary",
  },
  {
    value: "hd",
    name: "Đồ hoạ HD",
    icon: "fa-solid fa-image",
    iconClassName: "text-emerald-400",
    variant: "secondary",
  },
  {
    value: "tool",
    name: "Công cụ / giải nén",
    icon: "fa-solid fa-screwdriver-wrench",
    iconClassName: "text-amber-400",
    variant: "secondary",
  },
] as const;

export type ArticleLinkIcon = (typeof ARTICLE_LINK_ICONS)[number]["value"];

export type ArticleLinkIconDefinition = (typeof ARTICLE_LINK_ICONS)[number];

export const ARTICLE_LINK_ICON_VALUES: readonly string[] =
  ARTICLE_LINK_ICONS.map((definition) => definition.value);

export function isArticleLinkIcon(value: unknown): value is ArticleLinkIcon {
  return typeof value === "string" && ARTICLE_LINK_ICON_VALUES.includes(value);
}

/** Falls back to the first icon so a stale value never renders a blank slot. */
export function getArticleLinkIcon(
  value: string,
): ArticleLinkIconDefinition {
  return (
    ARTICLE_LINK_ICONS.find((definition) => definition.value === value) ??
    ARTICLE_LINK_ICONS[0]
  );
}
