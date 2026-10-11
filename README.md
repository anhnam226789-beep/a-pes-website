# A-Pes Studio

Landing page cho A-Pes Studio (kho tools, game mod, dịch vụ bán Cert iOS/iPadOS).

Dự án được convert từ trang tĩnh `tech_mod_game_neon_landing_page.html` sang **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**, backend **MongoDB (Mongoose)** với CMS ở `/admin`. Bảng màu và bố cục chung bám theo bản HTML đó, riêng hero và nền trang đã đi theo hướng khác (xem [Thay đổi thiết kế](#thay-đổi-thiết-kế)).

Giao diện là theme **dark neon** (nền `#050505`, chữ `#F5F7F6`, nhấn xanh neon `#36D96B`), bám đúng bảng màu của bản HTML tham chiếu. Toàn bộ màu đi qua design token trong [app/globals.css](app/globals.css) — khi thêm khối mới, dùng token thay vì màu Tailwind mặc định để đổi theme sau này chỉ phải sửa một chỗ.

## Bắt đầu

```bash
npm install
cp .env.example .env.local   # rồi điền MONGODB_URI + SESSION_SECRET
npm run db:seed              # seed danh mục, các bước UDID và tài khoản admin đầu tiên
npm run dev                  # http://localhost:3000  — CMS ở /admin
npm run build
npm run lint
```

`npm run db:seed` là **idempotent**: mọi thao tác ghi đều upsert theo khoá tự nhiên và không bao giờ xoá, nên chạy lại nhiều lần không nhân bản dữ liệu và không đè nội dung đã sửa trong CMS. Tài khoản admin mặc định là `admin@a-pes.studio` / `ApesStudio@2026` (đổi được qua `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME`); nếu email đã tồn tại thì script giữ nguyên mật khẩu cũ.

## Kiến trúc

Trang tĩnh gốc là SPA giả: 3 "page-view" ẩn/hiện bằng JavaScript. Khi convert, mỗi view trở thành một route thật của App Router:

| Route                                                                 | Nguồn ở bản HTML | File                                                                               | Render                                     |
| --------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| `/`                                                                   | `#page-home`     | [app/(site)/page.tsx](<app/(site)/page.tsx>)                                       | ISR 5 phút                                 |
| `/bai-viet`                                                           | `#page-articles` | [app/(site)/bai-viet/page.tsx](<app/(site)/bai-viet/page.tsx>)                     | Dynamic (đọc `searchParams`)               |
| `/bai-viet/[slug]`                                                    | `#page-detail`   | [app/(site)/bai-viet/[slug]/page.tsx](<app/(site)/bai-viet/[slug]/page.tsx>)       | ISR 5 phút, SSG qua `generateStaticParams` |
| `/huong-dan-lay-udid`                                                 | (trang mới)      | [app/(site)/huong-dan-lay-udid/page.tsx](<app/(site)/huong-dan-lay-udid/page.tsx>) | ISR 5 phút                                 |
| `/admin/login`                                                        | —                | [app/admin/login/page.tsx](app/admin/login/page.tsx)                               | Dynamic                                    |
| `/admin`, `/admin/articles`, `/admin/categories`, `/admin/udid-steps` | —                | [app/admin/(dashboard)/](<app/admin/(dashboard)/>)                                 | Dynamic                                    |
| `POST /api/admin/upload`                                              | —                | [app/api/admin/upload/route.ts](app/api/admin/upload/route.ts)                     | Dynamic                                    |
| `GET /api/articles/search`                                            | —                | [app/api/articles/search/route.ts](app/api/articles/search/route.ts)               | Dynamic                                    |
| `POST /api/articles/[id]/view`                                        | —                | [app/api/articles/[id]/view/route.ts](app/api/articles/[id]/view/route.ts)         | Dynamic                                    |

Route chi tiết dùng **slug** chứ không phải id. Truy vấn vẫn nhận cả ObjectId (`getArticleBySlug`), nên link cũ dạng id không gãy khi đổi tiêu đề bài viết.

Section "Mua Cert" có hai nút UDID: **Lấy UDID** mở `https://udid.tech` ở tab mới, **Hướng dẫn lấy UDID** dẫn sang trang hướng dẫn 7 bước ở trên (dùng lại khung của trang chi tiết bài viết).

Hai **route group** tách chrome của hai khu vực, không ảnh hưởng URL:

- `app/layout.tsx` — root layout, chỉ còn phần khung tài liệu: `<html>`/`<body>`, font, `globals.css`, Google Analytics.
- `app/(site)/layout.tsx` — header, footer, bottom nav, các modal của trang public.
- `app/admin/layout.tsx` — khung CMS (kèm `robots: noindex`); auth nằm ở `app/admin/(dashboard)/layout.tsx` để `/admin/login` vẫn vào được khi chưa đăng nhập.

### Cấu trúc thư mục

```
app/
  layout.tsx              Root layout: <html>/<body>, fonts, globals.css, Google Analytics
  globals.css             Tailwind v4 @theme (design tokens) + custom CSS của bản gốc
  (site)/                 Trang public — layout riêng chứa header/footer/bottom-nav/modal
    layout.tsx
    page.tsx              Trang chủ
    bai-viet/page.tsx     Danh sách bài viết (dynamic — lọc/tìm/phân trang nằm ở URL)
    bai-viet/loading.tsx  Skeleton hiện ngay khi bấm vào menu, trong lúc DB trả kết quả
    bai-viet/[slug]/page.tsx  Chi tiết bài viết (SSG qua generateStaticParams)
    huong-dan-lay-udid/   Hướng dẫn lấy UDID (nội dung từ DB)
  admin/                  CMS — layout riêng, noindex
    layout.tsx
    login/page.tsx
    (dashboard)/          Khu vực bắt buộc đăng nhập: layout + tổng quan + 3 màn quản lý
  api/                    Route Handler: upload ảnh, tìm kiếm, đếm lượt xem
components/
  analytics/              GoogleAnalytics (gtag.js)
  admin/                  LoginForm, AdminNav, ArticleForm, RichTextEditor, ArticleLinkRows, ArticleTable, CategoryManager, UdidStepManager, ImageField, RowActions…
  layout/                 SiteHeader, SiteFooter, MobileBottomNav
  home/                   HeroSection, SubscriptionSection, FeaturedPostsSection, BrandSection, CertPlanCard
  articles/               ArticleListingResults + ArticleSearchInput, article-listing-shell (tiêu đề tĩnh + skeleton), các loại card, DownloadSection, ArticleViewCounter
  ui/                     ZaloModal, SearchModal, Toast, Pagination + các nút trigger phía client
  providers/ui-provider   State dùng chung: modal Zalo, modal tìm kiếm, toast
lib/
  db/                     connect.ts (singleton) + models/ (Article, Category, UdidStep, User) + errors.ts
  data/                   Truy vấn đọc, trả về DTO thuần cho RSC
  actions/                Server Actions: auth, articles, categories, udid-steps + reorder.ts
  auth/                   password.ts (bcrypt), session.ts (JWT cookie), dal.ts (guard)
  r2/                     config.ts (allow-list, dùng chung client/server) + client.ts + upload.ts
  articles/sanitize.ts    Allow-list làm sạch HTML bài viết
  articles.ts             Tham số URL danh sách, article-links.ts, policy-pages.ts, contact.ts, format.ts, reading-time.ts, slug.ts, cn.ts
scripts/                  seed.ts + seed-data.ts + article-seed-data.ts + policy-seed-data.ts
types/                    Article, Category, CertPlan, UdidStep, AdminUser, FormState
instrumentation.ts        Mở sẵn connection MongoDB lúc server khởi động (xem "Tốc độ vào trang")
```

### Quy ước

- Server Components là mặc định. Chỉ những phần cần tương tác mới là Client Component; các section tĩnh dùng nút trigger client nhỏ (`ZaloTriggerButton`) để không phải "client hoá" cả section.
- Nội dung do CMS quản lý đi qua `lib/data/*`, không hardcode trong JSX.
- Class name gộp bằng helper `cn()` trong [lib/cn.ts](lib/cn.ts).
- Ba ô tìm kiếm có phạm vi **khác nhau một cách có chủ đích**, đừng gộp lại:

  | Vị trí                                  | Khớp trường                                             | Bài ẩn |
  | --------------------------------------- | ------------------------------------------------------- | ------ |
  | Modal ở header (`/api/articles/search`) | tiêu đề                                                 | không  |
  | Ô lọc ở `/bai-viet`                     | tiêu đề + mô tả ngắn, kết hợp pill danh mục và số trang | không  |
  | Ô lọc ở `/admin/articles`               | tiêu đề + **slug** + mô tả ngắn                         | **có** |

  Bản CMS thêm slug vì biên tập viên thường được gửi một URL, và phải thấy cả bài ẩn thì mới sửa được trang chính sách.

- Ngày và lượt xem được **format sẵn ở server** ([lib/format.ts](lib/format.ts)) bằng hàm tự viết thay vì `Intl`: các thẻ bài viết render bên trong Client Component, nên khác biệt về locale hay múi giờ giữa server và client sẽ thành hydration mismatch.
- Document của Mongoose **không serialize được** qua ranh giới RSC. Mọi truy vấn trong `lib/data/` đều `.lean()` rồi map sang DTO trong `types/` (đổi `_id` thành `id: string`).

## Backend & CMS

### Biến môi trường

Chép [.env.example](.env.example) sang `.env.local` (đã gitignore) và điền:

| Biến                                                                                           | Bắt buộc | Ghi chú                                                          |
| ---------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------- |
| `MONGODB_URI`                                                                                  | ✅       | Connection string Atlas, **không** kèm tên DB trong path         |
| `MONGODB_DB`                                                                                   | —        | Mặc định `a_pes_studio`                                          |
| `SESSION_SECRET`                                                                               | ✅       | Khoá ký JWT phiên đăng nhập. Sinh bằng `openssl rand -base64 32` |
| `NEXT_PUBLIC_GA_ID`                                                                            | —        | Xem mục [Google Analytics](#google-analytics)                    |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL` | —        | Xem mục [Upload ảnh lên R2](#upload-ảnh-lên-r2)                  |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME`                                 | —        | Chỉ dùng cho `npm run db:seed`                                   |

Đổi `SESSION_SECRET` sẽ vô hiệu hoá mọi phiên đang đăng nhập.

### Collections

| Collection   | Model                                                    | Trường                                                                                                                                                                                                         |
| ------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `articles`   | [lib/db/models/article.ts](lib/db/models/article.ts)     | `title`, `slug` (unique), `excerpt`, `coverImage`, `content` (HTML đã làm sạch), `category` (ref → `categories`), `author`, `links[]` (`icon`/`label`/`url`), `isFeatured`, `isHidden`, `views`, `publishedAt` |
| `categories` | [lib/db/models/category.ts](lib/db/models/category.ts)   | `name` (unique), `label` (chữ trên pill), `slug` (unique), `order`, `isActive`                                                                                                                                 |
| `udid_steps` | [lib/db/models/udid-step.ts](lib/db/models/udid-step.ts) | `order`, `description`, `image`                                                                                                                                                                                |
| `users`      | [lib/db/models/user.ts](lib/db/models/user.ts)           | `email` (unique), `name`, `passwordHash` (bcrypt, `select: false`), `passwordChangedAt`, `role`                                                                                                                |

`order` **không** đặt unique index: thao tác sắp xếp hoán đổi hai dòng và sẽ vi phạm index ở bước trung gian. Thay vào đó mỗi lần thêm/xoá/sắp xếp đều đánh lại `order` thành 1…N liên tục, nên số "Bước N" hiển thị luôn khớp vị trí.

Bài viết trỏ tới danh mục bằng **ObjectId** chứ không copy tên: đổi tên một danh mục sẽ cập nhật đồng loạt mọi bài viết thay vì làm chúng rơi khỏi bộ lọc. `lib/data/articles.ts` populate lại thành tên khi đọc.

Kết nối đi qua singleton [lib/db/connect.ts](lib/db/connect.ts) cache trên `globalThis` — nếu không, mỗi lần hot-reload của `next dev` sẽ mở thêm một connection pool mới. `mongoose` đã nằm sẵn trong `serverExternalPackages` mặc định của Next 16 nên không cần khai báo trong `next.config.ts`.

### Xác thực

Session không trạng thái: JWT HS256 ký bằng `SESSION_SECRET`, đặt trong cookie `apes_admin_session` (`httpOnly`, `sameSite=lax`, `secure` khi production, hạn 7 ngày).

Token mang thêm claim `passwordStamp` — chính là `users.passwordChangedAt` dạng epoch ms — và [lib/auth/dal.ts](lib/auth/dal.ts) đối chiếu nó với giá trị trong DB ở **mọi** request. Nhờ vậy đổi mật khẩu thật sự đăng xuất các thiết bị khác, thay vì chỉ đổi hash rồi để phiên cũ chạy tiếp. Thiết bị vừa thực hiện đổi được cấp lại cookie ngay nên không bị văng ra.

Đổi mật khẩu ở [/admin/tai-khoan](<app/admin/(dashboard)/tai-khoan/page.tsx>), vào bằng nút tên tài khoản trên thanh header. Form yêu cầu mật khẩu hiện tại, và ràng buộc độ dài được kiểm ở **cả hai lớp**: thuộc tính `minLength` chặn ngay trên trình duyệt, `changePasswordAction` kiểm lại trên server vì một request tự chế bỏ qua được lớp đầu.

Guard nằm ở **hai** chỗ và cả hai đều cần thiết:

1. [app/admin/(dashboard)/layout.tsx](<app/admin/(dashboard)/layout.tsx>) — chặn truy cập trang.
2. **Mỗi Server Action** tự gọi `requireAdmin()`. Server Action là endpoint độc lập, request gọi thẳng vào action **không chạy qua layout** — chỉ guard ở layout là lỗ hổng.

Form đăng nhập trả về cùng một thông báo cho "email không tồn tại" và "sai mật khẩu", đồng thời so sánh với một bcrypt hash giả khi không tìm thấy user, để không lộ email nào đã đăng ký qua nội dung lỗi lẫn thời gian phản hồi.

Chưa có màn quản lý **nhiều** user: tạo thêm admin bằng cách chạy `db:seed` với `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` khác. Mỗi admin chỉ tự đổi được mật khẩu của mình.

### Cache & revalidate

Dự án **không** bật `cacheComponents`, nên dùng mô hình cache cũ:

- Trang chủ, `/huong-dan-lay-udid` và `/bai-viet/[slug]` khai báo `export const revalidate = 300` → được prerender, tự làm mới sau 5 phút.
- `/bai-viet` **không** prerender được: nó đọc `searchParams` (`?danh-muc=…&tim=…&trang=…`) nên phải render theo từng request. Bù lại bằng streaming + skeleton, xem [Tốc độ vào trang danh sách](#tốc-độ-vào-trang-danh-sách).
- Mọi Server Action ghi dữ liệu gọi `revalidatePath()` cho trang public tương ứng **và** cho trang admin, nên nội dung sửa trong CMS lên trang public ngay, không phải chờ hết 5 phút.
- Không dùng `unstable_cache` (đã deprecated ở Next 16) và không dùng `revalidateTag` một tham số (cũng deprecated).

### Tốc độ vào trang danh sách

Bấm menu **Bài Viết & Mod** từng đứng im 1–2 giây rồi mới đổi màn. Bốn nguyên nhân, xử lý riêng từng cái:

**1. Không có trạng thái chờ.** `/bai-viet` là route dynamic, mà Next chỉ prefetch route dynamic khi có `loading.tsx`. Thiếu file đó thì trình duyệt giữ nguyên màn cũ suốt vòng request — người dùng đọc thành "bấm không ăn". [app/(site)/bai-viet/loading.tsx](<app/(site)/bai-viet/loading.tsx>) trả về skeleton; skeleton này được tải sẵn từ lúc link lọt vào viewport nên hiện ngay khi click.

**2. Cả trang chờ database.** Trang đã tách: tiêu đề và ô tìm kiếm không chạm MongoDB nên gửi đi trước, chỉ pill lọc + lưới thẻ + phân trang nằm trong `<Suspense>` và stream vào sau. `key` của boundary gồm `danh-muc|tim|trang`, nên đổi bộ lọc hay sang trang cũng hiện lại skeleton thay vì đứng yên ở kết quả cũ.

**3. Bốn round trip nối đuôi nhau.** Một lần xem danh sách trước đây phải: đọc `categories` cho pill lọc → đọc `categories` lần nữa để đổi slug thành `_id` → `countDocuments` → `find` → `populate` lấy tên danh mục. Giờ còn hai bước:

- [lib/data/categories.ts](lib/data/categories.ts) đọc **toàn bộ** collection trong một query, bọc `cache()` của React nên mọi thứ cần tới danh mục trong cùng một request (thanh lọc, tra `slug → _id`, tra `_id → tên`) dùng chung một lần đọc. Collection này chỉ vài chục dòng, lọc `isActive` trong JS rẻ hơn thêm một round trip.
- [lib/data/articles.ts](lib/data/articles.ts) bỏ `.populate()` ở các truy vấn danh sách — tên danh mục lấy từ map nói trên — và bắn `countDocuments` cùng `find` song song. Chỉ khi `?trang=` vượt quá số trang thật mới tốn thêm một query để lùi về trang cuối.

**4. Kết nối MongoDB mở ngay trong request đầu tiên.** Trên Vercel, mỗi instance mới phải bắt tay TCP + TLS + auth với Atlas trước khi chạy được query. [instrumentation.ts](instrumentation.ts) khởi động việc đó lúc server boot, không `await` để database trục trặc không làm server chết. `connectToDatabase` cache promise đang bay nên request đến giữa chừng nối vào cùng một kết nối chứ không mở thêm.

Thêm index `{ category: 1, isHidden: 1, publishedAt: -1 }` ([lib/db/models/article.ts](lib/db/models/article.ts)): index đơn trên `category` tìm được đúng dòng nhưng không trả về đúng thứ tự, nên trang lọc theo danh mục phải sort trong RAM.

Đo trên bản build production ở máy local: prefetch trả skeleton trong ~10ms và **không** chạm database; HTML của `/bai-viet` gửi tiêu đề ở byte ~1.3KB còn dữ liệu bài viết ở cuối luồng — đúng thứ tự mong muốn. Con số tuyệt đối trên Vercel sẽ khác (cold start, Atlas khác region), nhưng phần người dùng nhìn thấy đầu tiên không còn phụ thuộc vào database nữa.

Nếu sau này vẫn muốn nhanh hơn nữa, bước tiếp theo là bật `cacheComponents` (PPR) để pill lọc được prerender chung với tiêu đề thay vì stream cùng lưới thẻ. Đó là thay đổi phạm vi toàn app — `export const revalidate` phải đổi sang `cacheLife`, mọi truy vấn không cache phải nằm trong `<Suspense>` — nên hãy làm thành một task riêng, đừng gộp vào một thay đổi nhỏ. Cụm Atlas đặt cùng region với Vercel project cũng cắt được vài chục ms mỗi query mà không phải sửa dòng code nào.

### Form trong CMS

Hai điểm dễ vấp đã xử lý sẵn, đừng vô tình rollback:

- React 19 **tự reset** `<form action={...}>` không kiểm soát sau khi action chạy xong. Nếu action trả lỗi validate thì toàn bộ ô nhập bị xoá trắng. Vì vậy các action trả lại giá trị đã submit trong `FormState.values`, và input dùng `defaultValue={state.values?.x ?? …}` để lần reset đó khôi phục đúng giá trị người dùng vừa gõ.
- Nút sắp xếp/xoá của mỗi dòng nằm trong `<form>` **riêng**, là anh em (không lồng) với form sửa. Đặt `formAction={actionKhác}` lên nút submit bên trong form đang do `useActionState` quản lý thì **không chạy gì cả** — xem [components/admin/row-actions.tsx](components/admin/row-actions.tsx).

### Quản lý bài viết

Màn `/admin/articles` cho phép soạn toàn bộ nội dung: ảnh cover, tiêu đề, slug, mô tả ngắn, thân bài rich text, danh mục, các dòng liên kết tải xuống và cờ nổi bật.

**Ba trường tự động, không nhập tay:**

| Trường      | Nguồn                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| Ngày đăng   | `publishedAt`, mặc định là lúc tạo                                                                                      |
| Số phút đọc | [lib/reading-time.ts](lib/reading-time.ts) đếm chữ trong `content` ở 200 từ/phút, tính lúc render                       |
| Lượt xem    | `POST /api/articles/[id]/view` do [ArticleViewCounter](components/articles/article-view-counter.tsx) gọi từ trình duyệt |

Đếm lượt xem đặt ở client là **có chủ đích**. Đếm trong lúc render sẽ ép trang chi tiết thành dynamic, và Next prefetch link khi rê chuột — chỉ rê qua thẻ bài viết cũng thành một lượt đọc. Gọi từ trình duyệt sau khi mount giữ trang prerender và chỉ tính lượt truy cập thật; `sessionStorage` chặn F5 thổi phồng số liệu. Con số hiển thị lấy từ bản prerender nên cập nhật ở lần revalidate kế tiếp.

**Người đăng** mặc định `A-Pes Studio` ([lib/db/models/article.ts](lib/db/models/article.ts)), sửa được từng bài.

**Slug** tự sinh từ tiêu đề cho tới khi bạn gõ tay vào ô slug — từ đó nó ngừng ghi đè.

**Tìm kiếm và phân trang trong CMS** đều nằm ở query string — `/admin/articles?tim=…&trang=2`, **20 dòng mỗi trang** — và chạy trong MongoDB, nên chúng quét toàn bộ collection chứ không chỉ những dòng đang hiển thị, và một danh sách đã lọc có thể gửi cho người khác hoặc F5 mà không mất trạng thái.

- Đổi từ khoá luôn quay về trang 1; link **Xoá bộ lọc** bỏ cả `tim` lẫn `trang`.
- Ô nhập debounce 350ms rồi `router.replace` — dùng `replace` chứ không `push` để mỗi ký tự không đẻ ra một mục history; hệ quả có chủ đích là bấm **Back** sẽ rời khỏi danh sách chứ không lùi lại từng ký tự. Nút **×** trong ô để xoá nhanh.
- Các con số ở tiêu đề (tổng bài, nổi bật, bài ẩn) luôn đếm trên **toàn bộ** collection, không phải trên trang hay kết quả lọc — một danh sách đang lọc không được phép báo sai số bài thực có.

Bộ điều khiển trang là [components/ui/pagination.tsx](components/ui/pagination.tsx), dùng chung cho `/bai-viet` và `/admin/articles`. Mọi prop đều **serialisable** (không có callback `buildHref`) vì nó vừa render bên trong Client Component của trang public, vừa render thẳng trong Server Component của CMS — hàm không đi qua được ranh giới đó. Caller truyền các query param cần giữ lại, component tự dựng URL.

#### Rich text editor

Tiptap v3 ([components/admin/rich-text-editor.tsx](components/admin/rich-text-editor.tsx)) với đủ công cụ dựng lại bố cục bài mẫu: heading, danh sách, trích dẫn, khối mã, bảng, đường kẻ, liên kết và chèn ảnh. Vùng soạn thảo dùng chung class `.article-content` với trang public nên là WYSIWYG thật.

Ba điểm dễ vấp, đừng vô tình rollback:

- Nút toolbar **bắt buộc** có `onMouseDown={preventFocusLoss}`. Không có nó, `mousedown` làm editor mất focus trước khi `click` chạy, lệnh áp lên document vừa mất selection và **vài ký tự gõ ngay sau đó biến mất**.
- Trạng thái active của toolbar phải lấy qua **`useEditorState`**, không được gọi thẳng `editor.isActive(...)` trong thân render. Tiptap v3 cố ý bỏ việc re-render React theo từng transaction, nên đọc trực tiếp sẽ đóng băng toolbar ở lần render gần nhất — di chuyển con trỏ vào một heading mà nút H2 không sáng lên. `useEditorState` deep-compare kết quả selector nên chỉ re-render khi có cờ thực sự đổi.
- `Image.configure({ allowBase64: false })` cùng với việc chặn `data:` trong sanitizer: ảnh dán/kéo thả được **upload lên R2 rồi chèn URL**, không nhúng base64. Đây chính là thứ khiến payload phình quá giới hạn request.
- Nội dung đồng bộ vào một `<input type="hidden">` qua ref (không qua React state — sẽ re-render mỗi ký tự), và được ghi lại khi form `reset` để một lần lưu lỗi không nuốt mất bài đang soạn.

#### Làm sạch HTML

Thân bài render bằng `dangerouslySetInnerHTML`, nên [lib/articles/sanitize.ts](lib/articles/sanitize.ts) làm sạch **lúc ghi** theo allow-list khớp đúng khả năng của editor. Cần thiết kể cả khi chỉ admin vào được CMS: Server Action là endpoint công khai, HTML tới server là thứ nằm trong request chứ không nhất thiết do Tiptap sinh ra. Scheme chỉ nhận `http`/`https`/`mailto` — chặn luôn `javascript:` và `data:`.

Hàm này cũng bọc `<table>` trong `<div class="article-table-scroll">` để bảng rộng cuộn trong hộp của nó thay vì đẩy cả trang trượt ngang trên mobile. Seed dùng chung hàm này nên nội dung seed và nội dung soạn trong CMS luôn đồng nhất.

#### Bài ẩn & trang chính sách

Cờ `isHidden` giữ một bài **mở được bằng đường dẫn riêng nhưng không lọt vào bất kỳ danh sách công khai nào**: lưới trang chủ, `/bai-viet`, mục bài liên quan và ô tìm kiếm ở header đều lọc bỏ. Trang chi tiết của bài ẩn cũng không render khối "Bài Viết Liên Quan" — gợi ý game mod ở cuối trang điều khoản sử dụng đọc như một lỗi.

Bốn liên kết ở cột "Chính Sách & Điều Khoản" dưới footer chính là các bài dạng này:

| Trang                           | Đường dẫn                                   |
| ------------------------------- | ------------------------------------------- |
| Điều khoản sử dụng              | `/bai-viet/dieu-khoan-su-dung`              |
| Chính sách bảo mật              | `/bai-viet/chinh-sach-bao-mat`              |
| Miễn trừ trách nhiệm link ngoài | `/bai-viet/mien-tru-trach-nhiem-link-ngoai` |
| Báo cáo bản quyền (DMCA)        | `/bai-viet/bao-cao-ban-quyen-dmca`          |

Slug và nhãn nằm trong [lib/policy-pages.ts](lib/policy-pages.ts), dùng chung cho footer và seed — footer render ở **mọi** trang nên không được truy vấn database chỉ để lấy 4 đường dẫn. Đổi slug ở file này **không** đổi tên bài đã lưu trong DB; phải sửa cả hai.

Chúng thuộc danh mục `Chính sách`, được seed ở trạng thái **inactive** nên không xuất hiện thành pill lọc trên `/bai-viet`.

> Nội dung 4 trang này là **BẢN NHÁP**, mỗi trang mở đầu bằng khối cảnh báo và có các mốc `[cần bổ sung: …]`. Đây là khung mẫu, **không phải văn bản pháp lý** — cần rà soát và tham vấn pháp lý trước khi công bố.

Lọc trong `lib/data/articles.ts` dùng `isHidden: { $ne: true }` chứ không phải `false`, để các document ghi trước khi có trường này vẫn được tính là công khai.

#### Phân trang danh sách `/bai-viet`

**20 bài mỗi trang.** Bộ lọc danh mục, từ khoá và số trang đều nằm trong query string:

| Tham số    | Ý nghĩa                             | Bỏ qua khi     |
| ---------- | ----------------------------------- | -------------- |
| `danh-muc` | slug danh mục                       | xem tất cả     |
| `tim`      | từ khoá (khớp tiêu đề + mô tả ngắn) | không tìm      |
| `trang`    | số trang, 1-based                   | đang ở trang 1 |

Ví dụ: `/bai-viet?danh-muc=game-mod&trang=2`. Không tham số nào thì URL vẫn là `/bai-viet` sạch ([buildListingHref](lib/articles.ts)).

Lọc và phân trang chạy **trong MongoDB**, không phải trong trình duyệt ([getPaginatedArticles](lib/data/articles.ts)). Hệ quả: `/bai-viet` render động thay vì prerender, đổi lại mỗi lượt xem chỉ truy vấn và gửi đúng 20 dòng — nhẹ hơn bản cũ vốn tải toàn bộ danh sách rồi lọc phía client. Đo trên bản build: 61KB HTML cho một trang 20 thẻ.

Trạng thái nằm trong URL là điều kiện bắt buộc, không phải sở thích: nhờ vậy mới chia sẻ được link "trang 2", nút back hoạt động, và crawler đọc được các trang sau — phân trang chỉ chạy trong state React thì mất cả ba.

Vài quy tắc đã cài sẵn:

- Đổi danh mục hoặc từ khoá luôn **quay về trang 1** — trang 4 của tập kết quả cũ thường không tồn tại trong tập mới.
- `?trang=999` bị **kẹp về trang cuối** thay vì trả danh sách rỗng.
- Ô tìm kiếm debounce 350ms rồi `router.replace(..., { scroll: false })`: dùng `replace` để mỗi ký tự không đẻ ra một mục history, và khoá scroll vì kết quả nằm ngay dưới ô nhập.
- Slug danh mục không tồn tại → **0 kết quả**, không phải "hiện tất cả".
- Mũi tên ở đầu/cuối render thành `<span>` chứ không phải link mờ: thẻ `<a>` không đi đâu vẫn focus và bấm được bằng bàn phím.

#### Liên kết tải xuống

Mỗi bài có số dòng tuỳ ý, mỗi dòng gồm **1 trong 4 icon cố định** ([lib/article-links.ts](lib/article-links.ts) — Android, iOS, Đồ hoạ HD, Công cụ/giải nén), nhãn và URL ngoài. Icon quyết định luôn kiểu nút: Android/iOS là nút chính, hai icon còn lại là nút phụ — đúng bố cục bản gốc.

Trên trang bài viết mỗi dòng là thẻ `<a target="_blank" rel="noopener noreferrer">` mở tab mới. Bài không có liên kết nào thì khối này ẩn hẳn.

### Tối ưu payload (Vercel free)

Vercel chặn cứng body request/response của serverless function ở **4.5MB**. Các biện pháp:

- **Ảnh không bao giờ đi qua Server Action.** Upload dùng Route Handler riêng (`/api/admin/upload`) — Server Action mặc định chặn 1MB, còn Route Handler stream body. `bodySizeLimit` nâng lên 2MB trong [next.config.ts](next.config.ts) chỉ để dư chỗ cho phần chữ.
- **Thân bài chặn ở 512KB** khi lưu, và sanitizer loại bỏ `data:` URI nên không thể lén nhúng ảnh base64.
- **Truy vấn danh sách chiếu bỏ `content`** (`SUMMARY_FIELDS` trong [lib/data/articles.ts](lib/data/articles.ts)): lưới thẻ không kéo theo thân bài.
- **Danh sách bài viết phân trang trong DB**, 20 dòng mỗi lượt (xem mục trên) — payload không phình theo số bài viết.
- **Tìm kiếm gọi API theo yêu cầu** thay vì nhét chỉ mục bài viết vào payload của mọi trang; debounce 250ms + tối thiểu 2 ký tự.

Đo trên bản build hiện tại: trang nặng nhất là `/` với 112KB HTML và 60KB RSC — cách xa mốc 4.5MB.

### Upload ảnh lên R2

Ô ảnh trong CMS ([components/admin/image-field.tsx](components/admin/image-field.tsx)) nhận **cả hai**: dán URL ngoài, hoặc bấm "Tải ảnh lên R2" để chọn file. Upload xong, URL công khai được ghi thẳng vào ô URL — bấm **Lưu** mới thực sự ghi vào DB.

R2 là **tuỳ chọn theo nhóm**: thiếu bất kỳ biến nào trong 5 biến `R2_*` thì nút upload tự ẩn, ô URL vẫn dùng bình thường ([lib/r2/client.ts](lib/r2/client.ts) → `isR2Configured()`).

Điểm nhận (`POST /api/admin/upload`) là **Route Handler chứ không phải Server Action**: payload của Server Action mặc định bị chặn ở 1MB, còn Route Handler stream body nên không dính giới hạn đó. Endpoint tự kiểm tra session (trả **401 JSON**, không redirect như `requireAdmin()` — client `fetch` cần đọc được lỗi).

Ràng buộc, khai báo tại [lib/r2/config.ts](lib/r2/config.ts):

| Kiểm tra   | Giá trị                               | Lỗi trả về |
| ---------- | ------------------------------------- | ---------- |
| Đăng nhập  | bắt buộc                              | 401        |
| Thư mục    | allow-list (`udid-steps`, `articles`) | 400        |
| Định dạng  | JPG, PNG, WebP, GIF, AVIF             | 415        |
| Dung lượng | ≤ 5MB                                 | 413        |

Object key là `<folder>/<uuid>.<ext>`, trong đó **`ext` suy ra từ MIME type chứ không phải tên file** — tên file người dùng không bao giờ đi vào key, nên không thể lợi dụng để traversal hay ép sai đuôi. Key luôn mới nên object bất biến và được set `Cache-Control: immutable`.

> Ảnh cũ **không tự xoá** khi bạn thay ảnh mới, xoá một bước hay xoá một bài viết — object vẫn nằm lại trong bucket. Cần thì dọn thủ công trên Cloudflare dashboard.
>
> Khi dọn, **đừng xoá cả bucket**: đối chiếu với các URL `r2.dev` đang được tham chiếu trong `articles.coverImage`, `articles.content` và `udid_steps.image` rồi chỉ xoá phần thừa. R2 không bật versioning nên xoá nhầm là mất hẳn, và bản ghi trong DB sẽ trỏ vào ảnh hỏng.

Thêm ô ảnh ở chỗ khác: bổ sung tên thư mục vào `UPLOAD_FOLDERS` rồi dùng lại `<ImageField />`.

### Hiển thị ảnh minh hoạ bước UDID

Ảnh 7 bước là **screenshot dọc từ iPhone** (1320×2683, tỉ lệ ~0.49), nên [components/ui/image-preview.tsx](components/ui/image-preview.tsx) chỉnh chúng theo **chiều ngang**, không theo chiều cao:

- Khung ảnh trước đây cao cố định `h-72 sm:h-80` với `object-contain`. Ảnh dọc bị chỉnh vừa chiều cao 288px, còn lại **~141px bề ngang** trên điện thoại — chữ trong screenshot không đọc nổi. Nay ảnh tràn hết bề ngang thẻ (**~358px** trên iPhone 14) và chiều cao chạy theo tỉ lệ thật.
- Bấm vào ảnh mở trình xem **chiếm trọn màn hình**: nền đen, không viền không padding, ảnh `object-contain` theo đúng viewport (screenshot điện thoại gần đúng tỉ lệ màn hình nên phủ gần kín). Đóng bằng nút X, phím `Esc` hoặc bấm ra vùng nền. Trình xem khoá scroll của trang bên dưới, nếu không đóng xong người đọc sẽ bị đẩy sang chỗ khác trong bài.

Hệ quả có chủ đích: trang dài hơn trước. Ảnh dọc chiếm trọn bề ngang thì cao gấp đôi bề ngang, và đó là đánh đổi để đọc được nội dung ảnh mà không phải phóng to.

### Chưa làm

- Chưa có màn quản lý user và chưa có chỗ đổi mật khẩu.
- Ảnh hiển thị bằng thẻ `<img>` thuần, chưa qua `next/image`.
- Google Analytics hiện chạy trên cả `/admin` vì đặt ở root layout.

## Thông tin liên hệ

Số điện thoại/Zalo, Telegram và Facebook nằm trong [lib/contact.ts](lib/contact.ts) — một nguồn duy nhất, vì cùng một số xuất hiện ở modal Zalo, nút sao chép, thông báo toast dự phòng và footer.

| Kênh              | Giá trị                                     | Dùng ở đâu                       |
| ----------------- | ------------------------------------------- | -------------------------------- |
| Điện thoại / Zalo | `0974983160` (hiển thị `0974.983.160`)      | Modal Zalo, link `tel:` ở footer |
| Zalo deep link    | `https://zalo.me/0974983160`                | Nút "Mở Ứng Dụng Zalo Ngay"      |
| Telegram          | `@apes_studio` → `https://t.me/apes_studio` | Icon + dòng liên hệ ở footer     |
| Facebook          | link `facebook.com/share/…`                 | Icon ở footer                    |

Số hiển thị và số thô tách riêng: bản có dấu chấm để đọc, bản thuần chữ số cho clipboard và `tel:` / `zalo.me`.

## Google Analytics

GA4 được nạp cho mọi route qua [components/analytics/google-analytics.tsx](components/analytics/google-analytics.tsx), gắn ở cuối `<body>` trong [app/layout.tsx](app/layout.tsx).

- Dùng `next/script` với `strategy="afterInteractive"` thay vì thẻ `<script>` thô: tag nằm ngoài critical path, và Next đảm bảo chỉ nạp **một lần** dù người dùng điều hướng client-side qua lại giữa các route.
- Measurement ID mặc định là `G-E2E1JJF7YQ`, ghi đè được bằng biến môi trường `NEXT_PUBLIC_GA_ID`. Biến `NEXT_PUBLIC_*` được inline lúc **build** — đổi ID phải build lại.
- Không tự bắn `page_view` khi đổi route: phần này dựa vào **Enhanced Measurement** của GA4 (mục _Page changes based on browser history events_, bật mặc định). Nếu tắt tuỳ chọn đó trong GA thì chỉ lần tải trang đầu tiên được ghi nhận.

## Design tokens

Config Tailwind dạng JS của bản gốc được port sang `@theme` trong [app/globals.css](app/globals.css) (Tailwind v4 dùng CSS-first config). Toàn bộ giá trị khớp 1:1 với bản HTML tham chiếu (theme **dark neon**):

| Nhóm      | Token                                                         | Giá trị                                                     |
| --------- | ------------------------------------------------------------- | ----------------------------------------------------------- |
| Màu brand | `neon-primary` / `neon-accent` / `neon-dark` / `neon-muted`   | `#36D96B` / `#2FB85C` / `#0E5B2A` / `#5F7268`               |
|           | `neon-glow` / `neon-glow-heavy`                               | `rgba(54,217,107,.15)` / `rgba(54,217,107,.35)`             |
| Bề mặt    | `dark-bg` / `dark-surface` / `dark-card` / `dark-border`      | `#050505` / `#0B0F0D` / `#101614` / `rgba(255,255,255,.07)` |
| Chữ       | `txt-primary` / `txt-secondary`                               | `#F5F7F6` / `#A9B5AF`                                       |
| Bo góc    | `rounded-card` / `rounded-btn`                                | 20px / 16px                                                 |
| Đổ bóng   | `shadow-neon`, `shadow-neon-sm`, `shadow-card`, `shadow-deck` | quầng neon + bóng đen                                       |
| Font      | `font-sans` (Inter), `font-display` (Manrope)                 |                                                             |
| Animation | `animate-pulse-glow`                                          |                                                             |

Quy ước màu đi kèm bảng token (áp dụng nhất quán trên mọi trang):

- Chữ/icon **trên nền `bg-neon-primary`** dùng `text-black`, không dùng `text-white` — neon xanh sáng nên chữ đen mới đủ tương phản.
- Nút phụ, ô input, pill, nút phân trang: `bg-dark-card border border-dark-border`; khối lồng bên trong card (hộp số Zalo, tag, panel tư vấn): `bg-dark-bg`.
- Header và thanh nav mobile phủ nền `#050505` kèm `backdrop-blur`, không dùng token vì cần độ trong suốt (`/90`, `/95`).
- Trên nền tối, các màu trạng thái dùng tông nhạt: `text-amber-400/90` (cảnh báo), `text-red-400` (phủ định), `text-yellow-400` (vương miện gói VIP).
- Không dùng `shadow-xs`/`shadow-lg` cho khối tối — bóng đen trên nền đen vô hình, độ nổi khối do `border-dark-border` đảm nhiệm.

## Thay đổi thiết kế

**Thanh nav mobile**: bản gốc để `<body>` chừa `pb-20` (80px) trong khi thanh nav không có chiều cao cố định, làm lệch khoảng chừa dưới footer. Nay thanh nav dùng chiều cao cố định `h-16` và `<body>` chừa đúng `pb-16` — **sửa một trong hai thì phải sửa cả hai**.

**Nền trang**: `.tech-pitch-bg` chỉ còn hai quầng sáng radial. Lưới ô vuông 32px của bản HTML gốc (hai `linear-gradient` tile) đã được gỡ bỏ — **đừng thêm lại**.

**Hero là một "HUD deck" trải ngang**, không phải mockup điện thoại ([components/home/hero-section.tsx](components/home/hero-section.tsx)):

- Hero xếp dọc: khối chữ (badge → headline gradient → mô tả → CTA) căn giữa trong `max-w-3xl`, bên dưới là bảng HUD.
- Bảng HUD nằm **ngoài** wrapper `max-w-7xl` để tràn hết chiều rộng viewport; chỉ phần ruột bên trong mới thu về lưới `max-w-7xl`. Nếu bọc nó vào wrapper đó, hiệu ứng full-bleed sẽ mất.
- Hai đường viền neon mảnh (`h-px` gradient trong suốt → neon → trong suốt) chạy sát mép trên/dưới, cộng `border-y border-neon-primary/15`, quầng sáng ở mép trên và bốn dấu ngoặc góc (`DECK_CORNERS`).
- Ruột bảng gồm: dải trạng thái (chấm `animate-ping` + "A-Pes OS • System Online" và ba chỉ số mono `LATENCY` / `UPTIME` / `BUILD`), rồi lưới 12 cột — 5 cột thẻ mod nổi bật (có vạch sân cỏ `.mock-pitch` + thanh tiến trình), 4 cột danh sách module, 3 cột cam kết dịch vụ.
- Ba badge cam kết ("100% An toàn", "Tốc độ cao", "Hỗ trợ 24/7") trước đây nằm dưới CTA, nay là cột phải của bảng — nội dung giữ nguyên, chỉ đổi chỗ.
- Trên mobile lưới 12 cột xếp chồng thành một cột; riêng ba badge cam kết vẫn giữ 3 cột ngang (`grid-cols-3 lg:grid-cols-1`) cho đỡ dài.

## Ghi chú khi convert (Tailwind v3 CDN → v4)

Bản HTML dùng Tailwind CDN v3. Một số utility bị đổi tên ở v4; các class dưới đây đã được thay bằng **tên v4 có giá trị CSS y hệt v3**, nên giao diện không đổi:

| v3 (bản gốc)         | v4 (hiện tại)          | Giá trị                         |
| -------------------- | ---------------------- | ------------------------------- |
| `shadow-sm`          | `shadow-xs`            | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `backdrop-blur-sm`   | `backdrop-blur-xs`     | `4px`                           |
| `rounded`            | `rounded-sm`           | `0.25rem`                       |
| `flex-grow`          | `grow`                 | `flex-grow: 1`                  |
| `focus:outline-none` | `focus:outline-hidden` | ẩn outline                      |
| `bg-gradient-to-*`   | `bg-linear-to-*`       | linear-gradient                 |

Ngoài ra:

- Tailwind v4 đổi màu mặc định của `::placeholder`; `globals.css` khôi phục lại `#9ca3af` (giá trị của v3) để ô tìm kiếm giữ nguyên diện mạo.
- Font tải qua `next/font/google` (self-host) với subset `latin` + `vietnamese`. Danh sách weight giữ đúng như request Google Fonts gốc (Inter 300–800, Manrope 500/700/800) để `font-black` vẫn rơi về 800 như cũ.
- FontAwesome dùng package `@fortawesome/fontawesome-free@6.4.0` (đúng version CDN gốc), import trong root layout — icon và webfont được bundle cùng ứng dụng. **Chỉ dùng icon có trong bản Free**: bản HTML gốc có `fa-shield-check` và `fa-shield-xmark` là icon Pro nên không hiển thị gì; nay đã thay bằng `fa-shield-halved` và `fa-ban`. Kiểm tra nhanh một icon bằng `grep '\.fa-<tên>:before' node_modules/@fortawesome/fontawesome-free/css/all.min.css`.
- Các card bài viết dùng `<img>` thay vì `next/image` để giữ nguyên 100% cách ảnh co giãn/cắt xén như bản gốc (rule `@next/next/no-img-element` được tắt tại chỗ). Nếu sau này chấp nhận thay đổi nhỏ về layout ảnh, có thể migrate sang `next/image`.
- Các class `animate-in fade-in zoom-in` trên modal được giữ lại đúng như bản gốc; chúng thuộc plugin `tailwindcss-animate` chưa được cài (ở bản HTML cũng vậy) nên hiện chưa có hiệu lực.
- Các class chỉ dùng làm "hook" cho JavaScript của bản gốc (`page-view`, `nav-link`, `mob-nav-btn`, `cat-pill`, `active`) đã bỏ vì không có style đi kèm — trạng thái active nay do React quản lý.
- File `tech_mod_game_neon_landing_page.html` được giữ lại làm bản tham chiếu đối chiếu giao diện; có thể xoá khi không cần nữa.

## Việc cần làm

Nội dung seed là **placeholder**, sửa trong CMS chứ đừng sửa file seed — seed chỉ áp dụng cho database trống.

- **Liên kết tải xuống của mọi bài viết đang trống.** Bản gốc chỉ có nút hiện toast, không có URL thật, nên seed không bịa URL. Vì vậy khối "Liên Kết Tải Xuống" hiện chưa hiển thị trên bài nào — vào `/admin/articles`, mở từng bài và thêm liên kết thật.
- **Thân bài của cả 9 bài viết đang giống nhau** (bản eFootball). Đó đúng là hành vi cũ: trang chi tiết render một `<ArticleBody />` hardcode cho mọi bài. Viết lại nội dung riêng cho từng bài trong CMS.
- **4 trang chính sách ở footer là bản nháp.** Mỗi trang mở đầu bằng khối cảnh báo "chưa có hiệu lực" và có các mốc `[cần bổ sung: …]` — đây là khung mẫu, không phải văn bản pháp lý. Rà soát và bổ sung thông tin thật (pháp nhân, email tiếp nhận, thời hạn xử lý) rồi xoá khối cảnh báo trước khi công bố.
- Ảnh cover bài viết vẫn là **ảnh mock tạm** trên Unsplash. Khi có ảnh thật, bấm "Tải ảnh lên R2" ở màn tương ứng. Ảnh 7 bước UDID đã thay bằng ảnh thật trên R2.
- **Ảnh bước UDID đang nặng ~800KB mỗi tấm** (PNG 1320×2683 xuất thẳng từ iPhone), 7 bước là ~5MB. Trang chỉ tải khi cuộn tới (`loading="lazy"`) nên không chặn lần vào đầu tiên, nhưng nén lại còn WebP ~150KB trước khi upload sẽ nhanh hơn hẳn trên 4G.

## Khác biệt về hành vi (không ảnh hưởng giao diện)

- Điều hướng giữa các trang dùng `<Link>` thay cho `showPage()`. Mọi liên kết tới một section của trang chủ ("Mua Cert", "Hệ Sinh Thái", "Nổi bật") phải dùng [components/ui/section-link.tsx](components/ui/section-link.tsx), **không dùng `<Link href="/#id">` trực tiếp**: Next bỏ qua điều hướng khi URL đã mang sẵn hash đó, khiến nút không phản hồi từ lần bấm thứ hai trở đi. Các section đích mang `scroll-mt-20` để không bị header sticky che.
- Trên trang danh sách, bộ lọc danh mục và ô tìm kiếm nay **kết hợp** với nhau (bản gốc hai bộ lọc ghi đè lẫn nhau), và cả hai đều nằm trong URL cùng số trang.
- Khối phân trang của bản gốc là ba nút "1 2 3" cứng, bấm không có tác dụng. Nay là phân trang thật 20 bài/trang.
- Cả modal tìm kiếm lẫn modal tư vấn Zalo đều đóng khi bấm ra vùng nền ngoài. Riêng modal tìm kiếm còn đóng bằng nút X và phím `Esc` (bản gốc chỉ có một nút ghi chữ "ESC" và không bắt phím thật).
- Nút sao chép số Zalo dùng `navigator.clipboard` thay cho `document.execCommand('copy')` đã deprecated.
- Toast reset bộ đếm mỗi lần hiển thị.
- **Nút tải xuống nay là liên kết thật**, mở tab mới. Bản gốc chỉ hiện toast giả "đang tạo liên kết an toàn" rồi không tải gì.
- Thân bài viết dùng CSS riêng `.article-content` trong [app/globals.css](app/globals.css) thay vì class `prose` — plugin `@tailwindcss/typography` chưa được cài nên các class `prose` ở bản gốc vốn không có tác dụng. Phần ngắt dòng đặt `overflow-wrap: break-word` + `word-break: normal`: URL quá dài vẫn xuống dòng được, nhưng chữ tiếng Việt không bị cắt giữa từ như khi dùng `break-all`.
