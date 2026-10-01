import { business } from "@/config/business";
import { serviceSummaries } from "@/config/services";
import { buildMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata = buildMetadata("emergency");

/*
Emergency page.

Priority order is deliberate and mirrors what a visitor in a bad situation
actually needs, in this order:

1. immediate personal safety
2. direct phone contact
3. the emergency request path
4. common urgent situations
5. what happens next

Deliberately absent, because they would be false: a countdown, a "technician
dispatched" state, a claim that a call centre answered, and any claim that a
request was transmitted. The footer carries the portfolio disclosure for the
site, so no concept label is repeated in these blocks.
*/
const immediateThreatSentence =
  "If there is an immediate threat involving fire, gas, electricity or severe flooding, contact the appropriate emergency service or utility provider first.";

const immediateSafetyGuidance = [
  "Stay clear of standing water that is near electrical outlets, cords or appliances.",
  "Keep children and pets away from wet, contaminated or restricted areas.",
  "Avoid using fixtures when continued use may worsen an overflow.",
  "Do not attempt gas or electrical repairs, and do not open an equipment panel.",
  "If the building is unsafe to stay in, move to safety before calling anyone.",
];

const safetySteps = [
  "If water is escaping, close the nearest supply valve or the main shutoff when you can reach it safely.",
  "Move valuables away from the affected area and avoid standing water near electrical outlets or appliances.",
  "Take a photo if you can do so safely. It helps the office understand the situation faster.",
  "Note whether the problem is getting worse or holding steady.",
];

const urgentSituations = [
  "Burst or leaking pipes that are actively releasing water.",
  "Sewage backing up into tubs, showers or floor drains.",
  "Major blockages that stop fixtures from draining at all.",
  "No hot water when the property depends on it.",
  "Fixtures that overflow and will not shut off.",
];

const whatHappensNext = [
  {
    step: 1,
    title: "You Call or Request",
    description:
      "The office takes your call or request along with the timing and details you gave.",
  },
  {
    step: 2,
    title: "The Office Reviews",
    description:
      "Reception confirms the problem, checks whether the address is inside the service area and explains the next options.",
  },
  {
    step: 3,
    title: "An Appointment Is Agreed",
    description:
      "You agree an arrival window with the office. Any price is quoted after an on-site assessment, not before.",
  },
  {
    step: 4,
    title: "Assessment and Repair",
    description:
      "A technician arrives, explains the cause of the problem, quotes the work and carries it out once you approve it.",
  },
];

export default function EmergencyPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageIntro
        eyebrow={business.hours.emergencyLabel}
        heading="Emergency Help, Day or Night"
        intro="Plumbing emergencies cannot always wait. Call the office for urgent help, or send an emergency request and the team will follow up on the timing you need."
      />

      {/* 1. Immediate personal safety comes before everything commercial. */}
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
              Safety Comes Before Plumbing
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

      {/* 2. Direct contact, then 3. the request path. */}
      <Section surface="dark" labelledBy="emergency-contact-heading">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h2
                id="emergency-contact-heading"
                className="text-2xl text-white md:text-3xl"
              >
                Request Emergency Service
              </h2>
              <p className="mt-4 text-footer-text">
                Emergency calls are taken {business.hours.emergency}, including nights and
                weekends. Office hours are{" "}
                {business.hours.full}.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Button
                href={business.phoneUri}
                variant="primary"
                size="lg"
                aria-label={`Call ${business.phoneDisplay}`}
              >
                Call Now
              </Button>
              <Button href="/#estimate" variant="outline" size="lg">
                Send an Emergency Request
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Common urgent situations, then 5. what the office would do next. */}
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
                    <Icon
                      name="alert"
                      className="mt-1 h-5 w-5 shrink-0 text-orange"
                    />
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
                    <Icon
                      name="check"
                      className="mt-1 h-5 w-5 shrink-0 text-blue"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="emergency-what-next-heading">
        <Container>
          <h2 id="emergency-what-next-heading" className="text-2xl">
            What Happens After You Contact Us
          </h2>
          <ol className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {whatHappensNext.map((item) => (
              <li key={item.step}>
                <Card className="flex h-full flex-col">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy text-base font-bold text-white"
                  >
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">
                    {item.description}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
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