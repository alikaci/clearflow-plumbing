import { problemChooser, problemPaths } from "@/config/problemPaths";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { ProblemPath } from "@/types";

function choiceCardClasses(path: ProblemPath): string {
  const intent = path.id === "not-sure" ? "border-blue bg-blue-light/40" : "";
  return [
    "flex h-full flex-col rounded-xl border border-border bg-surface p-6 microtransition hover-on:-translate-y-0.5 hover:shadow-md",
    intent,
  ]
    .filter(Boolean)
    .join(" ");
}

function choiceIconClasses(path: ProblemPath): string {
  return [
    "inline-flex h-11 w-11 items-center justify-center rounded-lg",
    path.accent ? "bg-orange/10 text-orange" : "bg-blue-light text-blue",
  ].join(" ");
}

function ProblemChoiceCard({ path }: { path: ProblemPath }) {
  return (
    <article className={choiceCardClasses(path)}>
      <span aria-hidden="true" className={choiceIconClasses(path)}>
        <Icon name={path.icon} />
      </span>
      <h3 className="mt-4 text-lg">{path.label}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{path.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          href={path.href}
          className="inline-link-arrow inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-blue"
        >
          {path.linkLabel}
          <span className="inline-link-arrow-icon text-blue">
            <Icon name="arrow-right" className="h-4 w-4" />
          </span>
        </a>
        {path.altCta ? (
          <a
            href={path.altCta.href}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-blue"
          >
            {path.altCta.label}
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function ProblemChooser() {
  return (
    <Section id="problem-chooser" tabIndex={-1} labelledBy="problem-chooser-heading">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-navy">
              {problemChooser.eyebrow}
            </p>
            <h2 id="problem-chooser-heading" className="mt-3 text-2xl md:text-3xl">
              {problemChooser.heading}
            </h2>
            <p className="mt-3 text-muted">{problemChooser.supportingText}</p>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {problemPaths.map((path, index) => (
            <Reveal key={path.id} as="li" index={index}>
              <ProblemChoiceCard path={path} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}