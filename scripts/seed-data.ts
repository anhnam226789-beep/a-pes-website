/**
 * Initial content for the CMS collections.
 *
 * These values are exactly what used to be hardcoded in `lib/articles.ts`
 * (`CATEGORY_FILTERS`) and `lib/udid.ts` (`UDID_STEPS`), so seeding a fresh
 * database reproduces the site as it looked before the backend existed.
 */

export interface CategorySeed {
  name: string;
  label: string;
  slug: string;
  order: number;
}

export interface UdidStepSeed {
  order: number;
  description: string;
  image: string;
}

export const CATEGORY_SEED: CategorySeed[] = [
  { name: "Game Mod", label: "Game Mod", slug: "game-mod", order: 1 },
  {
    name: "Premium Tools",
    label: "Premium Tools",
    slug: "premium-tools",
    order: 2,
  },
  {
    name: "App iOS/Android",
    label: "App Mobile",
    slug: "app-ios-android",
    order: 3,
  },
  { name: "Thủ Thuật", label: "Thủ Thuật", slug: "thu-thuat", order: 4 },
];

/**
 * NOTE: the images are temporary phone photos standing in for the real
 * screenshots. Once R2 is wired up, replace them from `/admin/udid-steps`
 * instead of editing this file — it only ever runs on a fresh database.
 */
export const UDID_STEP_SEED: UdidStepSeed[] = [
  {
    order: 1,
    description: "Nhấn vào nút Lấy UDID, sẽ có một cửa sổ hiện ra",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
  },
  {
    order: 2,
    description:
      "Nhấn vào nút cho phép, profile sẽ được tải về thiết bị của bạn trong phần cài đặt",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
  },
  {
    order: 3,
    description:
      "Mở cài đặt, nhấn vào hồ sơ đã tải sẽ được tự động chuyển hướng ra hồ sơ",
    image:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80",
  },
  {
    order: 4,
    description: "Nhấn vào cài đặt, nhập mật khẩu của bạn để cài đặt hồ sơ",
    image:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
  },
  {
    order: 5,
    description: "Nếu hiện ra màn hình cảnh báo, nhấn cài đặt",
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80",
  },
  {
    order: 6,
    description: "Nhấn cài đặt lần cuối",
    image:
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=600&q=80",
  },
  {
    order: 7,
    description:
      "Sau khi cài đặt sẽ tự động chuyển hướng đến trang web đã tự động nhập UDID cho bạn rồi, sau đó chỉ cần chọn gói mua và đặt tên cho thiết bị của bạn là xong, chúc bạn thành công!",
    image:
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=600&q=80",
  },
];
