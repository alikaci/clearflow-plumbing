import type { ServiceSummary } from "@/types";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function ServiceCard({ service }: { service: ServiceSummary }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-md">
      <span
        aria-hidden="true"
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-light text-blue"
      >
        <Icon name={service.icon} />
      </span>
      <h3 className="mt-4 text-lg">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{service.description}</p>
      <div className="mt-5">
        <Button
          href={`/services/${service.slug}`}
          variant="outline"
          className="w-full"
          aria-label={`View details for ${service.name}`}
        >
          View Details
        </Button>
      </div>
    </article>
  );
}
