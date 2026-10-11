import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { SubscriptionSection } from "@/components/home/subscription-section";
import { FeaturedPostsSection } from "@/components/home/featured-posts-section";
import { BrandSection } from "@/components/home/brand-section";

// ISR: the featured grid reads MongoDB, and the CMS calls `revalidatePath("/")`
// whenever an article is saved or its "nổi bật" flag flips.
export const revalidate = 300;

// The homepage is also reachable via www; the canonical keeps Google's site
// name and ranking signals consolidated on the apex domain.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <HeroSection />
      <SubscriptionSection />
      <FeaturedPostsSection />
      <BrandSection />
    </div>
  );
}
