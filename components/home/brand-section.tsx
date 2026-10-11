import { ZaloTriggerButton } from "@/components/ui/zalo-trigger-button";

const ECOSYSTEM_TAGS = [
  "⚽️ eFootball™ MOD",
  "🍏 IOS VIP Mods",
  "🤖 Android VIP Mods",
  "⚡️ Utilities Pro & iOS Cert",
];

export function BrandSection() {
  return (
    <section
      id="brand-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      <div className="glass-card rounded-[24px] p-6 sm:p-10 border border-neon-primary/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-neon-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-btn bg-neon-primary flex items-center justify-center text-black font-extrabold text-2xl">
                <i className="fa-solid fa-cubes"></i>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-txt-primary">
                  Hệ Sinh Thái A-Pes Studio
                </h3>
                <p className="text-xs text-neon-primary font-semibold">
                  CÔNG NGHỆ • GAMING • GIẢI TRÍ SỐ
                </p>
              </div>
            </div>

            <p className="text-sm text-txt-secondary leading-relaxed">
              A-Pes Studio tự hào là trạm dừng chân lý tưởng dành cho tín đồ
              công nghệ và cộng đồng đam mê eFootball™. Chúng tôi chuyên cung
              cấp các bản mod bóng đá đỉnh cao, ứng dụng di động tối ưu cùng kho
              tiện ích số cao cấp – đặc biệt là hệ thống chứng chỉ iOS uy tín.
              Với cam kết mang đến trải nghiệm mượt mà, 100% link tải an toàn và
              sự hỗ trợ tận tâm nhất, A-Pes Studio luôn đồng hành cùng bạn trên
              mọi hành trình khám phá thế giới số.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {ECOSYSTEM_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-dark-bg border border-dark-border text-xs text-txt-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-dark-bg/60 rounded-card border border-dark-border text-center space-y-4">
            <i className="fa-solid fa-headset text-4xl text-neon-primary"></i>
            <div>
              <h4 className="font-bold text-txt-primary text-base">
                Cần Tư Vấn Riêng?
              </h4>
              <p className="text-xs text-txt-secondary">
                Hỗ trợ cài đặt &amp; hỏi đáp dịch vụ 24/7
              </p>
            </div>
            <ZaloTriggerButton className="w-full py-3 rounded-btn bg-neon-primary text-black font-bold text-sm hover:bg-neon-accent transition-all shadow-neon-sm flex items-center justify-center gap-2">
              <i className="fa-solid fa-comment-dots"></i>
              <span>Liên Hệ Tư Vấn Qua Zalo</span>
            </ZaloTriggerButton>
          </div>
        </div>
      </div>
    </section>
  );
}
