import { business } from "@/config/business";
import { home } from "@/config/home";
import { serviceSummaries } from "@/config/services";
import { buildMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata = buildMetadata("emergency");

const urgentSituations = [
  "Burst or leaking pipes that are actively releasing water.",
  "Sewage backing up into tubs, showers or floor drains.",
  "Major blockages that stop fixtures from draining at all.",
  "No hot water when the property depends on it.",
  "Fixtures that overflow and will not shut off.",
];

const safetySteps = [
  "If water is escaping, close the nearest supply valve or the main shutoff when you can reach it safely.",
  "Move valuables away from the affected area and avoid standing water near electrical outlets or appliances.",
];

const immediateThreatSentence =
  "If there is an immediate threat involving safety, fire, gas, electricity or severe flooding, contact the appropriate emergency service or utility provider.";

const immediateSafetyGuidance = [
  "Stay clear of standing water that is near electrical outlets, cords or appliances.",
  "Keep children and pets away from wet, contaminated or restricted areas.",
  "Avoid using fixtures when continued use may worsen an overflow.",
  "Do not attempt gas or electrical repairs, and do not open an equipment panel.",
  "When you make contact, describe what you observed, when it started and whether it is getting worse.",
];

export default function EmergencyPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Urgent Help"
        heading="Urgent Plumbing Help"
        intro="Some plumbing problems cannot wait. This page explains how urgent requests would be presented, what to do first, and when to contact an emergency service instead."
      />

      <Section labelledBy="emergency-immediate-heading">
        <Container>
          <div className="rounded-xl border-2 border-orange/50 bg-surface-muted p-5 md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-navy">
              Immediate Danger
            </p>
            <h2
              id="emergency-immediate-heading"
              className="mt-3 text-2xl md:text-3xl"
            >
              When an Immediate Threat Should Come First
            </h2>
            <p className="mt-4 max-w-3xl text-lg font-medium text-text">
              {immediateThreatSentence}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {immediateSafetyGuidance.map((item) => (
                <li key={item} className="flex gap-3 text-muted">
                  <Icon
                    name="alert"
                    className="mt-1 h-5 w-5 shrink-0 text-orange"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section labelledBy="urgent-situations-heading">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 id="urgent-situations-heading" className="text-2xl">
                When to Request Urgent Help
              </h2>
              <ul className="mt-4 space-y-3">
                {urgentSituations.map((item) => (
                  <li key={item} className="flex gap-3 text-muted">
                    <Icon name="alert" className="mt-1 h-5 w-5 shrink-0 text-orange" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl">What to Do First</h2>
              <ul className="mt-4 space-y-3">
                {safetySteps.map((item) => (
                  <li key={item} className="flex gap-3 text-muted">
                    <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-blue" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-lg border border-orange/40 bg-surface-muted p-4 text-sm font-medium text-text">
                {home.emergency.safetyNote}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section surface="dark" labelledBy="emergency-contact-heading">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h2 id="emergency-contact-heading" className="text-2xl text-white md:text-3xl">
                Request Urgent Plumbing Help
              </h2>
              <p className="mt-4 text-footer-text">
                Tell us what is happening and how urgent it is. Hours are{" "}
                {business.hours.full}. No 24/7 availability, guaranteed response
                window or technician dispatch is promised by this demonstration.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Button
                href={business.phoneUri}
                variant="primary"
                size="lg"
                aria-label={`Call ${business.phoneDisplay}`}
              >
                Call {business.phoneDisplay}
              </Button>
              <Button href="/#estimate" variant="outline" size="lg">
                Request Urgent Help
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="emergency-services-heading">
        <Container>
          <h2 id="emergency-services-heading" className="text-2xl">
            Urgent Requests Often Involve
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {serviceSummaries.slice(0, 4).map((service) => (
              <li key={service.slug}>
                <Card className="flex h-full flex-col">
                  <h3 className="text-lg">{service.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">
                    {service.description}
                  </p>
                  <Button
                    href={`/services/${service.slug}`}
                    variant="outline"
                    className="mt-4 w-full"
                  >
                    View Details
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </main>
  );
}
