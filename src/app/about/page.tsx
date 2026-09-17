import { business } from "@/config/business";
import { home } from "@/config/home";
import { buildMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { BrandImage } from "@/components/ui/BrandImage";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata = buildMetadata("about");

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="About"
        heading="About ClearFlow Plumbing Co."
        intro="ClearFlow Plumbing Co. is a fictional Columbus plumbing brand created by ServiceHarbor Studio to demonstrate a modern local-service website."
      />

      <Section labelledBy="about-story-heading">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 id="about-story-heading" className="text-2xl md:text-3xl">
                A Concept Built Around Clear Service
              </h2>
              <p className="mt-4 text-muted">
                The concept imagines how a plumbing business could present its
                services, service area and request process in a way that feels
                organized and easy to follow. Every page is designed to answer
                the practical questions a homeowner has before requesting help.
              </p>
              <p className="mt-4 text-muted">
                ClearFlow is not a real plumbing company. It exists to show how a
                production-quality local-service website could be structured,
                and how optional features such as booking, membership and
                financing information could be added when a client needs them.
              </p>
            </div>
            <BrandImage
              imageKey="aboutTeam"
              className="w-full rounded-xl"
              sizes="(min-width: 1024px) 45vw, 90vw"
            />
          </div>
        </Container>
      </Section>

      <Section surface="muted" labelledBy="about-approach-heading">
        <Container>
          <h2 id="about-approach-heading" className="text-2xl md:text-3xl">
            {home.whyChoose.heading}
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {home.whyChoose.points.map((point) => (
              <li key={point.title} className="flex gap-3">
                <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-blue" />
                <div>
                  <h3 className="text-lg">{point.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="about-disclosure-heading">
        <Container size="narrow">
          <h2 id="about-disclosure-heading" className="text-2xl">
            Demonstration Disclosure
          </h2>
          <p className="mt-4 text-muted">{business.disclosures.fictional}</p>
          <p className="mt-4 text-muted">{business.disclosures.aiImagery}</p>
          <div className="mt-8">
            <Button href="/#estimate" size="lg">
              Request a Free Estimate
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
