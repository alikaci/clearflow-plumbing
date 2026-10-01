import Link from "next/link";
import { business } from "@/config/business";
import { buildMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { EstimateSection } from "@/components/sections/EstimateSection";

export const metadata = buildMetadata("contact");

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageIntro
        eyebrow="Contact"
        heading="Contact ClearFlow Plumbing Co."
        intro="Reach the team by phone during business hours, or send the details through the multi-step request form. Email is listed for reference only and is not a clickable link in this demonstration."
      />

      <Section labelledBy="contact-details-heading">
        <Container>
          <h2 id="contact-details-heading" className="text-2xl md:text-3xl">
            Contact Details
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Card className="h-full">
              <Icon name="phone" className="h-6 w-6 text-blue" />
              <h3 className="mt-3 text-lg">Phone</h3>
              <p className="mt-2 text-sm text-muted">
                Call during business hours to discuss a request.
              </p>
              <a
                href={business.phoneUri}
                className="mt-3 inline-flex font-semibold text-blue underline-offset-2 hover:underline"
              >
                {business.phoneDisplay}
              </a>
            </Card>

            <Card className="h-full">
              <Icon name="clock" className="h-6 w-6 text-blue" />
              <h3 className="mt-3 text-lg">Hours</h3>
              <p className="mt-2 text-sm text-muted">
                Office hours are {business.hours.full}.{" "}
                <Link
                  href="/emergency"
                  className="inline-flex min-h-6 items-center underline underline-offset-2 hover:no-underline"
                >
                  {business.hours.emergencyLabel}
                </Link>{" "}
                are taken for emergencies, including nights and weekends.
              </p>
            </Card>

            <Card className="h-full">
              <Icon name="map-pin" className="h-6 w-6 text-blue" />
              <h3 className="mt-3 text-lg">Service Area</h3>
              <p className="mt-2 text-sm text-muted">
                Serving {business.serviceArea}.
              </p>
              <p className="mt-3 text-sm text-muted">
                Email: <span className="text-text">{business.email.display}</span>
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <EstimateSection />

      <Section surface="muted" labelledBy="contact-privacy-heading">
        <Container size="narrow">
          <h2 id="contact-privacy-heading" className="text-2xl">
            Before You Submit
          </h2>
          <p className="mt-4 text-muted">
            This is a portfolio demonstration. The request form prepares your
            details locally and does not send or store them. Please do not submit
            sensitive personal information.
          </p>
          <p className="mt-4 text-muted">
            Read the{" "}
            <a
              href="/privacy"
              className="font-medium text-blue underline-offset-2 hover:underline"
            >
              privacy notes
            </a>{" "}
            for the full explanation.
          </p>
        </Container>
      </Section>
    </main>
  );
}
