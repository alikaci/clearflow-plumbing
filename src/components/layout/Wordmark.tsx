import Link from "next/link";
import { business } from "@/config/business";

type WordmarkProps = {
  variant?: "light" | "dark";
};

export function Wordmark({ variant = "light" }: WordmarkProps) {
  const primary =
    variant === "dark" ? "text-white" : "text-navy";
  const secondary =
    variant === "dark" ? "text-footer-muted" : "text-muted";

  return (
    <Link
      href="/"
 aria-label={`${business.name}-Home`}
      className="inline-flex flex-col leading-none"
    >
      <span className={`text-xl font-bold tracking-tight ${primary}`}>
        {business.shortName}
      </span>
      <span
        className={`mt-1 text-[0.625rem] font-semibold tracking-[0.28em] ${secondary}`}
      >
        PLUMBING CO.
      </span>
    </Link>
  );
}