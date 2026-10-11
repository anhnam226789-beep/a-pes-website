import Script from "next/script";

// Overridable via env so switching GA property doesn't require a code change.
// NEXT_PUBLIC_* is inlined at build time, which is fine here: every route is
// prerendered statically.
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID ?? "G-E2E1JJF7YQ";

/**
 * Google tag (gtag.js) for GA4.
 *
 * `afterInteractive` keeps the tag off the critical path while still loading it
 * early; Next.js guarantees the script is injected only once across client-side
 * navigations. Page views on route changes are covered by GA4 Enhanced
 * Measurement ("Page changes based on browser history events").
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
