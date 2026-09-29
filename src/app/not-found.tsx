import Link from "next/link";
import { business } from "@/config/business";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <main id="main-content">
      <Section labelledBy="not-found-heading">
        <Container size="narrow" className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-navy">
            404
          </p>
          <h1
            id="not-found-heading"
            className="mt-3 text-3xl md:text-4xl"
          >
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            The page you were looking for is not part of this demonstration.
            Return to the homepage or explore the available services.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/" variant="primary" size="lg">
              Back to Home
            </Button>
            <Button href="/services" variant="outline" size="lg">
              View Services
            </Button>
          </div>
          <p className="mt-8 text-sm text-muted">
            Need help now? Call{" "}
            <a
              href={business.phoneUri}
              className="font-medium text-blue underline-offset-2 hover:underline"
            >
              {business.phoneDisplay}
            </a>
            .{" "}
            <Link
              href="/contact"
              className="font-medium text-blue underline-offset-2 hover:underline"
            >
              Contact the team
            </Link>
            .
          </p>
        </Container>
      </Section>
    </main>
  );
}
