import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản trị | A-Pes Studio",
  // The CMS must never show up in search results.
  robots: { index: false, follow: false },
};

/**
 * Admin shell. Deliberately does NOT render the public header/footer/bottom
 * nav — those live in the `(site)` group layout.
 *
 * Auth is enforced one level down in `(dashboard)/layout.tsx` so that
 * `/admin/login` stays reachable while signed out.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen">{children}</div>;
}
