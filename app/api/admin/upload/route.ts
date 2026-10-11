import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/dal";
import { isUploadFolder } from "@/lib/r2/config";
import { uploadImageToR2 } from "@/lib/r2/upload";

/**
 * Image upload endpoint for the CMS.
 *
 * A Route Handler rather than a Server Action on purpose: Server Action
 * payloads are capped at 1MB by default, while a Route Handler streams the
 * request body without that limit.
 *
 * Uses `getCurrentUser()` instead of `requireAdmin()` because this answers
 * `fetch`, and a redirect to the login page would surface to the client as an
 * opaque HTML response instead of a readable 401.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." },
      { status: 401 },
    );
  }

  const formData = await request.formData();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Thiếu tệp tải lên." }, { status: 400 });
  }

  const folder = formData.get("folder");
  if (!isUploadFolder(folder)) {
    return NextResponse.json(
      { error: "Thư mục tải lên không hợp lệ." },
      { status: 400 },
    );
  }

  const result = await uploadImageToR2(file, folder);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ url: result.url });
}
