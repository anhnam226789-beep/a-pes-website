import Link from "next/link";
import { cn } from "@/lib/cn";
import { getPageWindow } from "@/lib/articles";

const PAGE_BUTTON_CLASS =
  "w-10 h-10 rounded-btn flex items-center justify-center transition-all";

/**
 * Page links for a listing.
 *
 * Every prop is serialisable — no `buildHref` callback — because this renders
 * both inside the public listing (a Client Component) and directly in the CMS
 * page (a Server Component), and functions cannot cross that boundary.
 * Callers pass the query params to carry across page links instead.
 */
export function Pagination({
  page,
  totalPages,
  basePath,
  params = {},
  pageParam = "trang",
  label = "Phân trang",
}: {
  page: number;
  totalPages: number;
  basePath: string;
  /** Other query params to preserve. Empty values are dropped from the URL. */
  params?: Record<string, string>;
  pageParam?: string;
  label?: string;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number): string => {
    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value.trim()) search.set(key, value.trim());
    }
    // Page 1 is the default, so it stays out of the URL.
    if (target > 1) search.set(pageParam, String(target));

    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <nav
      aria-label={label}
      className="flex items-center justify-center gap-2 pt-2"
    >
      <PageArrow
        href={href(page - 1)}
        disabled={page === 1}
        label="Trang trước"
        icon="fa-solid fa-chevron-left"
      />

      {getPageWindow(page, totalPages).map((target, index) =>
        target === null ? (
          <span
            key={`gap-${index}`}
            aria-hidden="true"
            className="w-6 text-center text-txt-secondary"
          >
            …
          </span>
        ) : (
          <Link
            key={target}
            href={href(target)}
            aria-label={`Trang ${target}`}
            aria-current={target === page ? "page" : undefined}
            className={cn(
              PAGE_BUTTON_CLASS,
              target === page
                ? "bg-neon-primary text-black font-bold shadow-neon-sm"
                : "bg-dark-card border border-dark-border text-txt-secondary hover:border-neon-primary/40 hover:text-txt-primary",
            )}
          >
            {target}
          </Link>
        ),
      )}

      <PageArrow
        href={href(page + 1)}
        disabled={page === totalPages}
        label="Trang sau"
        icon="fa-solid fa-chevron-right"
      />
    </nav>
  );
}

function PageArrow({
  href,
  disabled,
  label,
  icon,
}: {
  href: string;
  disabled: boolean;
  label: string;
  icon: string;
}) {
  // A disabled arrow renders as a <span>, not a dimmed link: an anchor that
  // goes nowhere is still focusable and still clickable by keyboard.
  if (disabled) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          PAGE_BUTTON_CLASS,
          "bg-dark-card border border-dark-border text-txt-secondary opacity-40",
        )}
      >
        <i className={cn(icon, "text-xs")}></i>
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        PAGE_BUTTON_CLASS,
        "bg-dark-card border border-dark-border text-txt-secondary hover:text-neon-primary",
      )}
    >
      <i className={cn(icon, "text-xs")}></i>
    </Link>
  );
}
