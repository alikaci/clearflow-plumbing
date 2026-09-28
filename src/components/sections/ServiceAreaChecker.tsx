import { serviceAreas } from "@/config/serviceAreas";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ZipChecker } from "@/components/forms/ZipChecker";
import { Reveal } from "@/components/motion/Reveal";

export function ServiceAreaChecker() {
  return (
    <Section surface="blue" labelledBy="service-area-heading">
      <Container>
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="max-w-xl">
              <h2 id="service-area-heading" className="text-2xl md:text-3xl">
                {serviceAreas.heading}
              </h2>
              <p className="mt-3 text-muted">{serviceAreas.supportingText}</p>
            </div>

            <Card className="h-fit">
              <h3 className="text-lg text-navy">{serviceAreas.checkerTitle}</h3>
              <p className="mt-2 text-sm text-muted">
                {serviceAreas.checkerDescription}
              </p>
              <div className="mt-5">
                <ZipChecker id="home-zip" />
              </div>
            </Card>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
