import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/dal";
import { LoginForm } from "@/components/admin/login-form";
import { ADMIN_CARD_CLASS } from "@/components/admin/styles";

export default async function AdminLoginPage() {
  // Already signed in — no reason to show the form again.
  if (await getCurrentUser()) redirect("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-btn bg-neon-primary text-black flex items-center justify-center text-xl shadow-neon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1 className="text-xl font-display font-extrabold text-txt-primary">
            A-Pes Studio <span className="text-neon-primary">CMS</span>
          </h1>
          <p className="text-xs text-txt-secondary">
            Đăng nhập bằng tài khoản quản trị để tiếp tục
          </p>
        </div>

        <div className={`${ADMIN_CARD_CLASS} p-6`}>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-txt-secondary">
          <Link href="/" className="hover:text-neon-primary">
            <i className="fa-solid fa-arrow-left text-[10px] me-1"></i>
            Về trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
}
