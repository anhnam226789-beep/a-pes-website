"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

interface SectionLinkProps {
  /** Target element id on the home page, without the leading "#". */
  sectionId: string;
  className: string;
  children: ReactNode;
}

/**
 * Link to a section of the home page.
 *
 * A plain `<Link href="/#id">` is a no-op once the URL already carries that
 * hash, which makes the button look dead on every click after the first.
 * When we are already on the home page we scroll by hand and only sync the
 * hash afterwards; from any other route Next handles it as a normal
 * navigation.
 */
export function SectionLink({
  sectionId,
  className,
  children,
}: SectionLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Leave "open in new tab" and friends to the browser.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    if (pathname !== "/") return;

    const target = document.getElementById(sectionId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `/#${sectionId}`);
  };

  return (
    <Link href={`/#${sectionId}`} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
