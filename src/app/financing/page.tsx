import {
  financingDisclaimer,
  financingIntroduction,
  financingNotice,
  financingUseCases,
} from "@/config/financing";
import { pricingContextLinks } from "@/config/pricing";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata = buildMetadata("financing");

export default function FinancingPage() {
  return (
    <main id="main-content" tabIndex={-1}>
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
          <p className="mt-6">
            <Link
              href={pricingContextLinks.financing.href}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue underline-offset-2 hover:underline"
            >
              {pricingContextLinks.financing.label}
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </p>
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
