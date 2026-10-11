"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/admin", label: "Tổng quan", icon: "fa-solid fa-gauge-high" },
  { href: "/admin/articles", label: "Bài viết", icon: "fa-solid fa-newspaper" },
  { href: "/admin/categories", label: "Danh mục", icon: "fa-solid fa-tags" },
  {
    href: "/admin/udid-steps",
    label: "Hướng dẫn UDID",
    icon: "fa-solid fa-list-ol",
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
      {NAV_ITEMS.map((item) => {
        // "/admin" must match exactly or the dashboard tab would light up on
        // every child route; the section tabs also cover their sub-pages
        // (e.g. /admin/articles/new).
        const isActive =
          item.href === "/admin"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3.5 h-9 rounded-btn text-sm whitespace-nowrap transition-all",
              isActive
                ? "bg-neon-primary text-black font-bold"
                : "text-txt-secondary hover:text-txt-primary hover:bg-dark-card",
            )}
          >
            <i className={cn(item.icon, "text-xs")}></i>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
