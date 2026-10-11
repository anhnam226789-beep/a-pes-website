/** Average reading speed used to turn an article body into "N phút đọc". */
const WORDS_PER_MINUTE = 200;

/**
 * Estimates reading time from the article HTML.
 *
 * Runs on the server during render so the number is part of the prerendered
 * HTML — no client-side work and no hydration mismatch.
 */
export function getReadingMinutes(html: string): number {
  const text = html
    // Drop tags, then entities, so `<p>a</p><p>b</p>` counts as two words
    // rather than one and `&nbsp;` does not glue words together.
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:#\d+|#x[0-9a-f]+|[a-z]+);/gi, " ");

  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
