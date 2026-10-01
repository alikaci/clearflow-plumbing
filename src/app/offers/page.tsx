import { offers, offersNote } from "@/config/offers";
import { buildMetadata } from "@/lib/metadata";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata = buildMetadata("offers");

export default function OffersPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageIntro
        eyebrow="Offers"
        heading="Current Offers"
        intro="A sample of how promotions could be presented for a real plumbing business, with clear terms rather than countdowns or pressure tactics."
      />

      <Section labelledBy="offers-list-heading">
        <Container>
          <h2 id="offers-list-heading" className="sr-only">
            Sample offers
          </h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {offers.map((offer) => (
              <li key={offer.id}>
                <Card className="flex h-full flex-col" elevated>
                  <Badge variant="orange">Sample offer</Badge>
                  <h3 className="mt-4 text-lg">{offer.title}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {offer.description}
                  </p>
                  <p className="mt-3 flex-1 text-sm text-muted">
                    {offer.detail}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">{offersNote}</p>
        </Container>
      </Section>

      <Section surface="dark">
        <Container size="narrow" className="text-center">
          <h2 className="text-2xl text-white md:text-3xl">
            Request Service and Ask About Offers
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-footer-text">
            Mention any offer when you submit a request. A real business would
            confirm eligibility at that point.
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
