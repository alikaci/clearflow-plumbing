import { costTool } from "@/config/costTool";
import { features } from "@/config/features";
import { serviceSummaries } from "@/config/services";
import { buildMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { ServiceCard } from "@/components/services/ServiceCard";
import { CostGuidanceTool } from "@/components/forms/CostGuidanceTool";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = buildMetadata("services");

export default function ServicesPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageIntro
        eyebrow="Services"
        heading="Plumbing Services for Homes and Small Commercial Properties"
        intro="Explore the services presented in this concept. Each service page explains common problems, warning signs and what an assessment may include, and a request can be submitted in a few steps."
      />

      <Section labelledBy="all-services-heading">
        <Container>
          <Reveal>
            <h2 id="all-services-heading" className="text-2xl md:text-3xl">
              All Services
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {serviceSummaries.map((service, index) => (
              <Reveal key={service.slug} as="li" index={index}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {features.costRangeTool ? (
        <Section surface="muted" labelledBy="cost-tool-heading">
          <Container size="narrow">
            <Reveal>
              <div className="max-w-2xl">
                <h2 id="cost-tool-heading" className="text-2xl md:text-3xl">
                  {costTool.heading}
                </h2>
                <p className="mt-3 text-muted">{costTool.supportingText}</p>
              </div>
            </Reveal>
            <Reveal variant="fade">
              <Card className="mt-8">
                <CostGuidanceTool ctaHref="/#estimate" />
              </Card>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <Section surface="dark">
        <Container size="narrow" className="text-center">
          <h2 className="text-2xl text-white md:text-3xl">
            Ready to Request a Service?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-footer-text">
            Send the details through the multi-step request form, or call
            directly to discuss the problem.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/#estimate" variant="primary" size="lg">
              Request a Free Estimate
            </Button>
            <Button href="/emergency" variant="outline" size="lg">
              Urgent Plumbing Help
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
