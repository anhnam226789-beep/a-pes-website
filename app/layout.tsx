import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

// Weights mirror the original Google Fonts request so `font-black` (900)
// still falls back to 800, exactly like the static page did.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://apesmod.com"),
  title: "A-Pes Studio - Kho Cert & Tools Mod Game đáng tin cậy hàng đầu",
  description:
    "Mua Cert, tải mod eFootball™ và ứng dụng premium trên A-Pes Studio. Tận hưởng tốc độ tải cao, liên kết ngoài an toàn và cập nhật liên tục.",
  applicationName: "A-Pes Studio",
  appleWebApp: {
    title: "A-Pes Studio",
  },
  openGraph: {
    siteName: "A-Pes Studio",
  },
};

// Google chỉ đọc site name từ structured data WebSite trên trang chủ; thiếu nó
// kết quả tìm kiếm hiển thị domain "apesmod.com" thay vì "A-Pes Studio".
const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "A-Pes Studio",
  url: "https://apesmod.com/",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * Root layout: document shell only (fonts, global CSS, analytics).
 *
 * The public chrome (header, footer, bottom nav, modals) lives in the
 * `(site)` group layout so `/admin` can render its own shell instead.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`dark ${inter.variable} ${manrope.variable}`}
    >
      <body className="min-h-screen tech-pitch-bg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}

        <GoogleAnalytics />
      </body>
    </html>
  );
}
