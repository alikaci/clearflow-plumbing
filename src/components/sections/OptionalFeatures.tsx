import Link from "next/link";
import { home } from "@/config/home";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { isFeatureEnabled } from "@/lib/features";

export function OptionalFeatures() {
  const { optionalFeatures } = home;
  const tiles = optionalFeatures.tiles.filter((tile) =>
    isFeatureEnabled(tile.flag),
  );

  if (tiles.length === 0) return null;

  return (
    <Section labelledBy="optional-features-heading">
      <Container>
        <div className="max-w-2xl">
          <h2 id="optional-features-heading" className="text-2xl md:text-3xl">
            {optionalFeatures.heading}
          </h2>
          <p className="mt-3 text-muted">
            {optionalFeatures.supportingText}
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile) => (
            <li key={tile.title}>
              <Card className="flex h-full flex-col" elevated>
                <h3 className="text-lg">{tile.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {tile.description}
                </p>
                <Link
                  href={tile.href}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue underline-offset-2 hover:underline"
                >
                  {tile.linkLabel}
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
