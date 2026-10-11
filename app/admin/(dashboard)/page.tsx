import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { getAllCategories } from "@/lib/data/categories";
import { getUdidSteps } from "@/lib/data/udid-steps";
import { getArticleStats } from "@/lib/data/articles";
import { ADMIN_CARD_CLASS } from "@/components/admin/styles";

export default async function AdminDashboardPage() {
  const user = await requireAdmin();

  const [articles, categories, steps] = await Promise.all([
    getArticleStats(),
    getAllCategories(),
    getUdidSteps(),
  ]);

  const cards = [
    {
      href: "/admin/articles",
      icon: "fa-solid fa-newspaper",
      title: "Bài viết",
      value: `${articles.total} bài`,
      hint:
        `${articles.featured} bài nổi bật ở trang chủ` +
        (articles.hidden > 0 ? ` · ${articles.hidden} bài ẩn` : ""),
    },
    {
      href: "/admin/categories",
      icon: "fa-solid fa-tags",
      title: "Danh mục bài viết",
      value: `${categories.length} danh mục`,
      hint: `${categories.filter((category) => category.isActive).length} đang hiển thị`,
    },
    {
      href: "/admin/udid-steps",
      icon: "fa-solid fa-list-ol",
      title: "Hướng dẫn lấy UDID",
      value: `${steps.length} bước`,
      hint: "Nội dung trang /huong-dan-lay-udid",
    },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-txt-primary">
          Xin chào, <span className="text-neon-primary">{user.name}</span>
        </h1>
        <p className="text-sm text-txt-secondary">
          Chọn một mục để bắt đầu chỉnh sửa nội dung.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`${ADMIN_CARD_CLASS} p-5 space-y-3 hover:border-neon-primary/40 transition-colors group`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="w-10 h-10 rounded-btn bg-neon-primary/10 border border-neon-primary/30 text-neon-primary flex items-center justify-center">
                <i className={card.icon}></i>
              </span>
              <i className="fa-solid fa-arrow-right text-xs text-txt-secondary group-hover:text-neon-primary transition-colors"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-txt-primary">{card.title}</p>
              <p className="text-2xl font-display font-extrabold text-neon-primary">
                {card.value}
              </p>
              <p className="text-xs text-txt-secondary">{card.hint}</p>
            </div>
          </Link>
        ))}
      </div>

      {/*
        Derived from the database rather than a hand-written list, so it cannot
        drift out of date the way a hardcoded "chưa làm" note does.
      */}
      {articles.withoutLinks > 0 && (
        <section
          className={`${ADMIN_CARD_CLASS} p-5 space-y-2 border-amber-500/30`}
        >
          <h2 className="text-sm font-bold text-txt-primary flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 text-xs"></i>
            Cần bổ sung nội dung
          </h2>
          <p className="text-xs text-txt-secondary">
            <strong className="text-txt-primary">
              {articles.withoutLinks}/{articles.publicTotal} bài viết công khai
            </strong>{" "}
            chưa có liên kết tải xuống nào — khối &quot;Liên Kết Tải Xuống&quot;
            sẽ không hiển thị trên các bài đó. Trang chính sách không tính vào
            đây.{" "}
            <Link href="/admin/articles" className="text-neon-primary hover:underline">
              Mở danh sách bài viết
            </Link>
          </p>
        </section>
      )}

      <section className={`${ADMIN_CARD_CLASS} p-5 space-y-2`}>
        <h2 className="text-sm font-bold text-txt-primary flex items-center gap-2">
          <i className="fa-solid fa-circle-info text-neon-primary text-xs"></i>
          Chưa có trong CMS
        </h2>
        <ul className="text-xs text-txt-secondary space-y-1.5 list-disc list-inside">
          <li>
            Quản lý nhiều tài khoản quản trị — hiện chỉ đổi được mật khẩu của
            chính mình ở{" "}
            <Link href="/admin/tai-khoan" className="text-neon-primary hover:underline">
              trang Tài khoản
            </Link>
            . Thêm admin mới bằng{" "}
            <code className="text-txt-primary">npm run db:seed</code> với biến{" "}
            <code className="text-txt-primary">SEED_ADMIN_EMAIL</code> /{" "}
            <code className="text-txt-primary">SEED_ADMIN_PASSWORD</code>.
          </li>
          <li>
            Ảnh cũ trên R2 không tự xoá khi bạn thay ảnh hoặc xoá bài — cần dọn
            thủ công trên Cloudflare.
          </li>
        </ul>
      </section>
    </div>
  );
}
