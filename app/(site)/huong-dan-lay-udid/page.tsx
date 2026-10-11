import type { Metadata } from "next";
import Link from "next/link";
import { UDID_TECH_URL } from "@/lib/udid";
import { getUdidSteps } from "@/lib/data/udid-steps";
import { ImagePreview } from "@/components/ui/image-preview";
import { ZaloTriggerButton } from "@/components/ui/zalo-trigger-button";
import { SectionLink } from "@/components/ui/section-link";

export const metadata: Metadata = {
  title: "Hướng dẫn lấy UDID để thêm thiết bị | A-Pes Studio",
  description:
    "Hướng dẫn từng bước cách lấy UDID trên iPhone/iPad để thêm thiết bị khi mua Cert iOS / iPadOS.",
  alternates: { canonical: "/huong-dan-lay-udid" },
};

// ISR: the page stays prerendered, and every step mutation in the admin calls
// `revalidatePath("/huong-dan-lay-udid")` so edits show up without waiting.
export const revalidate = 300;

export default async function UdidGuidePage() {
  const steps = await getUdidSteps();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-txt-secondary">
        <Link href="/" className="hover:text-neon-primary">
          Trang chủ
        </Link>
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        <SectionLink
          sectionId="subscription-section"
          className="hover:text-neon-primary"
        >
          Mua Cert
        </SectionLink>
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        <span className="text-txt-primary font-medium truncate max-w-[200px]">
          Hướng dẫn lấy UDID
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-neon-primary/10 border border-neon-primary/30 text-neon-primary text-xs font-bold uppercase tracking-wider">
          Tutorial
        </span>

        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-txt-primary leading-tight">
          Hướng dẫn lấy UDID để thêm thiết bị
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-txt-secondary border-b border-dark-border pb-4">
          <span>
            <i className="fa-regular fa-calendar me-1"></i> 05/08/2026
          </span>
          <span>•</span>
          <span>
            <i className="fa-solid fa-list-ol me-1"></i> {steps.length} bước
          </span>
          <span>•</span>
          <span>
            <i className="fa-brands fa-apple me-1"></i> iOS / iPadOS
          </span>
        </div>
      </header>

      {/* Steps */}
      {steps.length === 0 ? (
        <p className="glass-card rounded-card p-6 text-sm text-txt-secondary text-center">
          Nội dung hướng dẫn đang được cập nhật, vui lòng quay lại sau.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="glass-card rounded-card overflow-hidden flex flex-col"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-btn bg-neon-primary text-black flex items-center justify-center font-extrabold text-sm shrink-0">
                    {step.order}
                  </div>
                  <h3 className="text-base font-bold text-txt-primary">
                    Bước {step.order}
                  </h3>
                </div>
                <p className="text-sm text-txt-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/*
                Full bleed inside the card, height left to the image.
                These illustrations are phone screenshots whose text has to be
                readable — a fixed-height box sized them by their long edge and
                left them a third of the card wide on mobile.
              */}
              <div className="mt-auto bg-dark-bg border-t border-dark-border">
                <ImagePreview
                  src={step.image}
                  alt={`Minh hoạ bước ${step.order}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <section className="pt-2">
        <div className="glass-card rounded-[24px] p-6 sm:p-8 border-2 border-neon-primary/40 shadow-neon space-y-5 text-center">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-txt-primary">
              Sẵn sàng lấy UDID?
            </h3>
            <p className="text-xs text-neon-primary font-medium">
              Thực hiện trực tiếp trên thiết bị iOS / iPadOS của bạn
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={UDID_TECH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-btn bg-neon-primary text-black font-bold text-sm hover:bg-neon-accent transition-all shadow-neon-sm flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-fingerprint"></i>
              <span>Lấy UDID</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
            <ZaloTriggerButton
              packageName="Hỗ trợ lấy UDID"
              className="w-full sm:w-auto px-6 py-3 rounded-btn bg-dark-card border border-dark-border hover:border-neon-primary/50 hover:text-neon-primary text-txt-primary font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-comment-dots text-neon-primary"></i>
              <span>Cần hỗ trợ qua Zalo</span>
            </ZaloTriggerButton>
          </div>
        </div>
      </section>
    </div>
  );
}
