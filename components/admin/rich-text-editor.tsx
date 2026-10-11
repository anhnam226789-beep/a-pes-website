"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table/kit";
import { cn } from "@/lib/cn";
import { uploadImage } from "@/lib/upload-client";
import { UPLOAD_ACCEPT_ATTRIBUTE } from "@/lib/r2/config";
import { ADMIN_LABEL_CLASS } from "@/components/admin/styles";

const UPLOAD_FOLDER = "articles";

interface ToolbarButton {
  icon: string;
  title: string;
  run: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
}

/** Per-button flags, keyed by `title` (unique across every group). */
interface ToolbarFlags {
  buttons: Record<string, { isActive: boolean; isDisabled: boolean }>;
  isLinkActive: boolean;
  isInTable: boolean;
}

/** Enough tooling to reproduce the reference article layout. */
const TOOLBAR_GROUPS: ToolbarButton[][] = [
  [
    {
      icon: "fa-solid fa-rotate-left",
      title: "Hoàn tác",
      run: (editor) => editor.chain().focus().undo().run(),
      isDisabled: (editor) => !editor.can().undo(),
    },
    {
      icon: "fa-solid fa-rotate-right",
      title: "Làm lại",
      run: (editor) => editor.chain().focus().redo().run(),
      isDisabled: (editor) => !editor.can().redo(),
    },
  ],
  [
    {
      icon: "fa-solid fa-bold",
      title: "Đậm",
      run: (editor) => editor.chain().focus().toggleBold().run(),
      isActive: (editor) => editor.isActive("bold"),
    },
    {
      icon: "fa-solid fa-italic",
      title: "Nghiêng",
      run: (editor) => editor.chain().focus().toggleItalic().run(),
      isActive: (editor) => editor.isActive("italic"),
    },
    {
      icon: "fa-solid fa-underline",
      title: "Gạch chân",
      run: (editor) => editor.chain().focus().toggleUnderline().run(),
      isActive: (editor) => editor.isActive("underline"),
    },
    {
      icon: "fa-solid fa-strikethrough",
      title: "Gạch ngang",
      run: (editor) => editor.chain().focus().toggleStrike().run(),
      isActive: (editor) => editor.isActive("strike"),
    },
    {
      icon: "fa-solid fa-terminal",
      title: "Mã inline",
      run: (editor) => editor.chain().focus().toggleCode().run(),
      isActive: (editor) => editor.isActive("code"),
    },
  ],
  [
    {
      icon: "fa-solid fa-heading",
      title: "Tiêu đề lớn (H2)",
      run: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: "fa-solid fa-h",
      title: "Tiêu đề nhỏ (H3)",
      run: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 3 }),
    },
    {
      icon: "fa-solid fa-paragraph",
      title: "Đoạn văn",
      run: (editor) => editor.chain().focus().setParagraph().run(),
      isActive: (editor) => editor.isActive("paragraph"),
    },
  ],
  [
    {
      icon: "fa-solid fa-list-ul",
      title: "Danh sách gạch đầu dòng",
      run: (editor) => editor.chain().focus().toggleBulletList().run(),
      isActive: (editor) => editor.isActive("bulletList"),
    },
    {
      icon: "fa-solid fa-list-ol",
      title: "Danh sách đánh số",
      run: (editor) => editor.chain().focus().toggleOrderedList().run(),
      isActive: (editor) => editor.isActive("orderedList"),
    },
  ],
  [
    {
      icon: "fa-solid fa-quote-left",
      title: "Trích dẫn",
      run: (editor) => editor.chain().focus().toggleBlockquote().run(),
      isActive: (editor) => editor.isActive("blockquote"),
    },
    {
      icon: "fa-solid fa-code",
      title: "Khối mã",
      run: (editor) => editor.chain().focus().toggleCodeBlock().run(),
      isActive: (editor) => editor.isActive("codeBlock"),
    },
    {
      icon: "fa-solid fa-minus",
      title: "Đường kẻ ngang",
      run: (editor) => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      icon: "fa-solid fa-table",
      title: "Chèn bảng 2 cột",
      run: (editor) =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
          .run(),
    },
  ],
];

/** Extra controls, only useful while the caret sits inside a table. */
const TABLE_BUTTONS: ToolbarButton[] = [
  {
    icon: "fa-solid fa-plus",
    title: "Thêm dòng",
    run: (editor) => editor.chain().focus().addRowAfter().run(),
  },
  {
    icon: "fa-solid fa-table-columns",
    title: "Thêm cột",
    run: (editor) => editor.chain().focus().addColumnAfter().run(),
  },
  {
    icon: "fa-solid fa-delete-left",
    title: "Xoá dòng",
    run: (editor) => editor.chain().focus().deleteRow().run(),
  },
  {
    icon: "fa-solid fa-eraser",
    title: "Xoá cột",
    run: (editor) => editor.chain().focus().deleteColumn().run(),
  },
  {
    icon: "fa-solid fa-trash",
    title: "Xoá bảng",
    run: (editor) => editor.chain().focus().deleteTable().run(),
  },
];

/** Every button on the toolbar, in one list, so flags can be computed once. */
const ALL_TOOLBAR_BUTTONS: ToolbarButton[] = [
  ...TOOLBAR_GROUPS.flat(),
  ...TABLE_BUTTONS,
];

function readToolbarFlags(editor: Editor): ToolbarFlags {
  const buttons: ToolbarFlags["buttons"] = {};

  for (const button of ALL_TOOLBAR_BUTTONS) {
    buttons[button.title] = {
      isActive: button.isActive?.(editor) ?? false,
      isDisabled: button.isDisabled?.(editor) ?? false,
    };
  }

  return {
    buttons,
    isLinkActive: editor.isActive("link"),
    isInTable: editor.isActive("table"),
  };
}

export function RichTextEditor({
  name = "content",
  defaultValue = "",
  uploadEnabled,
}: {
  name?: string;
  defaultValue?: string;
  uploadEnabled: boolean;
}) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // The body as it was when this editor mounted — see the hidden input below.
  const [mountedValue] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    // Required in the App Router: rendering the editor during SSR would not
    // match what the browser produces on hydration.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      // `allowBase64` stays off: a pasted data-URI image would be inlined
      // into the body and is exactly what pushes a save past the request
      // size limit. Images go to R2 and come back as a URL.
      Image.configure({ allowBase64: false }),
      TableKit.configure({ table: { resizable: false } }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "article-content admin-editor-surface focus:outline-hidden",
      },
      handlePaste: (_view, event) => handleImageEvent(event.clipboardData),
      handleDrop: (_view, event) => handleImageEvent(event.dataTransfer),
    },
    onUpdate: ({ editor: instance }) => {
      // Write straight to the DOM node instead of through React state: this
      // fires on every keystroke and a re-render per character would be felt.
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = instance.getHTML();
      }
    },
  });

  /**
   * Tiptap v3 deliberately stops re-rendering React on every transaction, so
   * reading `editor.isActive(...)` straight in the render body freezes the
   * toolbar at whatever it was when the component last rendered — moving the
   * caret would not light up "Đậm" or "H2". `useEditorState` subscribes to
   * exactly the flags the toolbar draws and re-renders only when one flips
   * (it deep-compares the selector result).
   */
  const flags = useEditorState({
    editor,
    selector: ({ editor: instance }) =>
      instance ? readToolbarFlags(instance) : null,
  });

  const insertImage = useCallback(
    async (file: File) => {
      setError(null);
      setIsUploading(true);

      const result = await uploadImage(file, UPLOAD_FOLDER);

      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (!result.ok) {
        setError(result.error);
        return;
      }

      editor?.chain().focus().setImage({ src: result.url }).run();
      if (hiddenInputRef.current && editor) {
        hiddenInputRef.current.value = editor.getHTML();
      }
    },
    [editor],
  );

  /**
   * Intercepts pasted/dropped image files and routes them through R2.
   * Returning true tells ProseMirror the event is handled, which stops its
   * default behaviour of embedding the file.
   */
  function handleImageEvent(transfer: DataTransfer | null): boolean {
    const file = Array.from(transfer?.files ?? []).find((candidate) =>
      candidate.type.startsWith("image/"),
    );
    if (!file || !uploadEnabled) return false;

    void insertImage(file);
    return true;
  }

  /**
   * Keeps the posted body in step with what the editor actually shows.
   *
   * `submit` runs first: `onUpdate` covers ordinary typing, but it does not
   * fire for a transaction that leaves the document untouched, and it can lag
   * behind an IME composition that is still open when the save button is
   * pressed. Reading the editor once more as the form is submitted makes the
   * posted value the visible one in every case. The listener sits on the form
   * itself, so it runs before React — which listens on the root container —
   * builds the FormData.
   *
   * `reset` is a fallback: the CMS forms cancel the reset React 19 fires after
   * an action (see `keepFormValues`), but should one ever go through, the
   * hidden field would drop back to the mounted body while the editor still
   * displays the new one. Re-syncing keeps them from diverging.
   */
  useEffect(() => {
    const input = hiddenInputRef.current;
    const form = input?.form;
    if (!input || !form || !editor) return;

    const handleSubmit = () => {
      input.value = editor.getHTML();
    };

    const handleReset = () => {
      // The reset algorithm runs after this event is dispatched.
      setTimeout(() => {
        input.value = editor.getHTML();
      }, 0);
    };

    form.addEventListener("submit", handleSubmit);
    form.addEventListener("reset", handleReset);

    return () => {
      form.removeEventListener("submit", handleSubmit);
      form.removeEventListener("reset", handleReset);
    };
  }, [editor]);

  function setLink(): void {
    if (!editor) return;

    const previous = editor.getAttributes("link").href as string | undefined;
    const input = window.prompt("Đường dẫn (bỏ trống để gỡ liên kết):", previous ?? "");
    if (input === null) return;

    const href = input.trim();
    if (!href) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  return (
    <div>
      <span className={ADMIN_LABEL_CLASS}>Nội dung bài viết</span>

      {/* `mountedValue`, not `defaultValue`: a hidden input has no dirty flag,
          so its value follows its `value` attribute. Re-rendering this
          component with a fresher `defaultValue` — which happens as soon as a
          save revalidates the page — would overwrite the body `onUpdate` had
          just written, silently posting the previous revision on the next
          save. Pinning the attribute to what it mounted with leaves the field
          under the editor's control alone. */}
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        defaultValue={mountedValue}
      />

      <div className="rounded-btn border border-dark-border bg-dark-bg overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-dark-border bg-dark-card">
          {TOOLBAR_GROUPS.map((group, groupIndex) => (
            <div
              key={group[0].title}
              className={cn(
                "flex items-center gap-1",
                groupIndex > 0 &&
                  "pl-1 ml-1 border-l border-dark-border",
              )}
            >
              {group.map((button) => (
                <ToolbarIconButton
                  key={button.title}
                  button={button}
                  editor={editor}
                  flags={flags}
                />
              ))}
            </div>
          ))}

          <div className="flex items-center gap-1 pl-1 ml-1 border-l border-dark-border">
            <button
              type="button"
              title="Chèn / sửa liên kết"
              onMouseDown={preventFocusLoss}
              onClick={setLink}
              className={toolbarButtonClass(flags?.isLinkActive ?? false)}
            >
              <i className="fa-solid fa-link text-xs"></i>
            </button>

            {uploadEnabled && (
              <button
                type="button"
                title="Chèn ảnh vào bài viết"
                disabled={isUploading}
                onMouseDown={preventFocusLoss}
                onClick={() => fileInputRef.current?.click()}
                className={toolbarButtonClass(false)}
              >
                <i
                  className={cn(
                    "text-xs",
                    isUploading
                      ? "fa-solid fa-spinner fa-spin"
                      : "fa-solid fa-image",
                  )}
                ></i>
              </button>
            )}
          </div>
        </div>

        {flags?.isInTable && (
          <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-dark-border bg-dark-card/60">
            <span className="text-[11px] text-txt-secondary me-1">Bảng:</span>
            {TABLE_BUTTONS.map((button) => (
              <ToolbarIconButton
                key={button.title}
                button={button}
                editor={editor}
                flags={flags}
              />
            ))}
          </div>
        )}

        <EditorContent editor={editor} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={UPLOAD_ACCEPT_ATTRIBUTE}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void insertImage(file);
        }}
      />

      <p className="mt-1.5 text-[11px] text-txt-secondary">
        {uploadEnabled
          ? "Dán hoặc kéo thả ảnh thẳng vào bài — ảnh được tải lên R2, không nhúng base64."
          : "Chưa cấu hình R2 — chỉ chèn được ảnh bằng URL."}
      </p>

      {error && (
        <p className="mt-1.5 flex items-center gap-2 text-xs text-red-400" role="alert">
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/**
 * Keeps the caret in the editor when a toolbar button is pressed.
 *
 * `mousedown` on a button blurs the editor before `click` fires, so the
 * command runs against a document that has just lost its selection — the
 * first characters typed afterwards land outside the editor and disappear.
 * Cancelling the default mousedown means focus never leaves in the first
 * place. Every toolbar control needs this.
 */
function preventFocusLoss(event: React.MouseEvent): void {
  event.preventDefault();
}

function toolbarButtonClass(isActive: boolean): string {
  return cn(
    "w-8 h-8 rounded-btn flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
    isActive
      ? "bg-neon-primary text-black"
      : "text-txt-secondary hover:text-txt-primary hover:bg-dark-bg",
  );
}

function ToolbarIconButton({
  button,
  editor,
  flags,
}: {
  button: ToolbarButton;
  editor: Editor | null;
  /** Null until the editor has mounted. */
  flags: ToolbarFlags | null;
}) {
  if (!editor) return null;

  const state = flags?.buttons[button.title];

  return (
    <button
      type="button"
      title={button.title}
      disabled={state?.isDisabled ?? false}
      onMouseDown={preventFocusLoss}
      onClick={() => button.run(editor)}
      className={toolbarButtonClass(state?.isActive ?? false)}
    >
      <i className={cn(button.icon, "text-xs")}></i>
    </button>
  );
}
