import { serviceAreas } from "@/config/serviceAreas";
import { buildMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { ZipChecker } from "@/components/forms/ZipChecker";

export const metadata = buildMetadata("serviceAreas");

export default function ServiceAreasPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Coverage"
        heading={serviceAreas.heading}
        intro={serviceAreas.supportingText}
      />

      <Section labelledBy="areas-checker-heading">
        <Container size="narrow">
          <h2 id="areas-checker-heading" className="text-2xl md:text-3xl">
            {serviceAreas.checkerTitle}
          </h2>
          <p className="mt-3 text-muted">{serviceAreas.checkerDescription}</p>
          <Card className="mt-8">
            <ZipChecker id="areas-zip" />
          </Card>
        </Container>
      </Section>

      <Section surface="muted" labelledBy="areas-list-heading">
        <Container>
          <h2 id="areas-list-heading" className="text-2xl md:text-3xl">
            Communities in the Demonstration Service Area
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceAreas.areas.map((area) => (
              <li key={area.name}>
                <Card className="h-full">
                  <h3 className="text-lg">{area.name}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {area.description}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">{serviceAreas.disclaimer}</p>
        </Container>
      </Section>

      <Section surface="dark">
        <Container size="narrow" className="text-center">
          <h2 className="text-2xl text-white md:text-3xl">
            Request Service in Your Area
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-footer-text">
            Submit the details and the team can confirm availability for your
            address.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/#estimate" variant="primary" size="lg">
              Request a Free Estimate
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
