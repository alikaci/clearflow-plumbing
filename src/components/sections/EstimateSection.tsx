import { forms } from "@/config/forms";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { EstimateForm } from "@/components/forms/EstimateForm";
import { Reveal } from "@/components/motion/Reveal";

export function EstimateSection() {
  return (
    <Section id="estimate" surface="muted" labelledBy="estimate-heading">
      <Container size="narrow">
        <Reveal>
          <div className="max-w-2xl">
            <h2 id="estimate-heading" className="text-2xl md:text-3xl">
              {forms.estimateHeading}
            </h2>
            <p className="mt-3 text-muted">{forms.estimateSupportingText}</p>
          </div>
        </Reveal>

        <div className="mt-8 rounded-xl border border-border bg-white p-6 md:p-8">
          <EstimateForm />
        </div>
      </Container>
    </Section>
  );
}
