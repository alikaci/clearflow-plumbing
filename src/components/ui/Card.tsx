import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
};

export function Card({
  children,
  className = "",
  elevated = false,
}: CardProps) {
  return (
    <div
      className={[
        "rounded-xl border border-border bg-surface p-6",
        elevated ? "shadow-sm" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}