import type { ReactElement } from "react";
import type { ServiceIconId, ServiceSummary } from "@/types";
import { Button } from "@/components/ui/Button";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const serviceIcons: Record<ServiceIconId, ReactElement> = {
  drain: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
    </svg>
  ),
  leak: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...strokeProps}>
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
      <path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" />
    </svg>
  ),
  "water-heater": (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...strokeProps}>
      <rect x="6" y="3" width="12" height="15" rx="3" />
      <path d="M6 8h12M12 18v3M9 21h6" />
    </svg>
  ),
  pipe: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...strokeProps}>
      <path d="M4 8h8a4 4 0 0 1 4 4v8" />
      <path d="M2.5 5.5v5M5.5 5.5v5M13.5 20.5h5M13.5 17.5h5" />
    </svg>
  ),
  fixture: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...strokeProps}>
      <path d="M4 11h10v1.5A3.5 3.5 0 0 1 10.5 16H4Z" />
      <path d="M7 11V8h6a2 2 0 0 1 2 2v2" />
      <path d="M9 16v4" />
    </svg>
  ),
  "sump-pump": (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...strokeProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M12 12v6M8 21h8" />
      <path d="M3 15c2.5-2 5 2 7.5 0S15.5 13 18 15" />
    </svg>
  ),
  sewer: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...strokeProps}>
      <path d="M3 9c3-3 6 3 9 0s6 3 9 0" />
      <path d="M3 15c3-3 6 3 9 0s6 3 9 0" />
    </svg>
  ),
  wrench: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...strokeProps}>
      <path d="M15.6 3a5 5 0 0 0-4.7 6.8l-7.1 7.1 2.3 2.3 7.1-7.1A5 5 0 0 0 20.5 8l-2.6 1.3L16 7.2 17.9 4.6A5 5 0 0 0 15.6 3Z" />
    </svg>
  ),
};

export function ServiceCard({ service }: { service: ServiceSummary }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-md">
      <span
        aria-hidden="true"
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-light text-blue"
      >
        {serviceIcons[service.icon]}
      </span>
      <h3 className="mt-4 text-lg">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{service.description}</p>
      <div className="mt-5">
        <Button
          href={service.requestHref}
          variant="outline"
          className="w-full"
          aria-label={`Request this service: ${service.name}`}
        >
          Request This Service
        </Button>
      </div>
    </article>
  );
}