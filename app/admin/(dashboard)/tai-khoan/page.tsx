import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/dal";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { ADMIN_CARD_CLASS } from "@/components/admin/styles";

export const metadata: Metadata = {
  title: "Tài khoản | A-Pes Studio CMS",
};

export default async function AdminAccountPage() {
  const user = await requireAdmin();

  const details = [
    { label: "Tên hiển thị", value: user.name },
    { label: "Email đăng nhập", value: user.email },
    { label: "Vai trò", value: user.role },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-txt-primary">
          Tài <span className="text-neon-primary">khoản</span>
        </h1>
        <p className="text-sm text-txt-secondary">
          Thông tin đăng nhập và đổi mật khẩu.
        </p>
      </header>

      <section className={`${ADMIN_CARD_CLASS} p-5 space-y-3`}>
        <h2 className="text-sm font-bold text-txt-primary flex items-center gap-2">
          <i className="fa-solid fa-id-badge text-neon-primary text-xs"></i>
          Thông tin tài khoản
        </h2>

        <dl className="grid gap-2 sm:grid-cols-[10rem_1fr] text-xs">
          {details.map((detail) => (
            <div key={detail.label} className="contents">
              <dt className="text-txt-secondary">{detail.label}</dt>
              <dd className="text-txt-primary font-medium break-words">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-[11px] text-txt-secondary">
          Chưa có màn quản lý nhiều tài khoản. Thêm admin mới bằng{" "}
          <code className="text-txt-primary">npm run db:seed</code> với biến{" "}
          <code className="text-txt-primary">SEED_ADMIN_EMAIL</code> /{" "}
          <code className="text-txt-primary">SEED_ADMIN_PASSWORD</code>.
        </p>
      </section>

      <section className={`${ADMIN_CARD_CLASS} p-5 space-y-4`}>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-txt-primary flex items-center gap-2">
            <i className="fa-solid fa-key text-neon-primary text-xs"></i>
            Đổi mật khẩu
          </h2>
          <p className="text-[11px] text-txt-secondary">
            Đổi mật khẩu sẽ đăng xuất mọi thiết bị khác đang đăng nhập; thiết bị
            hiện tại vẫn giữ phiên.
          </p>
        </div>

        <ChangePasswordForm />
      </section>
    </div>
  );
}
