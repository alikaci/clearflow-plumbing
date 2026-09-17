import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "blue" | "orange";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "border border-border bg-surface-muted text-muted",
  blue: "bg-blue text-white",
  orange: "bg-orange text-navy",
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        variantClasses[variant],
      ].join(" ")}
    >
      {children}
    </span>
  );
}