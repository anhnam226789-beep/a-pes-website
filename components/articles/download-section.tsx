import { cn } from "@/lib/cn";
import { getArticleLinkIcon } from "@/lib/article-links";
import type { ArticleLink } from "@/types/article";
import { ZaloTriggerButton } from "@/components/ui/zalo-trigger-button";

const PRIMARY_BUTTON_CLASS =
  "w-full h-12 rounded-btn bg-neon-primary text-black font-bold text-sm hover:bg-neon-accent transition-all shadow-neon-sm flex items-center justify-between px-5 group";

const SECONDARY_BUTTON_CLASS =
  "w-full h-12 rounded-btn bg-dark-bg border border-neon-primary/40 hover:bg-neon-primary/10 text-txt-primary hover:text-neon-primary font-semibold text-sm transition-all flex items-center justify-between px-5";

/**
 * "Liên Kết Tải Xuống" block.
 *
 * Rows come from the article's `links` array in MongoDB. The icon is one of
 * the four fixed choices in `lib/article-links.ts`, which also decides
 * whether the row renders as a primary or secondary button.
 *
 * Every row is a real anchor opening in a new tab — the previous version was
 * a button that only raised a toast.
 */
export function DownloadSection({ links }: { links: ArticleLink[] }) {
  if (links.length === 0) return null;

  return (
    <section id="download-section" className="pt-6">
      <div className="glass-card rounded-[24px] p-6 sm:p-8 border-2 border-neon-primary/40 shadow-neon space-y-6">
        <div className="flex items-center gap-3 border-b border-dark-border pb-4">
          <div className="w-10 h-10 rounded-btn bg-neon-primary text-black flex items-center justify-center text-xl font-bold">
            <i className="fa-solid fa-download"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-txt-primary">
              Liên Kết Tải Xuống Chi Tiết
            </h3>
            <p className="text-xs text-neon-primary font-medium">
              Link đã được kiểm duyệt an toàn 100%
            </p>
          </div>
        </div>

        {/* Download Buttons Stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {links.map((link) => {
            const definition = getArticleLinkIcon(link.icon);
            const isPrimary = definition.variant === "primary";

            return (
              <a
                key={`${link.icon}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  isPrimary ? PRIMARY_BUTTON_CLASS : SECONDARY_BUTTON_CLASS,
                )}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <i
                    className={cn(
                      definition.icon,
                      "text-base shrink-0",
                      // Brand tint only reads on the dark secondary button.
                      !isPrimary && definition.iconClassName,
                    )}
                  ></i>
                  <span className="truncate">{link.label}</span>
                </span>
                {isPrimary ? (
                  <i className="fa-solid fa-arrow-up-right-from-square text-xs shrink-0 group-hover:translate-x-0.5 transition-transform"></i>
                ) : (
                  <i className="fa-solid fa-arrow-up-right-from-square text-xs shrink-0"></i>
                )}
              </a>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-txt-secondary">
            Gặp sự cố link tải?{" "}
            <ZaloTriggerButton
              packageName="Báo lỗi link tải"
              className="text-neon-primary font-semibold underline"
            >
              Báo lỗi cho Admin qua Zalo
            </ZaloTriggerButton>
          </p>
        </div>
      </div>
    </section>
  );
}
