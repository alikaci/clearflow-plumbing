import { reviews } from "@/config/reviews";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

export function ReputationBar() {
  const { rating, ratingLabel, reviewCount, highlights, note } = reviews;

  return (
    <Section surface="muted" ariaLabel="Reputation and coverage">
      <Container>
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <li className="flex items-center gap-2">
            <Icon name="star" className="h-5 w-5 text-orange" />
            <span className="text-2xl font-bold text-navy">{rating}</span>
            <span className="text-sm text-muted">{ratingLabel}</span>
          </li>
          <li className="text-sm font-semibold text-text">{reviewCount}</li>
          {highlights.map((highlight) => (
            <li key={highlight} className="text-sm text-muted">
              {highlight}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted">{note}</p>
      </Container>
    </Section>
  );
}
