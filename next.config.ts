import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /*
     * Server Actions cap request bodies at 1MB by default, which the article
     * form can brush against on a long post. 2MB leaves headroom while
     * staying well under Vercel's hard 4.5MB serverless limit.
     *
     * Images never travel through this path — the editor uploads them to R2
     * via `POST /api/admin/upload`, a Route Handler with no such cap — so a
     * body approaching this size means something is wrong, and
     * `lib/articles/sanitize.ts` rejects it at 512KB anyway.
     */
    serverActions: { bodySizeLimit: "2mb" },
  },

  /*
   * www serves the same content as the apex domain, which splits ranking
   * signals across two hosts and keeps Google showing "apesmod.com" instead
   * of the site name. Collapse everything onto the apex with a 308.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.apesmod.com" }],
        destination: "https://apesmod.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
