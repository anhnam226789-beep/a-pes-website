"use client";

import type { ReactNode } from "react";
import { useUi } from "@/components/providers/ui-provider";

interface ZaloTriggerButtonProps {
  className: string;
  children: ReactNode;
  /** Package label forwarded to the modal, e.g. "Gói Lấy Ngay - 50k". */
  packageName?: string;
  title?: string;
}

/**
 * Client-side trigger so the surrounding sections can stay Server Components.
 */
export function ZaloTriggerButton({
  className,
  children,
  packageName,
  title,
}: ZaloTriggerButtonProps) {
  const { openZaloModal } = useUi();

  return (
    <button
      type="button"
      title={title}
      className={className}
      onClick={() => openZaloModal(packageName)}
    >
      {children}
    </button>
  );
}
