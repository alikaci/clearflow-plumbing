import { home } from "@/config/home";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function ReputationBar() {
  const { reputation } = home;

  return (
    <Section surface="muted" ariaLabel="Reputation and coverage">
      <Container>
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="text-lg text-orange">
              ★
            </span>
            <span className="text-2xl font-bold text-navy">
              {reputation.rating}
            </span>
            <span className="text-sm text-muted">{reputation.ratingLabel}</span>
          </li>
          <li className="text-sm font-semibold text-text">
            {reputation.reviewCount}
          </li>
          {reputation.highlights.map((highlight) => (
            <li key={highlight} className="text-sm text-muted">
              {highlight}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted">{reputation.note}</p>
      </Container>
    </Section>
  );
}