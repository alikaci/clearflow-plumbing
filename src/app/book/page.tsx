import { notFound } from "next/navigation";
import { features } from "@/config/features";
import { forms } from "@/config/forms";
import { buildMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { BookingFlow } from "@/components/forms/BookingFlow";

export const metadata = buildMetadata("book");

export default function BookPage() {
  if (!features.onlineBooking) notFound();

  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Booking"
        heading={forms.bookingHeading}
        intro={forms.bookingSupportingText}
      />

      <Section labelledBy="booking-flow-heading">
        <Container size="narrow">
          <h2 id="booking-flow-heading" className="sr-only">
            Booking preview steps
          </h2>
          <p className="rounded-lg border border-border bg-surface-muted p-4 text-sm text-muted">
            {forms.bookingDisclaimer}
          </p>
          <Card className="mt-6">
            <BookingFlow />
          </Card>
        </Container>
      </Section>
    </main>
  );
}
