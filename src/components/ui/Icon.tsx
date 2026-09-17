import type { ReactNode } from "react";
import type { ServiceIconId } from "@/types";

export type IconName =
  | ServiceIconId
  | "menu"
  | "close"
  | "phone"
  | "star"
  | "check"
  | "arrow-right"
  | "chevron-down"
  | "alert"
  | "camera"
  | "map-pin"
  | "clock"
  | "chat";

const filledIcons: ReadonlySet<IconName> = new Set<IconName>(["star"]);

const paths: Record<IconName, ReactNode> = {
  drain: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
    </>
  ),
  leak: (
    <>
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
      <path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" />
    </>
  ),
  "water-heater": (
    <>
      <rect x="6" y="3" width="12" height="15" rx="3" />
      <path d="M6 8h12M12 18v3M9 21h6" />
    </>
  ),
  pipe: (
    <>
      <path d="M4 8h8a4 4 0 0 1 4 4v8" />
      <path d="M2.5 5.5v5M5.5 5.5v5M13.5 20.5h5M13.5 17.5h5" />
    </>
  ),
  fixture: (
    <>
      <path d="M4 11h10v1.5A3.5 3.5 0 0 1 10.5 16H4Z" />
      <path d="M7 11V8h6a2 2 0 0 1 2 2v2" />
      <path d="M9 16v4" />
    </>
  ),
  "sump-pump": (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M12 12v6M8 21h8" />
      <path d="M3 15c2.5-2 5 2 7.5 0S15.5 13 18 15" />
    </>
  ),
  sewer: (
    <>
      <path d="M3 9c3-3 6 3 9 0s6 3 9 0" />
      <path d="M3 15c3-3 6 3 9 0s6 3 9 0" />
    </>
  ),
  wrench: (
    <path d="M15.6 3a5 5 0 0 0-4.7 6.8l-7.1 7.1 2.3 2.3 7.1-7.1A5 5 0 0 0 20.5 8l-2.6 1.3L16 7.2 17.9 4.6A5 5 0 0 0 15.6 3Z" />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  phone: (
    <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" />
  ),
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />,
  check: <path d="m5 13 4 4L19 7" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  alert: (
    <>
      <path d="M12 4 2.5 20h19L12 4Z" />
      <path d="M12 10v4M12 17.5h.01" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4Z" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v11H9l-5 4V5Z" />
      <path d="M8.5 9.5h7M8.5 12.5h4" />
    </>
  ),
};

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className = "h-6 w-6" }: IconProps) {
  const filled = filledIcons.has(name);

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
