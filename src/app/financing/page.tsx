import {
  financingDisclaimer,
  financingIntroduction,
  financingNotice,
  financingUseCases,
} from "@/config/financing";
import { buildMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata = buildMetadata("financing");

export default function FinancingPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Financing"
        heading="Financing Information"
        intro={financingIntroduction}
      />

      <Section labelledBy="financing-usecases-heading">
        <Container>
          <h2 id="financing-usecases-heading" className="text-2xl md:text-3xl">
            Projects That Often Include Payment Planning
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {financingUseCases.map((useCase) => (
              <li key={useCase.title}>
                <Card className="h-full" elevated>
                  <h3 className="text-lg">{useCase.title}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {useCase.description}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="muted" labelledBy="financing-notice-heading">
        <Container size="narrow">
          <h2 id="financing-notice-heading" className="text-2xl">
            Important Notice
          </h2>
          <p className="mt-4 text-muted">{financingNotice}</p>
          <p className="mt-4 text-muted">{financingDisclaimer}</p>
          <div className="mt-8">
            <Button href="/#estimate" size="lg">
              Request a Free Estimate
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
