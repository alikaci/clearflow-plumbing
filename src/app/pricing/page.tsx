import { features } from "@/config/features";
import { pricing } from "@/config/pricing";
import { buildMetadata } from "@/lib/metadata";
import { resolveHashHref } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { ProcessSteps } from "@/components/sections/ProcessSteps";

export const metadata = buildMetadata("pricing");

export default function PricingPage() {
  // The request destination is the same hash target the other pages use, so it
  // resolves to the canonical request section from this route.
  const requestHref = resolveHashHref(pricing.ctaPrimaryHref, "/pricing");

  return (
    <main id="main-content">
      <PageIntro
        eyebrow={pricing.eyebrow}
        heading={pricing.heading}
        intro={pricing.intro}
        note={pricing.disclosure}
      />

      <ProcessSteps
        heading={pricing.process.heading}
        steps={pricing.process.steps}
        columns={2}
        labelledBy="pricing-process-heading"
      />

      <Section labelledBy="pricing-factors-heading">
        <Container>
          <h2 id="pricing-factors-heading" className="text-2xl md:text-3xl">
            {pricing.costFactorsHeading}
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pricing.costFactors.map((factor) => (
              <li key={factor.title}>
                <Card className="h-full">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-light text-blue"
                    >
                      <Icon name={factor.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="wrap-anywhere text-base font-semibold text-navy">
                        {factor.title}
                      </h3>
                      <p className="mt-1.5 wrap-anywhere text-sm text-muted">
                        {factor.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="muted" labelledBy="pricing-questions-heading">
        <Container>
          <h2 id="pricing-questions-heading" className="text-2xl md:text-3xl">
            {pricing.questionsHeading}
          </h2>
          <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {pricing.questions.map((question) => (
              <li key={question} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue"
                >
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <span className="text-sm text-text">{question}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-sm text-muted">
            {pricing.questionsNote}
          </p>
        </Container>
      </Section>

      <Section surface="dark" ariaLabel="Request service">
        <Container size="narrow" className="text-center">
          <h2 className="text-2xl text-white md:text-3xl">
            {pricing.ctaHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-footer-text">
            {pricing.ctaText}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={requestHref} variant="primary" size="lg">
              {pricing.ctaPrimaryLabel}
            </Button>
            {features.financing ? (
              <Button
                href={pricing.ctaSecondaryHref}
                variant="outline"
                size="lg"
              >
                {pricing.ctaSecondaryLabel}
              </Button>
            ) : null}
          </div>
        </Container>
      </Section>
    </main>
  );
}
