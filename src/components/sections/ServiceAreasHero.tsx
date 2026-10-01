import { images } from "@/config/images";
import { serviceAreas } from "@/config/serviceAreas";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { BrandImage } from "@/components/ui/BrandImage";

const preferredImageKey = images.brandedVan.available
  ? ("brandedVan" as const)
  : ("technicianHomeowner" as const);

function CoveragePoint({ point }: { point: string }) {
  return (
    <li className="flex items-center gap-2.5 text-sm font-medium text-text">
      <span
        aria-hidden="true"
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue"
      >
        <Icon name="check" className="h-3.5 w-3.5" />
      </span>
      {point}
    </li>
  );
}

export function ServiceAreasHero() {
  const { heading, supportingText, hero } = serviceAreas;

  return (
    <Section ariaLabel="Service area coverage">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-navy">
              <span aria-hidden="true" className="h-px w-8 bg-orange" />
              {hero.eyebrow}
            </p>
            <h1
              id="page-heading"
              className="mt-5 break-words text-3xl sm:text-4xl lg:text-5xl"
            >
              {heading}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">{supportingText}</p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {hero.coveragePoints.map((point) => (
                <CoveragePoint key={point} point={point} />
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={hero.primaryCtaHref} variant="primary" size="lg">
                {hero.primaryCtaLabel}
              </Button>
              <Button
                href={hero.secondaryCtaHref}
                variant="outline"
                size="lg"
              >
                {hero.secondaryCtaLabel}
              </Button>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border shadow-sm">
              <BrandImage
                imageKey={preferredImageKey}
                className="h-full w-full object-cover"
                sizes="(min-width: 1280px) 513px, (min-width: 1024px) 429px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
              />
            </div>
            <p className="mt-3 text-center text-sm text-muted">{hero.badge}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}