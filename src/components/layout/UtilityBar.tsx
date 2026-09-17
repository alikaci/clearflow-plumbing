import { business } from "@/config/business";
import { Container } from "@/components/ui/Container";

export function UtilityBar() {
  return (
    <div className="bg-navy text-white">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-1 py-2 text-sm">
        <span className="hidden sm:inline">Serving {business.serviceArea}</span>
        <span className="inline">{business.hours.short}</span>
        <a
          href={business.phoneUri}
          className="ml-auto inline-flex items-center gap-2 font-medium underline-offset-2 hover:underline"
        >
          Call {business.phoneDisplay}
        </a>
      </Container>
    </div>
  );
}