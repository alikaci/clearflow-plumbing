import { seo } from "@/config/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumbs";

type PageIntroProps = {
  heading: string;
  intro: string;
  eyebrow?: string;
  note?: string;
  breadcrumbs?: readonly BreadcrumbItem[];
  surface?: "default" | "muted" | "blue";
};

export function PageIntro({
  heading,
  intro,
  eyebrow,
  note,
  breadcrumbs,
  surface = "muted",
}: PageIntroProps) {
  return (
    <Section
      surface={surface}
      labelledBy="page-heading"
      className="py-10 md:py-14"
    >
      <Container>
        <div className="max-w-3xl">
          {breadcrumbs ? (
            <div className="mb-4">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          ) : (
            <p className="text-sm text-muted">{seo.siteName}</p>
          )}

          {eyebrow ? (
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-navy">
              {eyebrow}
            </p>
          ) : null}

          <h1
            id="page-heading"
            className={
              eyebrow
                ? "mt-3 break-words text-3xl md:text-4xl"
                : "break-words text-3xl md:text-4xl"
            }
          >
            {heading}
          </h1>
          <p className="mt-4 text-lg text-muted">{intro}</p>

          {note ? (
            <p className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm text-muted">
              {note}
            </p>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
