"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  MAX_UPLOAD_LABEL,
  UPLOAD_ACCEPT_ATTRIBUTE,
  type UploadFolder,
} from "@/lib/r2/config";
import {
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_SECONDARY_BUTTON_CLASS,
} from "@/components/admin/styles";

/**
 * Image URL input with an optional "upload to R2" shortcut.
 *
 * The URL input stays **uncontrolled** so it keeps the form semantics the rest
 * of the CMS relies on: React 19 resets the form after an action, restoring
 * `defaultValue` — which the actions set to the echoed value on error and to
 * the saved value on success. An upload therefore writes straight into the DOM
 * node instead of into React state.
 */
export function ImageField({
  id,
  name = "image",
  folder,
  defaultValue = "",
  required,
  uploadEnabled,
  label = "Ảnh minh hoạ",
  previewAlt,
}: {
  id: string;
  name?: string;
  folder: UploadFolder;
  defaultValue?: string;
  required?: boolean;
  /** False when the server has no R2 credentials — URL input still works. */
  uploadEnabled: boolean;
  label?: string;
  previewAlt: string;
}) {
  const urlInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(defaultValue);
  const [syncedDefault, setSyncedDefault] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Follow the saved value when the server re-renders this row.
  if (defaultValue !== syncedDefault) {
    setSyncedDefault(defaultValue);
    setPreview(defaultValue);
  }

  // React resets the form after a successful action; the preview has to follow
  // the input back to its default or it keeps showing a stale thumbnail.
  useEffect(() => {
    const input = urlInputRef.current;
    const form = input?.form;
    if (!input || !form) return;

    const handleReset = () => {
      // The reset algorithm runs after this event is dispatched.
      setTimeout(() => setPreview(input.value), 0);
    };

    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, []);

  async function uploadFile(file: File): Promise<void> {
    setError(null);
    setIsUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      const payload: unknown = await response.json().catch(() => null);
      const message =
        typeof payload === "object" && payload !== null && "error" in payload
          ? String((payload as { error: unknown }).error)
          : null;

      if (!response.ok) {
        setError(message ?? `Tải ảnh thất bại (HTTP ${response.status}).`);
        return;
      }

      const url =
        typeof payload === "object" && payload !== null && "url" in payload
          ? String((payload as { url: unknown }).url)
          : "";

      if (!url) {
        setError("Máy chủ không trả về đường dẫn ảnh.");
        return;
      }

      if (urlInputRef.current) urlInputRef.current.value = url;
      setPreview(url);
    } catch {
      setError("Không kết nối được tới máy chủ.");
    } finally {
      setIsUploading(false);
      // Clear the picker so re-choosing the same file fires `change` again.
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={id} className={ADMIN_LABEL_CLASS}>
        {label}
      </label>

      <div className="flex gap-3">
        <div className="w-24 h-24 shrink-0 rounded-btn bg-dark-bg border border-dark-border overflow-hidden flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt={previewAlt}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <i className="fa-regular fa-image text-txt-secondary/50 text-xl"></i>
          )}
        </div>

        <div className="grow min-w-0 space-y-2">
          <input
            id={id}
            name={name}
            type="url"
            required={required}
            ref={urlInputRef}
            defaultValue={defaultValue}
            placeholder="https://..."
            onChange={(event) => setPreview(event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />

          {uploadEnabled ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className={cn(ADMIN_SECONDARY_BUTTON_CLASS, "h-9 px-3 text-xs")}
              >
                <i
                  className={cn(
                    "text-xs",
                    isUploading
                      ? "fa-solid fa-spinner fa-spin"
                      : "fa-solid fa-cloud-arrow-up",
                  )}
                ></i>
                <span>{isUploading ? "Đang tải lên…" : "Tải ảnh lên R2"}</span>
              </button>
              <span className="text-[11px] text-txt-secondary">
                hoặc dán URL · tối đa {MAX_UPLOAD_LABEL}
              </span>

              {/* No `name`, so the picker never becomes part of the submit. */}
              <input
                ref={fileInputRef}
                type="file"
                accept={UPLOAD_ACCEPT_ATTRIBUTE}
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadFile(file);
                }}
              />
            </div>
          ) : (
            <p className="text-[11px] text-txt-secondary">
              Chưa cấu hình R2 trên máy chủ — hiện chỉ dán được URL.
            </p>
          )}

          {error && (
            <p className="flex items-center gap-2 text-xs text-red-400" role="alert">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
