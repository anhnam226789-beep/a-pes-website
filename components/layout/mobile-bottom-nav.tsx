"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUi } from "@/components/providers/ui-provider";
import { SectionLink } from "@/components/ui/section-link";

function navItemClassName(isActive: boolean): string {
  return [
    "flex flex-col items-center gap-1",
    isActive
      ? "text-neon-primary"
      : "text-txt-secondary hover:text-neon-primary",
  ].join(" ");
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { openZaloModal } = useUi();

  const isHome = pathname === "/";
  const isArticles = pathname === "/bai-viet";

  // NOTE: `h-16` must stay in sync with the `pb-16` reserved on <body>,
  // otherwise a strip of page background shows below the footer.
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#050505]/95 backdrop-blur-lg border-t border-dark-border px-3 flex items-center justify-around">
      <Link 
        href="/" 
        className={navItemClassName(isHome)}
        onClick={(e) => {
          if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.replaceState(null, "", "/");
          }
        }}
      >
        <i className="fa-solid fa-house text-lg"></i>
        <span className="text-[10px] font-medium">Trang chủ</span>
      </Link>

      <Link 
        href="/bai-viet" 
        className={navItemClassName(isArticles)}
        onClick={(e) => {
          if (pathname === "/bai-viet") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.replaceState(null, "", "/bai-viet");
          }
        }}
      >
        <i className="fa-solid fa-newspaper text-lg"></i>
        <span className="text-[10px] font-medium">Bài viết</span>
      </Link>

      <SectionLink
        sectionId="featured-posts-grid"
        className="flex flex-col items-center gap-1 text-txt-secondary hover:text-neon-primary"
      >
        <i className="fa-solid fa-fire text-lg text-red-500 animate-flame-up"></i>
        <span className="text-[10px] font-medium text-red-500">Nổi bật</span>
      </SectionLink>

      <SectionLink
        sectionId="subscription-section"
        className="flex flex-col items-center gap-1 text-txt-secondary hover:text-neon-primary"
      >
        <i className="fa-solid fa-crown fa-shake text-yellow-400 text-lg" style={{ '--fa-animation-duration': '2s' } as React.CSSProperties}></i>
        <span className="text-[10px] font-medium text-yellow-400">Mua Cert</span>
      </SectionLink>

      {/* Prominent Zalo Button in Bottom Bar */}
      <button
        type="button"
        onClick={() => openZaloModal()}
        className="flex flex-col items-center justify-center w-11 h-11 rounded-full bg-neon-primary text-black font-bold shadow-neon"
      >
        <i className="fa-solid fa-comments text-lg"></i>
      </button>
    </div>
  );
}
