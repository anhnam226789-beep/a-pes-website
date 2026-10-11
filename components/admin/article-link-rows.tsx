"use client";

import { useState } from "react";
import { ARTICLE_LINK_ICONS } from "@/lib/article-links";
import type { ArticleLink } from "@/types/article";
import {
  ADMIN_DANGER_BUTTON_CLASS,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_SECONDARY_BUTTON_CLASS,
} from "@/components/admin/styles";

interface LinkRow extends ArticleLink {
  /** Stable React key — the array index would reshuffle rows on delete. */
  key: string;
}

let rowCounter = 0;

function createRow(link?: ArticleLink): LinkRow {
  rowCounter += 1;
  return {
    key: `link-${rowCounter}`,
    icon: link?.icon ?? ARTICLE_LINK_ICONS[0].value,
    label: link?.label ?? "",
    url: link?.url ?? "",
  };
}

/**
 * Repeatable "download link" rows.
 *
 * Each row posts `linkIcon` / `linkLabel` / `linkUrl`; the action reads them
 * with `formData.getAll()` and zips them back together by index. Rows where
 * both label and URL are blank are dropped server-side, so the trailing empty
 * row costs nothing.
 *
 * The three fields are **controlled**, unlike the rest of the CMS. An
 * uncontrolled row is restored to the `defaultValue` it was rendered with
 * whenever the form resets, which is the state the row had when the page
 * opened — a link added since then went back to blank and an edited one went
 * back to its old value, so the next save wrote that loss into the database.
 * Keeping the row in state means what is posted is always what is on screen.
 */
export function ArticleLinkRows({
  defaultLinks,
}: {
  defaultLinks: ArticleLink[];
}) {
  const [rows, setRows] = useState<LinkRow[]>(() =>
    defaultLinks.length > 0 ? defaultLinks.map((link) => createRow(link)) : [createRow()],
  );

  function updateRow(key: string, patch: Partial<ArticleLink>): void {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className={`${ADMIN_LABEL_CLASS} mb-0`}>Liên kết tải xuống</span>
        <button
          type="button"
          onClick={() => setRows((current) => [...current, createRow()])}
          className={`${ADMIN_SECONDARY_BUTTON_CLASS} h-9 px-3 text-xs`}
        >
          <i className="fa-solid fa-plus text-xs"></i>
          <span>Thêm liên kết</span>
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-xs text-txt-secondary">
          Chưa có liên kết nào — khối tải xuống sẽ không hiển thị trên bài viết.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li
              key={row.key}
              className="grid gap-2 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_minmax(0,1.5fr)_auto]"
            >
              <select
                name="linkIcon"
                value={row.icon}
                onChange={(event) =>
                  updateRow(row.key, {
                    icon: event.target.value as ArticleLink["icon"],
                  })
                }
                aria-label="Icon liên kết"
                className={ADMIN_INPUT_CLASS}
              >
                {ARTICLE_LINK_ICONS.map((definition) => (
                  <option key={definition.value} value={definition.value}>
                    {definition.name}
                  </option>
                ))}
              </select>

              <input
                name="linkLabel"
                value={row.label}
                onChange={(event) =>
                  updateRow(row.key, { label: event.target.value })
                }
                placeholder="Tải APK Android"
                aria-label="Nhãn liên kết"
                className={ADMIN_INPUT_CLASS}
              />

              <input
                name="linkUrl"
                type="url"
                value={row.url}
                onChange={(event) =>
                  updateRow(row.key, { url: event.target.value })
                }
                placeholder="https://..."
                aria-label="Đường dẫn liên kết"
                className={ADMIN_INPUT_CLASS}
              />

              <button
                type="button"
                onClick={() =>
                  setRows((current) =>
                    current.filter((candidate) => candidate.key !== row.key),
                  )
                }
                title="Xoá liên kết"
                className={ADMIN_DANGER_BUTTON_CLASS}
              >
                <i className="fa-solid fa-trash text-xs"></i>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[11px] text-txt-secondary">
        Mỗi liên kết mở ở tab mới trên trang bài viết. Android và iOS hiển thị
        dạng nút chính, hai icon còn lại là nút phụ.
      </p>
    </div>
  );
}
