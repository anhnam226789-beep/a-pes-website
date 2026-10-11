import { UiProvider } from "@/components/providers/ui-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ZaloModal } from "@/components/ui/zalo-modal";
import { SearchModal } from "@/components/ui/search-modal";
import { Toast } from "@/components/ui/toast";

/** Chrome shared by every public page. `/admin` deliberately opts out. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <UiProvider>
      {/* pb-16 reserves exactly the height of <MobileBottomNav /> (h-16). */}
      <div className="min-h-screen flex flex-col justify-between pb-16 md:pb-0">
        <SiteHeader />

        <main id="main-content" className="grow">
          {children}
        </main>

        <SiteFooter />
      </div>

      <MobileBottomNav />

      <ZaloModal />
      <SearchModal />
      <Toast />
    </UiProvider>
  );
}
