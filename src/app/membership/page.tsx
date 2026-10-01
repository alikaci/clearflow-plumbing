import {
  membershipBenefits,
  membershipIntroduction,
  membershipName,
  membershipNote,
} from "@/config/membership";
import { buildMetadata } from "@/lib/metadata";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata = buildMetadata("membership");

export default function MembershipPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageIntro
        eyebrow="Membership"
        heading={membershipName}
        intro={membershipIntroduction}
      />

      <Section labelledBy="membership-benefits-heading">
        <Container>
          <h2
            id="membership-benefits-heading"
            className="text-2xl md:text-3xl"
          >
            What the Plan Would Include
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {membershipBenefits.map((benefit) => (
              <li key={benefit.title}>
                <Card className="flex h-full flex-col">
                  <Icon name="check" className="h-5 w-5 text-blue" />
                  <h3 className="mt-3 text-lg">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {benefit.description}
                  </p>
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-4">
            <Badge variant="neutral">Demonstration only</Badge>
            <p className="text-sm text-muted">{membershipNote}</p>
          </div>
        </Container>
      </Section>

      <Section surface="dark">
        <Container size="narrow" className="text-center">
          <h2 className="text-2xl text-white md:text-3xl">
            Interested in Ongoing Support?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-footer-text">
            Submit a request and mention that you would like to hear about the
            Care Plan concept.
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
