"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUi } from "@/components/providers/ui-provider";
import { SectionLink } from "@/components/ui/section-link";

function navLinkClassName(isActive: boolean): string {
  return [
    isActive ? "text-neon-primary" : "text-txt-secondary",
    "hover:text-neon-primary transition-colors flex items-center gap-2",
  ].join(" ");
}

export function SiteHeader() {
  const pathname = usePathname();
  const { openSearchModal, openZaloModal } = useUi();

  const isHome = pathname === "/";
  const isArticles = pathname === "/bai-viet";

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-dark-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.replaceState(null, "", "/");
              }
            }}
          >
            <div className="w-10 h-10 rounded-btn bg-linear-to-br from-neon-primary to-neon-dark flex items-center justify-center text-black font-extrabold text-xl shadow-neon-sm group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-linear-to-r from-neon-primary via-emerald-300 to-teal-200 flex items-center gap-1">
                A-PES STUDIO{" "}
                <span className="w-2 h-2 rounded-full bg-neon-primary animate-pulse"></span>
              </span>

              <span className="text-[10px] text-neon-primary uppercase tracking-widest font-semibold -mt-1">
                eSports &amp; Tech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className={navLinkClassName(isHome)}>
              <i className="fa-solid fa-house text-xs"></i> Trang Chủ
            </Link>
            <Link href="/bai-viet" className={navLinkClassName(isArticles)}>
              <i className="fa-solid fa-newspaper text-xs"></i> Bài Viết &amp;
              Mod
            </Link>
            <SectionLink
              sectionId="subscription-section"
              className="text-txt-secondary hover:text-neon-primary transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-crown text-xs text-yellow-400"></i> Mua
              Cert
            </SectionLink>
            <SectionLink
              sectionId="brand-section"
              className="text-txt-secondary hover:text-neon-primary transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-shield-halved text-xs"></i> Hệ Sinh Thái
            </SectionLink>
          </nav>

          {/* Actions: Search & Quick Zalo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openSearchModal}
              className="w-10 h-10 rounded-btn bg-dark-card border border-dark-border flex items-center justify-center text-txt-secondary hover:text-neon-primary hover:border-neon-primary/40 transition-all"
              title="Tìm kiếm"
            >
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
            </button>
            <button
              type="button"
              onClick={() => openZaloModal()}
              className="hidden sm:flex items-center gap-2 px-4 h-10 rounded-btn bg-neon-primary/10 border border-neon-primary/40 text-neon-primary hover:bg-neon-primary hover:text-black font-semibold text-sm transition-all shadow-neon-sm"
            >
              <i className="fa-solid fa-comment-dots"></i>
              <span>Zalo Support</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
