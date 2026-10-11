import { cn } from "@/lib/cn";
import { ZaloTriggerButton } from "@/components/ui/zalo-trigger-button";
import type { CertPlan } from "@/types/cert-plan";

export function CertPlanCard({ plan }: { plan: CertPlan }) {
  const isHighlighted = Boolean(plan.highlighted);

  return (
    <div
      className={cn(
        "glass-card rounded-card p-6 flex flex-col justify-between relative",
        isHighlighted
          ? "border-2 border-neon-primary shadow-neon transform md:-translate-y-2 bg-linear-to-b from-[#101614] to-[#0d1f14]"
          : "hover:border-neon-primary/40 transition-all duration-300 group",
      )}
    >
      {isHighlighted && plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-neon-primary text-black text-xs font-black tracking-wider uppercase shadow-md">
          {plan.badge}
        </div>
      )}

      <div className={cn("space-y-4", isHighlighted && "pt-2")}>
        <div
          className={cn(
            "w-12 h-12 rounded-btn flex items-center justify-center text-xl",
            isHighlighted
              ? "bg-neon-primary/20 border border-neon-primary text-neon-primary"
              : cn(
                  "bg-dark-bg border border-dark-border",
                  plan.iconToneClassName,
                ),
          )}
        >
          <i
            className={cn(
              plan.icon,
              "fa-fw",
              isHighlighted ? "text-neon-primary" : plan.iconToneClassName,
            )}
          ></i>
        </div>

        <div>
          <h3 className="text-lg font-bold text-txt-primary">{plan.title}</h3>
          <p className="text-xs text-txt-secondary">{plan.subtitle}</p>
        </div>

        <div
          className={cn(
            "py-2 border-y",
            isHighlighted ? "border-neon-primary/30" : "border-dark-border",
          )}
        >
          <span className="text-2xl font-extrabold text-neon-primary">
            {plan.price}
          </span>
          <span className="text-xs text-txt-secondary">{plan.period}</span>
        </div>

        <ul
          className={cn(
            "space-y-2 text-xs",
            isHighlighted ? "text-txt-primary" : "text-txt-secondary",
          )}
        >
          {plan.features.map((feature) => (
            <li
              key={feature.text}
              className={cn("flex items-start gap-2", feature.className)}
            >
              {/* fa-fw keeps every bullet on the same text column, even when a row wraps. */}
              <i
                className={cn(
                  feature.icon,
                  "fa-fw shrink-0 leading-4",
                  feature.iconClassName,
                )}
              ></i>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <ZaloTriggerButton
        packageName={`${plan.zaloPackage} - ${plan.price}`}
        className={cn(
          "mt-6 w-full py-3 rounded-btn text-sm transition-all flex items-center justify-center gap-2",
          isHighlighted
            ? "bg-neon-primary text-black font-bold hover:bg-neon-accent shadow-neon-sm"
            : "bg-gradient-to-r from-neon-primary/10 via-neon-primary/5 to-[#232e3d] border border-neon-primary/40 hover:border-neon-primary hover:text-neon-primary text-neon-primary/90 font-semibold shadow-neon-sm",
        )}
      >
        <span>Mua ngay qua Zalo</span>
        <i
          className={cn(
            isHighlighted ? "fa-solid fa-bolt" : "fa-solid fa-angle-right",
            "text-xs",
          )}
        ></i>
      </ZaloTriggerButton>
    </div>
  );
}
