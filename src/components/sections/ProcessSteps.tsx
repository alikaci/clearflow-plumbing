import { home } from "@/config/home";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { ProcessStep } from "@/types";

type ProcessStepsProps = {
  heading?: string;
  steps?: readonly ProcessStep[];
  surface?: "default" | "muted" | "blue";
  /** Connector rules read best in three columns, so they default on. */
  connectors?: boolean;
  /** Columns per row once there is more than one. */
  columns?: 2 | 3;
  ariaLabel?: string;
  labelledBy?: string;
};

/* Defaults reproduce the homepage section, so callers only override what differs. */
export function ProcessSteps({
  heading = home.process.heading,
  steps = home.process.steps,
  surface = "blue",
  connectors = true,
  columns = 3,
  ariaLabel = "How it works",
  labelledBy,
}: ProcessStepsProps) {
  return (
    <Section
      surface={surface}
      ariaLabel={labelledBy ? undefined : ariaLabel}
      labelledBy={labelledBy}
    >
      <Container>
        <Reveal>
          <h2 id={labelledBy} className="text-2xl md:text-3xl">
            {heading}
          </h2>
        </Reveal>

        <ol
          className={[
            "mt-10 grid gap-8 md:gap-10",
            columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
          ].join(" ")}
        >
          {steps.map((step, index) => (
            <Reveal key={step.step} as="li" index={index}>
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-lg font-bold text-white"
                >
                  {step.step}
                </span>
                {connectors ? (
                  <span
                    aria-hidden="true"
                    className="hidden h-px flex-1 bg-navy/15 md:block"
                  />
                ) : null}
              </div>
              <h3 className="mt-4 text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
