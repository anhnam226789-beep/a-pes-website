import "server-only";

import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2Config } from "@/lib/r2/client";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
  type UploadFolder,
} from "@/lib/r2/config";

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; status: number; error: string };

/**
 * Validates and stores one image in R2.
 *
 * The object key is `<folder>/<uuid>.<ext>` — the uploaded file name never
 * reaches the key, so it cannot be used for traversal or to force an
 * extension that disagrees with the content type.
 */
export async function uploadImageToR2(
  file: File,
  folder: UploadFolder,
): Promise<UploadResult> {
  const config = getR2Config();
  if (!config) {
    return {
      ok: false,
      status: 503,
      error: "Chưa cấu hình Cloudflare R2 trên máy chủ.",
    };
  }

  const extension = ALLOWED_IMAGE_TYPES[file.type];
  if (!extension) {
    return {
      ok: false,
      status: 415,
      error: `Định dạng không hỗ trợ (${file.type || "không xác định"}). Chỉ nhận JPG, PNG, WebP, GIF, AVIF.`,
    };
  }

  if (file.size === 0) {
    return { ok: false, status: 400, error: "Tệp rỗng." };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      status: 413,
      error: `Ảnh vượt quá ${MAX_UPLOAD_LABEL}.`,
    };
  }

  const key = `${folder}/${randomUUID()}.${extension}`;

  await getR2Client(config).send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      // Objects are immutable: a new upload always gets a new key, so the
      // public URL can be cached indefinitely.
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return { ok: true, url: `${config.publicBaseUrl}/${key}` };
}
