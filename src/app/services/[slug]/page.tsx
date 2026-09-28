import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/config/business";
import { getService, serviceSlugs } from "@/config/services";
import { pricingContextLinks } from "@/config/pricing";
import { buildMetadataFor } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BrandImage } from "@/components/ui/BrandImage";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { PageIntro } from "@/components/sections/PageIntro";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { BeforeYourVisit } from "@/components/services/BeforeYourVisit";
import { Reveal } from "@/components/motion/Reveal";

export const dynamicParams = false;

type ServiceRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServiceRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return buildMetadataFor({
    title: service.name,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: ServiceRouteProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.relatedSlugs
    .map((relatedSlug) => getService(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const faqItems = service.faqs.map((faq, index) => ({
    id: `${service.slug}-${index}`,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Service"
        heading={service.headline}
        intro={service.intro}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      />

      <Section labelledBy="service-overview-heading">
        <Container>
          <h2 id="service-overview-heading" className="sr-only">
            {service.name} overview
          </h2>
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
              <BrandImage
                imageKey={service.imageKey}
                className="w-full rounded-xl object-cover"
                sizes="(min-width: 1280px) 486px, (min-width: 1024px) 407px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
              />

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-lg">Common Problems</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
                    {service.commonProblems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg">Warning Signs</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
                    {service.warningSigns.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section surface="muted" labelledBy="service-assessment-heading">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal>
              <div>
                <h2 id="service-assessment-heading" className="text-2xl">
                  What an Assessment Includes
                </h2>
                <ul className="mt-4 space-y-3">
                  {service.assessmentIncludes.map((item) => (
                    <li key={item} className="text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6">
                  <Link
                    href={pricingContextLinks.service.href}
                    className="inline-link-arrow inline-flex items-center gap-2 text-sm font-semibold text-blue underline-offset-2 hover:underline"
                  >
                    {pricingContextLinks.service.label}
                    <Icon name="arrow-right" className="inline-link-arrow-icon h-4 w-4" />
                  </Link>
                </p>
              </div>
            </Reveal>
            <Reveal index={1}>
              <div>
                <h2 className="text-2xl">Benefits of Addressing It Early</h2>
                <ul className="mt-4 space-y-3">
                  {service.benefits.map((item) => (
                    <li key={item} className="text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section labelledBy="service-faq-heading">
        <Container size="narrow">
          <h2 id="service-faq-heading" className="text-2xl md:text-3xl">
            {service.name} Questions
          </h2>
          <div className="mt-8">
            <FaqAccordion items={faqItems} />
          </div>
        </Container>
      </Section>

      <Section surface="muted" labelledBy="related-services-heading">
        <Container>
          <Reveal>
            <h2 id="related-services-heading" className="text-2xl">
              Related Services
            </h2>
          </Reveal>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {related.map((item, index) => (
              <Reveal key={item.slug} as="li" index={index}>
                <Card className="flex h-full flex-col">
                  <h3 className="text-lg">{item.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">
                    {item.description}
                  </p>
                  <Button
                    href={`/services/${item.slug}`}
                    variant="outline"
                    className="mt-4 w-full"
                  >
                    View {item.name}
                  </Button>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <BeforeYourVisit config={service.beforeVisit} />

      <Section surface="dark">
        <Container size="narrow" className="text-center">
          <h2 className="text-2xl text-white md:text-3xl">
            Request {service.shortName} Support
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-footer-text">
            Share the details through the request form so the team can follow
            up to discuss next steps.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/#estimate" variant="primary" size="lg">
              Request a Free Estimate
            </Button>
            <Button
              href={business.phoneUri}
              variant="outline"
              size="lg"
              aria-label={`Call ${business.phoneDisplay}`}
            >
              Call {business.phoneDisplay}
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
