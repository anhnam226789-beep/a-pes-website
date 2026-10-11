import Link from "next/link";
import { ZaloTriggerButton } from "@/components/ui/zalo-trigger-button";

const TRUST_BADGES = [
  { icon: "fa-solid fa-shield-halved", title: "100% An toàn", note: "Quét Malware" },
  { icon: "fa-solid fa-bolt", title: "Tốc độ cao", note: "Server riêng" },
  { icon: "fa-solid fa-headset", title: "Hỗ trợ 24/7", note: "Qua Zalo VIP" },
];

/** Telemetry readout on the deck status strip. */
const SYSTEM_METRICS = [
  { label: "LATENCY", value: "12ms" },
  { label: "UPTIME", value: "100%" },
  { label: "BUILD", value: "v2.0.0" },
];

const DEPLOY_MODULES = [
  {
    icon: "fa-solid fa-gamepad",
    iconWrapperClassName:
      "bg-neon-primary/20 text-emerald-300 ring-1 ring-neon-primary/40",
    title: "eFootball™ Menu",
    subtitle: "Auto Skill • Unlimited",
    status: "READY",
  },
  {
    icon: "fa-solid fa-palette",
    iconWrapperClassName:
      "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30",
    title: "Mod UI",
    subtitle: "Custom Interface • Optimized",
    status: "READY",
  },
  {
    icon: "fa-solid fa-certificate",
    iconWrapperClassName: "bg-teal-500/20 text-teal-200 ring-1 ring-teal-400/30",
    title: "eFootball™ Cert Management",
    subtitle: "Auto Sign IPA • No Revoke",
    status: "ACTIVE",
  },
];

/** Shared surface for the tiles sitting inside the deck. */
const DECK_TILE_CLASS =
  "rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-neon-primary/30";

/** HUD corner brackets — two borders each, one per corner of the deck. */
const DECK_CORNERS = [
  "left-0 top-0 border-l-2 border-t-2",
  "right-0 top-0 border-r-2 border-t-2",
  "left-0 bottom-0 border-l-2 border-b-2",
  "right-0 bottom-0 border-r-2 border-b-2",
];

export function HeroSection() {
  return (
    <section className="relative min-h-[78vh] md:min-h-[85vh] flex flex-col justify-center pt-10 pb-12 overflow-hidden">
      {/* Pitch subtle background lines */}
      <div className="pitch-lines"></div>
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-neon-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-neon-dark/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* ===== Headline block ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-card border border-neon-primary/30 text-xs font-semibold text-neon-primary tracking-wide">
            <span className="w-2 h-2 rounded-full bg-neon-primary animate-ping"></span>
            CERT • MOD GAME • PREMIUM TOOLS
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight sm:leading-tight lg:leading-none text-txt-primary">
            Kho{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-neon-primary to-emerald-400">
              Chứng Chỉ
            </span>{" "}
            &amp;{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-neon-primary via-emerald-300 to-teal-200">
              Game Mod
            </span>{" "}
            Chất Lượng Cao
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-txt-secondary mx-auto font-normal leading-relaxed">
            Mua Cert, tải mod eFootball™ và ứng dụng premium trên A-Pes Studio. Tận hưởng tốc độ tải cao, liên kết ngoài an toàn và cập nhật liên tục.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/bai-viet"
              className="w-full sm:w-auto px-8 py-4 rounded-btn bg-neon-primary text-black font-bold text-base hover:bg-neon-accent transition-all duration-200 shadow-neon flex items-center justify-center gap-3 group"
            >
              <span>Khám phá bài viết</span>
              <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
            </Link>
            <ZaloTriggerButton className="w-full sm:w-auto px-8 py-4 rounded-btn bg-dark-card border border-dark-border hover:border-neon-primary/50 text-txt-primary font-semibold text-base transition-all flex items-center justify-center gap-3">
              <i className="fa-solid fa-comments text-neon-primary"></i>
              <span>Liên hệ Zalo</span>
            </ZaloTriggerButton>
          </div>
        </div>
      </div>

      {/*
        ===== Full-bleed HUD deck =====
        Sits outside the `max-w-7xl` wrapper on purpose so the panel spans the
        whole viewport; only its contents are constrained back to the grid.
      */}
      <div className="relative z-10 w-full mt-12 sm:mt-16">
        {/* Top neon edge */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-neon-primary/60 to-transparent"></div>

        <div className="relative border-y border-neon-primary/15 bg-linear-to-b from-[#080D0A] via-[#0B120E] to-[#060A08] shadow-deck">
          {/* Centred glow along the top edge */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[70%] h-24 bg-neon-primary/10 blur-3xl pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Corner brackets */}
            {DECK_CORNERS.map((corner) => (
              <span
                key={corner}
                aria-hidden="true"
                className={`absolute w-5 h-5 border-neon-primary/50 pointer-events-none ${corner}`}
              ></span>
            ))}

            {/* Status strip */}
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-white/5 pb-4">
              <span className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-txt-primary uppercase">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-neon-primary opacity-75 animate-ping"></span>
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-neon-primary"></span>
                </span>
                A-Pes OS
                <span className="text-neon-primary">• System Online</span>
              </span>

              <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar font-mono text-[10px] sm:text-[11px]">
                {SYSTEM_METRICS.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <span className="text-txt-secondary tracking-[0.15em]">
                      {metric.label}
                    </span>
                    <span className="text-neon-primary font-semibold">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deck modules */}
            <div className="grid gap-4 sm:gap-5 lg:grid-cols-12 pt-5">
              {/* Featured deployment */}
              <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-neon-primary/25 bg-linear-to-br from-emerald-950 via-[#0C1712] to-black p-4 sm:p-5">
                <div className="mock-pitch absolute inset-0 opacity-30"></div>
                <div className="absolute -right-8 -bottom-10 w-36 h-36 rounded-full bg-neon-primary/20 blur-2xl"></div>

                <div className="relative space-y-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neon-primary text-black text-[10px] font-bold shadow-neon-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-black/60 animate-ping"></span>
                      HOT MOD
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/40 border border-white/10 font-mono text-[10px] text-emerald-300">
                      v2.0.0
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                      eFootball™ 2026 MOD VIP
                    </h3>
                    <p className="text-[11px] sm:text-xs text-emerald-100/70">
                      Mod UI • Unlocked Menu • Graphics 60FPS
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-txt-secondary tracking-[0.15em]">
                        ĐANG TRIỂN KHAI
                      </span>
                      <span className="text-neon-primary font-semibold">
                        88%
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[88%] rounded-full bg-linear-to-r from-neon-primary to-emerald-300 shadow-neon-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live modules */}
              <div className="lg:col-span-4 space-y-2.5">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-txt-secondary">
                  Modules
                </span>
                {DEPLOY_MODULES.map((module) => (
                  <div
                    key={module.title}
                    className={`flex items-center gap-3 px-3 py-2.5 ${DECK_TILE_CLASS}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl ${module.iconWrapperClassName} flex items-center justify-center text-sm shrink-0`}
                    >
                      <i className={module.icon}></i>
                    </div>
                    <div className="grow min-w-0">
                      <div className="text-xs font-bold text-txt-primary truncate">
                        {module.title}
                      </div>
                      <div className="text-[10px] text-txt-secondary truncate">
                        {module.subtitle}
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-neon-primary tracking-wider">
                      {module.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="lg:col-span-3 space-y-2.5">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-txt-secondary">
                  Cam kết
                </span>
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-2.5">
                  {TRUST_BADGES.map((badge) => (
                    <div
                      key={badge.title}
                      className={`flex flex-col lg:flex-row lg:items-center gap-1.5 lg:gap-3 p-3 ${DECK_TILE_CLASS}`}
                    >
                      <i
                        className={`${badge.icon} text-neon-primary text-base lg:text-lg`}
                      ></i>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-txt-primary truncate">
                          {badge.title}
                        </div>
                        <div className="text-[10px] text-txt-secondary truncate">
                          {badge.note}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom neon edge */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-neon-primary/40 to-transparent"></div>
      </div>
    </section>
  );
}
