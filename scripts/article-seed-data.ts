/**
 * Initial articles, ported from the mock repository that used to live in
 * `lib/articles.ts`.
 *
 * `body` is the reference article body converted to the HTML the CMS editor
 * produces. Every seeded article shares it because that is exactly what the
 * site did before: the detail route rendered one hardcoded `<ArticleBody />`
 * regardless of which article was open. Replace it per article in the CMS.
 */
export interface ArticleSeed {
  title: string;
  slug: string;
  categoryName: string;
  excerpt: string;
  coverImage: string;
  /** dd/MM/yyyy, exactly as the mock data displayed it. */
  date: string;
  views: number;
}

export const REFERENCE_ARTICLE_BODY = `
<p>Bản cập nhật eFootball 2026 mới nhất mang đến cho người chơi trải nghiệm bóng đá chân thực vượt trội. Với bản Mod VIP Menu được biên dịch riêng bởi NexTech, bạn sẽ sở hữu ngay toàn bộ tính năng cao cấp không cần root máy.</p>
<h2>Các Tính Năng Nổi Bật Trong Bản Mod</h2>
<ul>
<li><strong>Unlock Full GP &amp; Coins:</strong> Mua sắm cầu thủ huyền thoại không giới hạn ngân sách.</li>
<li><strong>Smart Auto Play AI:</strong> Tự động thi đấu sự kiện kiếm quà siêu nhanh.</li>
<li><strong>Graphics Config 60/120 FPS:</strong> Mượt mà trên cả các thiết bị Android tầm trung.</li>
<li><strong>Bảo vệ Anti-Ban:</strong> Mã hóa ID thiết bị, an toàn tuyệt đối khi chơi Online.</li>
</ul>
<h3>Ghi chú cấu hình yêu cầu (Android/PC)</h3>
<pre><code>// Cấu hình tối thiểu:
OS: Android 9.0 trở lên hoặc Emulator (Bluestacks 5 / LDPlayer)
RAM: Minimal 4GB RAM
Storage: 3.5GB dung lượng trống</code></pre>
<blockquote><p>Lưu ý: Luôn gỡ bỏ bản game cũ trước khi tiến hành cài đặt file APK Mod để tránh xung đột dữ liệu.</p></blockquote>
<table>
<thead><tr><th>Thông Số</th><th>Chi Tiết Thông Tin</th></tr></thead>
<tbody>
<tr><td>Tên Ứng Dụng</td><td>eFootball™ 2026 Mobile Mod VIP</td></tr>
<tr><td>Phiên Bản</td><td>v4.8.2 (Latest Build)</td></tr>
<tr><td>Dung Lượng</td><td>2.4 GB (APK + OBB)</td></tr>
<tr><td>Nhà Phát Hành</td><td>KONAMI / Modded by NexTech</td></tr>
</tbody>
</table>
`.trim();

export const ARTICLE_SEED: ArticleSeed[] = [
  {
    title: "eFootball 2026 Mod VIP Menu: Unlock Full Coins & 60FPS Graphic",
    slug: "efootball-2026-mod-vip-menu-unlock-full-coins-60fps-graphic",
    categoryName: "Game Mod",
    excerpt:
      "Bản cập nhật eFootball 2026 Mobile mới nhất unlock full coin, mở khóa cấu hình đồ họa 120 FPS mượt mà.",
    date: "05/08/2026",
    views: 12450,
    coverImage:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "FC Mobile 26 Mod Menu: Auto Skill & Unlimited Money Build",
    slug: "fc-mobile-26-mod-menu-auto-skill-unlimited-money-build",
    categoryName: "Game Mod",
    excerpt:
      "Tải ngay bản mod FC Mobile 2026 tính năng tự động đá giải, unlimited gems cho Android không root.",
    date: "04/08/2026",
    views: 9820,
    coverImage:
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "AI Video Editor Pro 2026: Mở Khóa Tất Cả Tính Năng Export 4K",
    slug: "ai-video-editor-pro-2026-mo-khoa-tat-ca-tinh-nang-export-4k",
    categoryName: "Premium Tools",
    excerpt:
      "Công cụ làm video AI tự động tạo phụ đề, làm nét video cực đỉnh không dính watermark.",
    date: "03/08/2026",
    views: 15100,
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "VPN Gaming Speed Optimizer: Giảm Ping Đá Online Cực Nhẹ",
    slug: "vpn-gaming-speed-optimizer-giam-ping-da-online-cuc-nhe",
    categoryName: "App iOS/Android",
    excerpt:
      "Ứng dụng tăng tốc mạng định tuyến server game đá bóng online chỉ với 1 chạm duy nhất.",
    date: "02/08/2026",
    views: 6400,
    coverImage:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Thủ Thuật Tối Ưu Cấu Hình Android Chơi Game Nặng 120Hz",
    slug: "thu-thuat-toi-uu-cau-hinh-android-choi-game-nang-120hz",
    categoryName: "Thủ Thuật",
    excerpt:
      "Hướng dẫn tinh chỉnh Developer Option và tản nhiệt phần mềm cho smartphone Android.",
    date: "01/08/2026",
    views: 18900,
    coverImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Spotify Premium APK 2026: Nghe Nhạc Không Quảng Cáo Offline",
    slug: "spotify-premium-apk-2026-nghe-nhac-khong-quang-cao-offline",
    categoryName: "App iOS/Android",
    excerpt:
      "Tải Spotify Mod nghe nhạc chất lượng 320kbps, tải nhạc không giới hạn hoàn toàn miễn phí.",
    date: "31/07/2026",
    views: 22300,
    coverImage:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Dream League Soccer 2026 Mod Gold & Coins Full Kit V-League",
    slug: "dream-league-soccer-2026-mod-gold-coins-full-kit-v-league",
    categoryName: "Game Mod",
    excerpt:
      "Bản DLS 2026 mở khóa bộ áo đấu V-League ĐT Việt Nam cùng chỉ số cầu thủ max 100.",
    date: "30/07/2026",
    views: 11150,
    coverImage:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Tool Tự Động Hóa Auto Clicker Pro Cho Android Không Cần Root",
    slug: "tool-tu-dong-hoa-auto-clicker-pro-cho-android-khong-can-root",
    categoryName: "Premium Tools",
    excerpt:
      "Hỗ trợ tạo kịch bản tap tự động linh hoạt cho các tựa game cày cuộn sự kiện.",
    date: "29/07/2026",
    views: 5600,
    coverImage:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Canva Pro Edu 2026: Hướng Dẫn Kích Hoạt Tài Khoản Vĩnh Viễn",
    slug: "canva-pro-edu-2026-huong-dan-kich-hoat-tai-khoan-vinh-vien",
    categoryName: "Thủ Thuật",
    excerpt:
      "Chia sẻ mẹo tham gia lớp học Canva Pro để sử dụng full font chữ, kho ảnh bản quyền.",
    date: "28/07/2026",
    views: 31200,
    coverImage:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
  },
];
