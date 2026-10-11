"use client";

import { CONTACT } from "@/lib/contact";
import { useUi } from "@/components/providers/ui-provider";

export function ZaloModal() {
  const { isZaloModalOpen, zaloPackage, closeZaloModal, showToast } = useUi();

  if (!isZaloModalOpen) return null;

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.phone.raw);
      showToast(
        "Đã sao chép SĐT Zalo!",
        "Bạn có thể mở Zalo và dán số điện thoại.",
      );
    } catch {
      showToast(
        "Không thể sao chép tự động",
        `Vui lòng lưu số ${CONTACT.phone.display}.`,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — clicking it dismisses the modal */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xs"
        onClick={closeZaloModal}
        aria-hidden="true"
      ></div>

      <div className="relative glass-card rounded-[24px] max-w-sm w-full p-6 space-y-5 border border-neon-primary/40 animate-in fade-in zoom-in duration-200">
        <button
          type="button"
          onClick={closeZaloModal}
          className="absolute top-4 right-4 text-txt-secondary hover:text-txt-primary"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-neon-primary/20 border border-neon-primary flex items-center justify-center mx-auto text-neon-primary text-2xl">
            <i className="fa-solid fa-comment-dots"></i>
          </div>
          <h3 className="text-xl font-bold text-txt-primary">
            Tư Vấn Trực Tiếp Zalo
          </h3>
          <p className="text-xs text-txt-secondary">
            {zaloPackage
              ? `Đang đăng ký: Gói ${zaloPackage}`
              : "Hỗ trợ kích hoạt gói VIP & Giải đáp kĩ thuật"}
          </p>
        </div>

        <div className="p-4 rounded-btn bg-dark-bg border border-dark-border text-center space-y-1">
          <span className="text-[11px] text-txt-secondary uppercase tracking-wider">
            Số Điện Thoại Zalo Official
          </span>
          <a
            href={`tel:${CONTACT.phone.raw}`}
            className="block text-lg font-mono font-extrabold text-neon-primary tracking-wider hover:text-neon-accent transition-colors"
          >
            {CONTACT.phone.display}
          </a>
        </div>

        <div className="space-y-2">
          <a
            href={CONTACT.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeZaloModal}
            className="w-full py-3.5 rounded-btn bg-neon-primary text-black font-bold text-sm hover:bg-neon-accent transition-all shadow-neon flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-paper-plane"></i>
            <span>Mở Ứng Dụng Zalo Ngay</span>
          </a>
          <button
            type="button"
            onClick={handleCopyNumber}
            className="w-full py-3 rounded-btn bg-dark-bg border border-dark-border text-xs text-txt-primary hover:border-neon-primary/40 transition-all"
          >
            Sao chép số điện thoại
          </button>
        </div>
      </div>
    </div>
  );
}
