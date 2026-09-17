import type { ReactNode } from "react";

type SectionSurface = "default" | "muted" | "blue" | "dark";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
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
  surface = "default",
  ariaLabel,
  labelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
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
