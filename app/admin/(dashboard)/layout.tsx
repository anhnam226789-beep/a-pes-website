import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { logoutAction } from "@/lib/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { ADMIN_SECONDARY_BUTTON_CLASS } from "@/components/admin/styles";

/**
 * Guards every CMS page. Note that this is a convenience, not the security
 * boundary: Server Actions bypass layouts entirely, so each action calls
 * `requireAdmin()` on its own too.
 */
export default async function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin">) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur-lg border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2.5 shrink-0">
            <span className="w-8 h-8 rounded-btn bg-neon-primary text-black flex items-center justify-center text-sm shadow-neon-sm">
              <i className="fa-solid fa-shield-halved"></i>
            </span>
            <span className="hidden sm:block font-display font-extrabold text-txt-primary">
              A-Pes <span className="text-neon-primary">CMS</span>
            </span>
          </Link>

          <AdminNav />

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/admin/tai-khoan"
              title={`${user.name} · ${user.email} — Tài khoản & đổi mật khẩu`}
              className={ADMIN_SECONDARY_BUTTON_CLASS}
            >
              <i className="fa-solid fa-user text-xs"></i>
              <span className="hidden lg:inline max-w-[140px] truncate">
                {user.name}
              </span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className={ADMIN_SECONDARY_BUTTON_CLASS}
                title="Đăng xuất"
              >
                <i className="fa-solid fa-right-from-bracket text-xs"></i>
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-dark-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-txt-secondary flex items-center justify-between gap-4">
          <span>A-Pes Studio CMS</span>
          <Link href="/" target="_blank" className="hover:text-neon-primary">
            Xem trang public
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] ms-1"></i>
          </Link>
        </div>
      </footer>
    </div>
  );
}
