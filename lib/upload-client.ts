import type { UploadFolder } from "@/lib/r2/config";

export type ClientUploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Browser-side wrapper around `POST /api/admin/upload`.
 *
 * Shared by the cover-image field and the rich text editor so both report
 * the same errors and both go through the endpoint that keeps images out of
 * the Server Action payload.
 */
export async function uploadImage(
  file: File,
  folder: UploadFolder,
): Promise<ClientUploadResult> {
  try {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);

    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const payload: unknown = await response.json().catch(() => null);

    const read = (key: string): string | null => {
      if (typeof payload !== "object" || payload === null || !(key in payload)) {
        return null;
      }
      const value = (payload as Record<string, unknown>)[key];
      return typeof value === "string" ? value : null;
    };

    if (!response.ok) {
      return {
        ok: false,
        error: read("error") ?? `Tải ảnh thất bại (HTTP ${response.status}).`,
      };
    }

    const url = read("url");
    if (!url) return { ok: false, error: "Máy chủ không trả về đường dẫn ảnh." };

    return { ok: true, url };
  } catch {
    return { ok: false, error: "Không kết nối được tới máy chủ." };
  }
}
