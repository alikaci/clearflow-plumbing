import { business } from "@/config/business";
import { home } from "@/config/home";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function EmergencyCallout() {
  const { emergency } = home;

  return (
    <Section surface="dark" ariaLabel="Urgent plumbing help">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
              Urgent Plumbing Help
            </p>
            <h2 className="mt-3 text-2xl text-white md:text-3xl">
              {emergency.heading}
            </h2>
            <p className="mt-4 text-footer-text">{emergency.text}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Button
              href={emergency.callHref}
              variant="primary"
              size="lg"
              aria-label={`Call ${business.phoneDisplay}`}
            >
              {emergency.callLabel}
            </Button>
            <Button
              href={emergency.requestHref}
              variant="outline"
              size="lg"
            >
              {emergency.requestLabel}
            </Button>
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-4 text-sm text-footer-muted">
          {emergency.safetyNote}
        </p>
      </Container>
    </Section>
  );
}