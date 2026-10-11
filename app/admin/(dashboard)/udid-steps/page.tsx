import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { getUdidSteps } from "@/lib/data/udid-steps";
import { isR2Configured } from "@/lib/r2/client";
import { UdidStepManager } from "@/components/admin/udid-step-manager";

export const metadata: Metadata = {
  title: "Quản lý hướng dẫn UDID | A-Pes Studio CMS",
};

export default async function AdminUdidStepsPage() {
  await requireAdmin();

  const steps = await getUdidSteps();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-txt-primary">
          Hướng dẫn <span className="text-neon-primary">lấy UDID</span>
        </h1>
        <p className="text-sm text-txt-secondary">
          Các bước hiển thị trên{" "}
          <Link
            href="/huong-dan-lay-udid"
            target="_blank"
            className="text-neon-primary hover:underline"
          >
            /huong-dan-lay-udid
          </Link>
          . Số bước được đánh lại 1…N tự động sau mỗi lần thêm, xoá hoặc sắp xếp.
        </p>
      </header>

      <UdidStepManager steps={steps} uploadEnabled={isR2Configured()} />
    </div>
  );
}
