import Link from "next/link";
import { CONTACT } from "@/lib/contact";
import { POLICY_PAGES } from "@/lib/policy-pages";
import { ZaloTriggerButton } from "@/components/ui/zalo-trigger-button";
import { SectionLink } from "@/components/ui/section-link";

type QuickLink =
  | { kind: "route"; href: string; label: string }
  | { kind: "section"; sectionId: string; label: string };

const QUICK_LINKS: QuickLink[] = [
  { kind: "route", href: "/", label: "Trang chủ" },
  { kind: "route", href: "/bai-viet", label: "Danh sách bài viết" },
  { kind: "section", sectionId: "subscription-section", label: "Mua Cert" },
  {
    kind: "section",
    sectionId: "brand-section",
    label: "Giới thiệu hệ sinh thái",
  },
];

// The policy pages are articles flagged `isHidden`, so they are reachable at
// their own URL but never show up in a listing. Their slugs live in
// `lib/policy-pages.ts` so the footer needs no database query.

export function SiteFooter() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border py-10 mt-16 text-xs text-txt-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-btn bg-neon-primary flex items-center justify-center text-black font-extrabold text-base">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <span className="font-display font-bold text-base text-txt-primary">
                A-PES STUDIO
              </span>
            </div>
            <p className="text-txt-secondary leading-relaxed">
              Chuyên trang tổng hợp tools công nghệ, game mod uy tín, liên kết
              tải an toàn dành cho cộng đồng.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-txt-primary text-sm">
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-1.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  {link.kind === "section" ? (
                    <SectionLink
                      sectionId={link.sectionId}
                      className="hover:text-neon-primary"
                    >
                      {link.label}
                    </SectionLink>
                  ) : (
                    <Link href={link.href} className="hover:text-neon-primary">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Policy */}
          <div className="space-y-2">
            <h4 className="font-bold text-txt-primary text-sm">
              Chính Sách &amp; Điều Khoản
            </h4>
            <ul className="space-y-1.5">
              {POLICY_PAGES.map((policy) => (
                <li key={policy.slug}>
                  <Link
                    href={`/bai-viet/${policy.slug}`}
                    className="hover:text-neon-primary"
                  >
                    {policy.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Community */}
          <div className="space-y-3">
            <h4 className="font-bold text-txt-primary text-sm">
              Kênh Trực Tuyến
            </h4>
            <div className="flex items-center gap-3">
              <ZaloTriggerButton
                title="Zalo"
                className="w-9 h-9 rounded-btn bg-dark-card border border-dark-border flex items-center justify-center text-neon-primary hover:bg-neon-primary hover:text-black transition-all"
              >
                <i className="fa-solid fa-comment"></i>
              </ZaloTriggerButton>
              <a
                href={CONTACT.telegram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-btn bg-dark-card border border-dark-border flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                title={`Telegram ${CONTACT.telegram.handle}`}
              >
                <i className="fa-brands fa-telegram"></i>
              </a>
              <a
                href={CONTACT.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-btn bg-dark-card border border-dark-border flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                title="Facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </div>

            <ul className="space-y-1.5 pt-1">
              <li>
                <a
                  href={`tel:${CONTACT.phone.raw}`}
                  className="hover:text-neon-primary"
                >
                  <i className="fa-solid fa-phone me-1.5 text-neon-primary"></i>
                  {CONTACT.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.telegram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neon-primary"
                >
                  <i className="fa-brands fa-telegram me-1.5 text-blue-400"></i>
                  {CONTACT.telegram.handle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-dark-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <p>© 2026 A-Pes Studio. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
