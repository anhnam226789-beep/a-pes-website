import type { CertPlan } from "@/types/cert-plan";

/**
 * Feature bullets follow a shared icon vocabulary so the four plans read as one
 * comparison table:
 * - iOS support .......... fa-mobile-screen-button
 * - Blacklist / unban .... fa-unlock-keyhole (fa-hourglass-half when it means waiting)
 * - Warranty ............. fa-shield-halved
 * - JIT .................. fa-laptop-code
 * - Certificate file ..... fa-certificate
 * - Hide iCloud .......... fa-eye-slash
 * - App cloning .......... fa-clone
 * - Not included ......... fa-circle-xmark
 *
 * Tones: neon = included, amber = caveat or premium perk, red = not supported.
 */
const TONE = {
  included: "text-neon-primary",
  caveat: "text-amber-400",
  excluded: "text-red-400",
} as const;

/** iOS / iPadOS certificate packages shown in the "Mua Cert" section. */
export const CERT_PLANS: CertPlan[] = [
   // {
   //    id: "nhan-pham",
   //    icon: "fa-solid fa-dice",
   //    iconToneClassName: "text-neon-primary",
   //    title: "Gói Tiết Kiệm",
   //    subtitle: "Cần chờ Apple duyệt 3 - 4 ngày",
   //    price: "55.000đ",
   //    period: " / 01 thiết bị",
   //    zaloPackage: "iPhone/iPad Nhân Phẩm",
   //    features: [
   //       {
   //          icon: "fa-solid fa-mobile-screen-button",
   //          iconClassName: TONE.included,
   //          text: "Chỉ hỗ trợ iOS 16.0+",
   //       },
   //       {
   //          icon: "fa-solid fa-circle-xmark",
   //          iconClassName: TONE.excluded,
   //          text: "Không bảo hành",
   //          className: "text-red-400",
   //       },
   //       {
   //          icon: "fa-solid fa-hourglass-half",
   //          iconClassName: TONE.caveat,
   //          text: "Chờ 18-35 ngày nếu dính Blacklist",
   //          className: "text-amber-400/90",
   //       },

   //       {
   //          icon: "fa-solid fa-certificate",
   //          iconClassName: TONE.included,
   //          text: "File Chứng Chỉ + Link Cài App",
   //       },
   //       {
   //          icon: "fa-solid fa-circle-xmark",
   //          iconClassName: TONE.excluded,
   //          text: "Không hỗ trợ JIT",
   //          className: "text-txt-secondary/50",
   //       },
   //       {
   //          icon: "fa-solid fa-eye-slash",
   //          iconClassName: TONE.included,
   //          text: "Hỗ trợ Ẩn iCloud & Bypass",
   //       },

   //       {
   //          icon: "fa-solid fa-clone",
   //          iconClassName: TONE.included,
   //          text: "Nhân bản App không giới hạn",
   //       },
   //    ],
   // },
   {
      id: "lay-ngay",
      icon: "fa-solid fa-bolt",
      iconToneClassName: "text-neon-primary",
      title: "Gói Lấy Ngay",
      subtitle: "Sử dụng lập tức, hạn 12 tháng",
      price: "125.000đ",
      period: " / 12 tháng",
      zaloPackage: "iPhone/iPad Lấy Ngay",
      features: [
         {
            icon: "fa-solid fa-mobile-screen-button",
            iconClassName: TONE.included,
            text: "Chỉ hỗ trợ iOS 16.0+",
         },
         {
            icon: "fa-solid fa-circle-xmark",
            iconClassName: TONE.excluded,
            text: "Không bảo hành",
            className: "text-red-400",
         },
         {
            icon: "fa-solid fa-unlock-keyhole",
            iconClassName: TONE.included,
            text: "Có hỗ trợ Unban Blacklist",
         },

         {
            icon: "fa-solid fa-certificate",
            iconClassName: TONE.included,
            text: "File Chứng Chỉ + Link Cài App",
         },
         {
            icon: "fa-solid fa-circle-xmark",
            iconClassName: TONE.excluded,
            text: "Không hỗ trợ JIT",
            className: "text-txt-secondary/50",
         },
         {
            icon: "fa-solid fa-eye-slash",
            iconClassName: TONE.included,
            text: "Hỗ trợ Ẩn iCloud & Bypass",
         },

         {
            icon: "fa-solid fa-clone",
            iconClassName: TONE.included,
            text: "Nhân bản App không giới hạn",
         },
      ],
   },
   {
      id: "vip-40d",
      icon: "fa-solid fa-shield-halved",
      iconToneClassName: "text-neon-primary",
      title: "VIP Lấy Ngay 40D",
      subtitle: "Full tính năng, hỗ trợ mọi iOS",
      price: "175.000đ",
      period: " / 12 tháng",
      zaloPackage: "Lấy Ngay BH 40 Ngày",
      highlighted: true,
      badge: "BẢO HÀNH 40 NGÀY",
      features: [
         {
            icon: "fa-solid fa-mobile-screen-button",
            iconClassName: TONE.included,
            text: "Hỗ trợ MỌI phiên bản iOS",
         },
         {
            icon: "fa-solid fa-shield-halved",
            iconClassName: TONE.included,
            text: "Bảo hành 40 ngày 1 đổi 1",
         },
         {
            icon: "fa-solid fa-unlock-keyhole",
            iconClassName: TONE.included,
            text: "Unban Xoá bỏ Blacklist",
         },
         {
            icon: "fa-solid fa-certificate",
            iconClassName: TONE.included,
            text: "File Chứng Chỉ + Link Cài App",
         },

         {
            icon: "fa-solid fa-laptop-code",
            iconClassName: TONE.included,
            text: "Hỗ trợ JIT (Yêu cầu PC/Mac)",
         },
         {
            icon: "fa-solid fa-eye-slash",
            iconClassName: TONE.included,
            text: "Hỗ trợ Ẩn iCloud & Bypass",
         },
         {
            icon: "fa-solid fa-clone",
            iconClassName: TONE.included,
            text: "Nhân bản App không giới hạn",
         },
      ],
   },
   {
      id: "vip-300d",
      icon: "fa-solid fa-crown",
      iconToneClassName: "text-yellow-400",
      title: "VIP Premium 300D",
      subtitle: "Bảo hành 300 ngày siêu an tâm",
      price: "255.000đ",
      period: " / 12 tháng",
      zaloPackage: "Premium BH 300 Ngày",
      features: [
         {
            icon: "fa-solid fa-mobile-screen-button",
            iconClassName: TONE.included,
            text: "Hỗ trợ MỌI phiên bản iOS",
         },
         {
            icon: "fa-solid fa-shield-halved",
            iconClassName: TONE.caveat,
            text: "Bảo hành 300 ngày siêu dài",
            className: "text-amber-400/90",
         },

         {
            icon: "fa-solid fa-unlock-keyhole",
            iconClassName: TONE.included,
            text: "Unban Xoá bỏ Blacklist",
         },
         {
            icon: "fa-solid fa-certificate",
            iconClassName: TONE.included,
            text: "File Chứng Chỉ + Link Cài App",
         },
         {
            icon: "fa-solid fa-laptop-code",
            iconClassName: TONE.included,
            text: "Hỗ trợ JIT (Yêu cầu PC/Mac)",
         },
         {
            icon: "fa-solid fa-eye-slash",
            iconClassName: TONE.included,
            text: "Hỗ trợ Ẩn iCloud & Bypass",
         },
         {
            icon: "fa-solid fa-clone",
            iconClassName: TONE.included,
            text: "Nhân bản App không giới hạn",
         },
      ],
   },
];
