import { reviews } from "@/config/reviews";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

export function ReviewsSection() {
  return (
    <Section surface="muted" labelledBy="reviews-heading">
      <Container>
        <div className="max-w-2xl">
          <h2 id="reviews-heading" className="text-2xl md:text-3xl">
            {reviews.heading}
          </h2>
          <p className="mt-3 text-muted">{reviews.supportingText}</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-2">
            <Icon name="star" className="h-5 w-5 text-orange" />
            <span className="text-2xl font-bold text-navy">
              {reviews.rating}
            </span>
            <span className="text-sm text-muted">{reviews.ratingLabel}</span>
          </div>
          <p className="text-sm font-semibold text-text">
            {reviews.reviewCount}
          </p>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {reviews.reviews.map((review) => (
            <li key={review.name}>
              <Card className="flex h-full flex-col">
                <div
                  role="img"
                  className="flex gap-0.5 text-orange"
                  aria-label="Five out of five stars"
                >
                  {[0, 1, 2, 3, 4].map((index) => (
                    <Icon
                      key={index}
                      name="star"
                      className="h-4 w-4"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-text">
                  <p>&ldquo;{review.quote}&rdquo;</p>
                </blockquote>
                <p className="mt-4 text-sm font-semibold text-navy">
                  {review.name}
                </p>
                <p className="text-sm text-muted">{review.location}</p>
              </Card>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-muted">{reviews.note}</p>
        <p className="mt-1 text-sm text-muted">{reviews.presentationNote}</p>
      </Container>
    </Section>
  );
}
