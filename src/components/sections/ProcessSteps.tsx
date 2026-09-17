import { home } from "@/config/home";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function ProcessSteps() {
  const { process } = home;

  return (
    <Section surface="blue" ariaLabel="How it works">
      <Container>
        <h2 className="text-2xl md:text-3xl">{process.heading}</h2>

        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {process.steps.map((step) => (
            <li key={step.step}>
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-lg font-bold text-white"
                >
                  {step.step}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-navy/15 md:block"
                />
              </div>
              <h3 className="mt-4 text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}