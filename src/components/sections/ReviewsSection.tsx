import { reviews } from "@/config/reviews";
import { formatMarketDate } from "@/lib/credentials";
import { getDateFormat } from "@/lib/market";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { Review } from "@/types";

const maxRating = 5;

/*
Stars are conveyed by text, not by shape alone.

The filled/unfilled star pair is decorative, so the accessible name on the group
states the actual value. A screen reader otherwise gets five unlabelled
graphics for every card.
*/
function Stars({
  rating,
  label,
}: {
  rating: number;
  label?: string;
}) {
  const filled = Array.from({ length: maxRating }, (_, index) => index < rating);

  return (
    <p
      role="img"
      aria-label={label ?? `${rating} out of ${maxRating} stars`}
      className="flex gap-0.5 text-orange"
    >
      {filled.map((isFilled, index) => (
        <Icon
          key={index}
          name="star"
          className={`h-4 w-4 ${isFilled ? "" : "opacity-25"}`}
        />
      ))}
    </p>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const displayDate = formatMarketDate(review.date, getDateFormat());

  return (
    <Reveal as="li" variant="fade" index={index}>
      <Card className="flex h-full flex-col">
        <Stars rating={review.rating} />

        <blockquote className="mt-4 flex-1 text-text">
          <p>&ldquo;{review.quote}&rdquo;</p>
        </blockquote>

        <div className="mt-5 border-t border-border pt-4">
          <p className="text-sm font-semibold text-navy">{review.name}</p>
          <p className="mt-0.5 text-sm text-muted">
            {review.service} &middot; {review.location}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            <time dateTime={review.date}>{displayDate}</time>
          </p>
        </div>
      </Card>
    </Reveal>
  );
}

export function ReviewsSection() {
  return (
    <Section surface="muted" labelledBy="reviews-heading">
      <Container>
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <h2 id="reviews-heading" className="text-2xl md:text-3xl">
                {reviews.heading}
              </h2>
              <p className="mt-3 text-muted">{reviews.supportingText}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-4xl font-bold text-navy">{reviews.rating}</p>
                <p className="text-sm text-muted">{reviews.ratingLabel}</p>
              </div>
              <div>
                <Stars
                  rating={maxRating}
                  label={`${reviews.rating} average rating out of ${maxRating} stars`}
                />
                <p className="mt-1 text-sm font-semibold text-text">
                  {reviews.reviewCount}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {reviews.highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-2 text-sm text-muted">
              <Icon name="check" className="h-4 w-4 shrink-0 text-success" />
              {highlight}
            </li>
          ))}
        </ul>

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.reviews.map((review, index) => (
            <ReviewCard key={review.name} review={review} index={index} />
          ))}
        </ul>

        <Reveal variant="fade">
          <p className="mt-8 text-sm text-muted">{reviews.note}</p>
        </Reveal>
      </Container>
    </Section>
  );
}