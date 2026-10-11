import Link from "next/link";
import { CERT_PLANS } from "@/lib/cert-plans";
import { UDID_TECH_URL } from "@/lib/udid";
import { CertPlanCard } from "@/components/home/cert-plan-card";

export function SubscriptionSection() {
  return (
    <section
      id="subscription-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 scroll-mt-20"
    >
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-txt-primary">
          Mua Cert <span className="text-neon-primary">iOS / iPadOS</span>
        </h2>
        <p className="text-sm sm:text-base text-txt-secondary max-w-xl mx-auto">
          Cung cấp File Chứng Chỉ (.p12, .mobileprovision) &amp; Link cài App
          trực tiếp, nhân bản ứng dụng không giới hạn.
        </p>

        {/* UDID actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
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
          <Link
            href="/huong-dan-lay-udid"
            className="w-full sm:w-auto px-6 py-3 rounded-btn bg-dark-card border border-dark-border hover:border-neon-primary/50 hover:text-neon-primary text-txt-primary font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-circle-question text-neon-primary"></i>
            <span>Hướng dẫn lấy UDID</span>
          </Link>
        </div>
      </div>

      {/* Cards Grid: Mobile 1 column, Desktop 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CERT_PLANS.map((plan) => (
          <CertPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
