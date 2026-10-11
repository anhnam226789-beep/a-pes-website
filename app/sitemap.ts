import type { MetadataRoute } from "next";
import { getArticleSitemapEntries } from "@/lib/data/articles";

// Cached like the article pages themselves: new/renamed slugs appear within
// an hour without a redeploy.
export const revalidate = 3600;

const BASE_URL = "https://apesmod.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticleSitemapEntries();

  return [
    { url: `${BASE_URL}/`, priority: 1 },
    { url: `${BASE_URL}/bai-viet`, priority: 0.8 },
    { url: `${BASE_URL}/huong-dan-lay-udid`, priority: 0.5 },
    ...articles.map((article) => ({
      url: `${BASE_URL}/bai-viet/${article.slug}`,
      lastModified: article.updatedAt,
      priority: 0.7,
    })),
  ];
}
