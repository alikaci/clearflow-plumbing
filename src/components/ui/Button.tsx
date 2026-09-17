import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className">;

type NativeButtonProps = CommonProps & {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-orange text-navy hover:opacity-90",
  secondary: "bg-navy text-white hover:opacity-90",
  outline:
    "border border-border bg-white text-text hover:border-blue hover:text-blue",
  ghost: "text-blue hover:bg-blue-light",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-6 text-base",
};

function buildClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  className: string | undefined,
): string {
  return [
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonProps) {
  if ("href" in props && props.href !== undefined) {
    const { children, href, variant, size, fullWidth, className, ...anchorProps } =
      props;
    return (
      <Link
        href={href}
        className={buildClasses(variant ?? "primary", size ?? "md", fullWidth ?? false, className)}
        {...anchorProps}
      >
        {children}
      </Link>
    );
  }

  const { children, variant, size, fullWidth, className, ...buttonProps } = props;
  return (
    <button
      type="button"
      className={`${buildClasses(variant ?? "primary", size ?? "md", fullWidth ?? false, className)} disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}