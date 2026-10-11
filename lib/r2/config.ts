/** Folders an upload is allowed to land in — anything else is rejected. */
export const UPLOAD_FOLDERS = ["udid-steps", "articles"] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export function isUploadFolder(value: unknown): value is UploadFolder {
  return (
    typeof value === "string" &&
    (UPLOAD_FOLDERS as readonly string[]).includes(value)
  );
}

/**
 * Accepted image types, mapped to the extension used in the object key.
 *
 * The extension comes from the sniffed MIME type rather than the uploaded
 * file name so a crafted name can never decide the key.
 */
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const MAX_UPLOAD_LABEL = "5MB";

/** `accept` attribute for the file picker, kept in sync with the allow-list. */
export const UPLOAD_ACCEPT_ATTRIBUTE = Object.keys(ALLOWED_IMAGE_TYPES).join(",");
