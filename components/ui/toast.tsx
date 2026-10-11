"use client";

import { useUi } from "@/components/providers/ui-provider";

export function Toast() {
  const { toast } = useUi();

  if (!toast) return null;

  return (
    <div className="fixed top-20 right-4 z-50 bg-dark-card border border-neon-primary text-txt-primary px-4 py-3 rounded-btn shadow-neon flex items-center gap-3 transition-all duration-300">
      <i className="fa-solid fa-circle-check text-neon-primary text-lg"></i>
      <div>
        <div className="text-xs font-bold">{toast.title}</div>
        <div className="text-[10px] text-txt-secondary">
          {toast.description}
        </div>
      </div>
    </div>
  );
}
