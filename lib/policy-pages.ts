/**
 * The four policy pages linked from the footer.
 *
 * They are ordinary articles — edited in `/admin/articles` like any other —
 * but carry `isHidden: true`, so they never appear in the home grid, the
 * listing, related articles or the header search.
 *
 * Slug and label live here rather than being read from the database so the
 * footer, which renders on every page, needs no query. Keep the slugs in sync
 * with `scripts/policy-seed-data.ts`; changing one here does not rename the
 * article that is already stored.
 */
export interface PolicyPage {
  slug: string;
  label: string;
}

export const POLICY_PAGES: PolicyPage[] = [
  { slug: "dieu-khoan-su-dung", label: "Điều khoản sử dụng" },
  { slug: "chinh-sach-bao-mat", label: "Chính sách bảo mật" },
  {
    slug: "mien-tru-trach-nhiem-link-ngoai",
    label: "Miễn trừ trách nhiệm link ngoài",
  },
  { slug: "bao-cao-ban-quyen-dmca", label: "Báo cáo bản quyền (DMCA)" },
];

/** Category the seeded policy pages belong to. Inactive, so it never shows up as a filter pill. */
export const POLICY_CATEGORY = {
  name: "Chính sách",
  label: "Chính sách",
  slug: "chinh-sach",
} as const;
