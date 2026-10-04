import type { ReactNode } from "react";

type SectionSurface = "default" | "muted" | "blue" | "dark";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /**
   * Optional programmatic focus target. A fragment link scrolls to `id` but the
   * browser only moves focus when the target is focusable, so an anchor that
   * receives keyboard focus after activation needs `tabIndex={-1}`.
   */
  tabIndex?: number;
  surface?: SectionSurface;
  ariaLabel?: string;
  labelledBy?: string;
};

const surfaceClasses: Record<SectionSurface, string> = {
  default: "",
  muted: "bg-surface-muted",
  blue: "bg-blue-light",
  dark: "bg-navy text-white",
};

export function Section({
  children,
  className = "",
  id,
  tabIndex,
  surface = "default",
  ariaLabel,
  labelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      className={[surfaceClasses[surface], "py-14 md:py-20", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}
