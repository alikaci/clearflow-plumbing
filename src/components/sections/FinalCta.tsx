import { business } from "@/config/business";
import { home } from "@/config/home";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

export function FinalCta() {
  const { finalCta } = home;

  return (
    <Section surface="dark" ariaLabel="Request service">
      <Container size="narrow" className="text-center">
        <Reveal variant="fade">
          <h2 className="text-2xl text-white md:text-3xl">{finalCta.heading}</h2>
          <p className="mx-auto mt-4 max-w-xl text-footer-text">
            {finalCta.text}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              href={finalCta.primaryHref}
              variant="primary"
              size="lg"
            >
              {finalCta.primaryLabel}
            </Button>
            <Button
              href={finalCta.secondaryHref}
              variant="outline"
              size="lg"
              aria-label={`Call ${business.phoneDisplay}`}
            >
              {finalCta.secondaryLabel}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}