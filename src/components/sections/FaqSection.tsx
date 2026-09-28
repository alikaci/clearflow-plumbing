import { faqHeading, faqSupportingText, faqs } from "@/config/faqs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FaqAccordion } from "./FaqAccordion";
import { Reveal } from "@/components/motion/Reveal";

export function FaqSection() {
  return (
    <Section labelledBy="faq-heading">
      <Container size="narrow">
        <Reveal>
          <h2 id="faq-heading" className="text-2xl md:text-3xl">
            {faqHeading}
          </h2>
          <p className="mt-3 text-muted">{faqSupportingText}</p>
        </Reveal>
        <div className="mt-8">
          <FaqAccordion items={faqs} />
        </div>
      </Container>
    </Section>
  );
}
