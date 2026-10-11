import sanitizeHtml from "sanitize-html";

/**
 * Deliberately no `server-only`: the seed script runs this module in a plain
 * Node process. Seed content going through the exact same pipeline as the CMS
 * is what keeps stored HTML uniform — the table wrapper below, for instance,
 * would otherwise be missing from every seeded article.
 */

/**
 * Hard ceiling on the stored article body.
 *
 * Vercel caps a serverless request body at 4.5MB, and Server Actions default
 * to 1MB (raised to 2MB in `next.config.ts`). Images never live in the HTML —
 * they are uploaded to R2 and referenced by URL — so a body anywhere near
 * this size means something went wrong rather than a genuinely long article.
 */
export const MAX_CONTENT_BYTES = 512 * 1024;

export const MAX_CONTENT_LABEL = "512KB";

/**
 * Allow-list mirroring exactly what the CMS editor can produce.
 *
 * Sanitising on **write** matters even though only admins can reach the
 * editor: a Server Action is a public endpoint, so the HTML that arrives is
 * whatever the request contained — not necessarily what Tiptap generated.
 */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "code",
    "pre",
    "blockquote",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "hr",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    th: ["colspan", "rowspan"],
    td: ["colspan", "rowspan"],
    pre: ["class"],
    code: ["class"],
  },
  // No `data:` — a base64 image inlined into the body is exactly what blows
  // past the request size limit, and uploads exist so it never has to happen.
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesAppliedToAttributes: ["href", "src"],
  // Anything not on the list is dropped tag-and-all, so a stray <script>
  // cannot leave its body behind as visible text.
  nonTextTags: ["style", "script", "textarea", "option", "noscript"],
  transformTags: {
    // Every link in article content points off-site.
    a: sanitizeHtml.simpleTransform("a", {
      target: "_blank",
      rel: "noopener noreferrer",
    }),
  },
};

export function sanitizeArticleContent(html: string): string {
  const clean = sanitizeHtml(html, SANITIZE_OPTIONS);

  // A wide table has to scroll inside its own box, otherwise it forces the
  // whole page to scroll sideways on mobile. Doing it here rather than in CSS
  // keeps `display: table` intact so columns still size themselves.
  //
  // The regex is safe because sanitising already ran: `table` carries no
  // allowed attributes, so the opening tag is always exactly `<table>`.
  return clean
    .replace(/<table>/g, '<div class="article-table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

/** True when the body is small enough to store and to round-trip safely. */
export function isContentWithinLimit(html: string): boolean {
  return Buffer.byteLength(html, "utf8") <= MAX_CONTENT_BYTES;
}

/** Tiptap serialises an empty document as `<p></p>`, which is not content. */
export function isContentEmpty(html: string): boolean {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim() === "";
}
