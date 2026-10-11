"use client";

import { useEffect } from "react";

/**
 * Records one view per article per browser session.
 *
 * Runs from the browser after mount so the detail page stays prerendered and
 * Next.js link prefetching (which fires on hover) is not counted as a read.
 * `sessionStorage` keeps a refresh or a back-navigation from inflating the
 * number; the counter shown on the page catches up on the next revalidation.
 *
 * Renders nothing.
 */
export function ArticleViewCounter({ articleId }: { articleId: string }) {
  useEffect(() => {
    const storageKey = `apes:viewed:${articleId}`;

    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // Private mode with storage disabled — still count the view.
    }

    // `keepalive` lets the request finish if the visitor navigates away.
    void fetch(`/api/articles/${articleId}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // A dropped view counter must never surface to the reader.
    });
  }, [articleId]);

  return null;
}
