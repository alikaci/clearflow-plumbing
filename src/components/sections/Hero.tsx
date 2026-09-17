import { business } from "@/config/business";
import { home } from "@/config/home";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { HeroVisual } from "@/components/ui/HeroVisual";

function TrustCheck() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue"
    >
      <Icon name="check" className="h-3.5 w-3.5" />
    </span>
  );
}

export function Hero() {
  const { hero } = home;

  return (
    <Section ariaLabel="Introduction">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-navy">
              <span aria-hidden="true" className="h-px w-8 bg-orange" />
              {hero.eyebrow}
            </p>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl">
              {hero.heading}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">{hero.paragraph}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="#estimate" variant="primary" size="lg">
                {business.primaryCta.label}
              </Button>
              <Button
                href={business.phoneUri}
                variant="outline"
                size="lg"
                aria-label={`Call ${business.phoneDisplay}`}
              >
                Call {business.phoneDisplay}
              </Button>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {hero.trustPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 text-sm font-medium text-text"
                >
                  <TrustCheck />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <HeroVisual />
        </div>
      </Container>
    </Section>
  );
}