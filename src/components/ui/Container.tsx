import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow";
};

export function Container({
  children,
  className = "",
  size = "default",
}: ContainerProps) {
  const maxWidth =
    size === "narrow"
      ? "max-w-(--container-narrow)"
      : "max-w-(--container-local)";

  return (
    <div
      className={[
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        maxWidth,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}