import { home } from "@/config/home";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/sections/Hero";
import { ReputationBar } from "@/components/sections/ReputationBar";
import { EmergencyCallout } from "@/components/sections/EmergencyCallout";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <ReputationBar />
      <EmergencyCallout />
      <ServiceGrid />
      <WhyChoose />
      <ProcessSteps />

      {/* TEMPORARY: replaced by the multi-step estimate request form in a later phase. */}
      <Section
        id="estimate"
        surface="muted"
        ariaLabel="Online request form, coming soon"
      >
        <Container size="narrow">
          <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
            <Badge variant="neutral">Temporary placeholder</Badge>
            <h2 className="mt-4 text-2xl">
              {home.estimatePlaceholder.heading}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted">
              {home.estimatePlaceholder.text}
            </p>
          </div>
        </Container>
      </Section>

      <FinalCta />
    </main>
  );
}