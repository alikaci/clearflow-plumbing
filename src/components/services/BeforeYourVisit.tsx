import type { BeforeVisitConfig } from "@/types";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

const defaultHeading = "Before Your Visit";

const defaultIntro =
  "General preparation guidance for how a real service provider might help a customer prepare. No service visit has been scheduled through this demonstration.";

const importantLabel = "Important";

type BeforeYourVisitProps = {
  config?: BeforeVisitConfig;
  id?: string;
};

export function BeforeYourVisit({
  config,
  id = "before-your-visit",
}: BeforeYourVisitProps) {
  const items = config?.items ?? [];
  if (items.length === 0) return null;

  const headingId = `${id}-heading`;

  return (
    <Section id={id} labelledBy={headingId}>
      <Container>
        <div className="max-w-3xl">
          <h2 id={headingId} className="text-2xl md:text-3xl">
            {defaultHeading}
          </h2>
          <p className="mt-4 text-muted">{config?.intro ?? defaultIntro}</p>
        </div>

        <ul className="mt-8 grid gap-5 break-words sm:grid-cols-2">
          {items.map((item) => {
            const isImportant = item.importance === "important";

            return (
              <li key={item.title} className="h-full min-w-0">
                <Card
                  elevated
                  className={
                    isImportant
                      ? "h-full border-l-4 border-l-orange"
                      : "h-full"
                  }
                >
                  <div className="flex gap-3">
                    <Icon
                      name={isImportant ? "alert" : "check"}
                      className={
                        isImportant
                          ? "mt-0.5 h-5 w-5 shrink-0 text-orange"
                          : "mt-0.5 h-5 w-5 shrink-0 text-blue"
                      }
                    />
                    <div className="min-w-0">
                      {isImportant ? (
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy">
                          {importantLabel}
                        </p>
                      ) : null}
                      <h3 className={isImportant ? "mt-1 text-base" : "text-base"}>
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
