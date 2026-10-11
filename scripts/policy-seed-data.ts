import { POLICY_PAGES } from "../lib/policy-pages";

/**
 * Seed content for the four footer policy pages.
 *
 * These are **drafts, not legal text**. Each body opens with a visible notice
 * saying so and leaves `[cần bổ sung: …]` markers wherever a real detail is
 * required (legal entity, contact address, processing times). Publishing them
 * unchanged would put placeholder terms in front of users, so the notice is
 * deliberately impossible to miss in the CMS preview.
 *
 * Only facts that are actually true of this site are stated outright: it
 * links to third-party download hosts, it runs Google Analytics 4, and Zalo
 * is the support channel.
 */
export interface PolicySeed {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
}

const DRAFT_NOTICE = `<blockquote><p><strong>Bản nháp — chưa có hiệu lực.</strong> Nội dung dưới đây là khung mẫu do quá trình khởi tạo dữ liệu sinh ra. Cần rà soát, bổ sung thông tin thực tế của A-Pes Studio và tham vấn pháp lý trước khi công bố.</p></blockquote>`;

/** Shared placeholder cover; replace per page in the CMS. */
const PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80";

export const POLICY_COVER_IMAGE = PLACEHOLDER_COVER;

const bySlug = (slug: string): string => {
  const page = POLICY_PAGES.find((candidate) => candidate.slug === slug);
  if (!page) throw new Error(`Unknown policy slug: ${slug}`);
  return page.label;
};

export const POLICY_SEED: PolicySeed[] = [
  {
    slug: "dieu-khoan-su-dung",
    title: bySlug("dieu-khoan-su-dung"),
    excerpt:
      "Các điều khoản áp dụng khi bạn truy cập và sử dụng website A-Pes Studio.",
    content: `${DRAFT_NOTICE}
<h2>1. Phạm vi áp dụng</h2>
<p>Điều khoản này áp dụng cho mọi người dùng truy cập website A-Pes Studio. Khi tiếp tục sử dụng website, bạn được xem là đã đọc và đồng ý với các nội dung dưới đây.</p>
<p>[cần bổ sung: tên pháp nhân hoặc cá nhân vận hành website, địa chỉ liên hệ chính thức]</p>

<h2>2. Nội dung trên website</h2>
<p>A-Pes Studio là chuyên trang tổng hợp thông tin về tools, ứng dụng và game mod. Website đóng vai trò <strong>tổng hợp và giới thiệu</strong>; các tệp tin được lưu trữ và phân phối bởi bên thứ ba thông qua liên kết ngoài.</p>
<p>Xem thêm tại trang <em>Miễn trừ trách nhiệm link ngoài</em>.</p>

<h2>3. Trách nhiệm của người dùng</h2>
<ul>
<li>Tự đánh giá mức độ phù hợp và rủi ro trước khi tải hoặc cài đặt bất kỳ tệp tin nào.</li>
<li>Tuân thủ pháp luật hiện hành và điều khoản của nhà phát hành phần mềm gốc.</li>
<li>Không sử dụng nội dung trên website cho mục đích vi phạm pháp luật.</li>
</ul>

<h2>4. Giới hạn trách nhiệm</h2>
<p>[cần bổ sung: phạm vi miễn trừ trách nhiệm cụ thể — nên tham vấn pháp lý, vì đây là phần chịu ràng buộc nhiều nhất]</p>

<h2>5. Thay đổi điều khoản</h2>
<p>Điều khoản có thể được cập nhật mà không cần báo trước. Phiên bản mới có hiệu lực kể từ thời điểm đăng tải trên trang này.</p>
<p>[cần bổ sung: cách thông báo cho người dùng khi có thay đổi lớn]</p>

<h2>6. Liên hệ</h2>
<p>Mọi thắc mắc về điều khoản sử dụng xin gửi qua kênh hỗ trợ Zalo được công bố trên website.</p>
<p>[cần bổ sung: email hoặc kênh liên hệ chính thức khác]</p>`,
  },
  {
    slug: "chinh-sach-bao-mat",
    title: bySlug("chinh-sach-bao-mat"),
    excerpt:
      "Cách A-Pes Studio thu thập, sử dụng và bảo vệ thông tin của người dùng.",
    content: `${DRAFT_NOTICE}
<h2>1. Thông tin được thu thập</h2>
<p>Website không yêu cầu đăng ký tài khoản để đọc nội dung. Thông tin phát sinh chủ yếu là dữ liệu truy cập ẩn danh do công cụ phân tích ghi nhận.</p>
<p>[cần bổ sung: liệt kê đầy đủ dữ liệu thu thập nếu về sau có form đăng ký, bình luận hoặc nhận tin]</p>

<h2>2. Mục đích sử dụng</h2>
<ul>
<li>Thống kê lượt truy cập và mức độ quan tâm của người dùng theo từng bài viết.</li>
<li>Cải thiện nội dung và trải nghiệm sử dụng website.</li>
</ul>

<h2>3. Cookie và công cụ phân tích</h2>
<p>Website sử dụng <strong>Google Analytics 4</strong> để đo lường lưu lượng truy cập. Công cụ này đặt cookie trên trình duyệt của bạn và có thể ghi nhận các thông tin như trang đã xem, thời gian truy cập, loại thiết bị và vị trí ở mức khu vực.</p>
<p>Bạn có thể chặn cookie trong cài đặt trình duyệt; một số chức năng có thể hoạt động không như mong đợi.</p>

<h2>4. Chia sẻ thông tin</h2>
<p>A-Pes Studio không bán dữ liệu người dùng. Dữ liệu phân tích được xử lý bởi Google theo chính sách riêng của nền tảng này.</p>
<p>[cần bổ sung: các bên thứ ba khác nếu có — dịch vụ lưu trữ, CDN, công cụ chat]</p>

<h2>5. Lưu trữ và bảo mật</h2>
<p>[cần bổ sung: thời gian lưu trữ dữ liệu và các biện pháp bảo vệ đang áp dụng]</p>

<h2>6. Quyền của người dùng</h2>
<p>[cần bổ sung: quyền truy cập, chỉnh sửa, xoá dữ liệu và cách thực hiện, đối chiếu với Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân]</p>

<h2>7. Liên hệ</h2>
<p>Yêu cầu liên quan tới dữ liệu cá nhân xin gửi qua kênh hỗ trợ Zalo được công bố trên website.</p>
<p>[cần bổ sung: email tiếp nhận yêu cầu về dữ liệu cá nhân]</p>`,
  },
  {
    slug: "mien-tru-trach-nhiem-link-ngoai",
    title: bySlug("mien-tru-trach-nhiem-link-ngoai"),
    excerpt:
      "Vai trò của A-Pes Studio đối với các liên kết tải xuống do bên thứ ba lưu trữ.",
    content: `${DRAFT_NOTICE}
<h2>1. Bản chất của các liên kết</h2>
<p>Các liên kết tải xuống trên A-Pes Studio <strong>trỏ tới dịch vụ lưu trữ của bên thứ ba</strong>. Website không lưu trữ tệp tin trên hệ thống của mình và không phải là nguồn phát hành gốc của phần mềm.</p>

<h2>2. Không kiểm soát nội dung bên thứ ba</h2>
<p>Nội dung phía sau một liên kết ngoài có thể thay đổi bất kỳ lúc nào mà A-Pes Studio không được thông báo. Chúng tôi không kiểm soát và không chịu trách nhiệm về:</p>
<ul>
<li>Tính chính xác, tính toàn vẹn hoặc độ an toàn của tệp tin tại thời điểm bạn tải.</li>
<li>Quảng cáo, chính sách bảo mật và điều khoản của website đích.</li>
<li>Thiệt hại phát sinh từ việc cài đặt hoặc sử dụng phần mềm tải qua các liên kết đó.</li>
</ul>

<h2>3. Khuyến cáo khi tải tệp</h2>
<ul>
<li>Quét virus trước khi cài đặt, kể cả với liên kết đã được đánh dấu kiểm duyệt.</li>
<li>Sao lưu dữ liệu quan trọng trước khi cài đặt bản chỉnh sửa.</li>
<li>Cân nhắc rủi ro khoá tài khoản khi dùng bản mod cho game trực tuyến.</li>
</ul>

<h2>4. Báo cáo liên kết hỏng hoặc độc hại</h2>
<p>Nếu phát hiện liên kết hỏng, chuyển hướng sai hoặc chứa mã độc, vui lòng báo qua kênh hỗ trợ Zalo để chúng tôi gỡ bỏ.</p>
<p>[cần bổ sung: cam kết thời gian xử lý sau khi nhận báo cáo]</p>`,
  },
  {
    slug: "bao-cao-ban-quyen-dmca",
    title: bySlug("bao-cao-ban-quyen-dmca"),
    excerpt:
      "Quy trình tiếp nhận và xử lý thông báo vi phạm bản quyền trên A-Pes Studio.",
    content: `${DRAFT_NOTICE}
<h2>1. Nguyên tắc xử lý</h2>
<p>A-Pes Studio tôn trọng quyền sở hữu trí tuệ. Nếu bạn là chủ sở hữu quyền hoặc đại diện được uỷ quyền và cho rằng một nội dung trên website xâm phạm quyền của mình, vui lòng gửi thông báo theo hướng dẫn dưới đây.</p>

<h2>2. Thông tin cần có trong thông báo</h2>
<ul>
<li>Thông tin liên hệ của bạn: họ tên, tổ chức, email, số điện thoại.</li>
<li>Mô tả tác phẩm được bảo hộ và căn cứ chứng minh quyền sở hữu.</li>
<li>Đường dẫn (URL) chính xác tới nội dung bị cho là vi phạm trên website này.</li>
<li>Cam kết thông tin cung cấp là chính xác và bạn có thẩm quyền gửi thông báo.</li>
</ul>
<p>Thông báo thiếu các thông tin trên có thể bị chậm xử lý.</p>

<h2>3. Quy trình xử lý</h2>
<p>Sau khi tiếp nhận thông báo hợp lệ, chúng tôi sẽ rà soát và gỡ bỏ hoặc vô hiệu hoá nội dung nếu xác định có vi phạm.</p>
<p>[cần bổ sung: cam kết thời gian phản hồi và thời gian xử lý cụ thể]</p>

<h2>4. Khiếu nại ngược</h2>
<p>[cần bổ sung: quy trình để bên bị gỡ nội dung gửi khiếu nại, và điều kiện khôi phục nội dung]</p>

<h2>5. Kênh tiếp nhận</h2>
<p>Thông báo vi phạm bản quyền xin gửi qua kênh hỗ trợ Zalo được công bố trên website.</p>
<p>[cần bổ sung: email chuyên trách tiếp nhận thông báo bản quyền]</p>`,
  },
];
