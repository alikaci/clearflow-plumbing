import { home } from "@/config/home";
import { serviceSummaries } from "@/config/services";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ServiceCard } from "@/components/services/ServiceCard";

export function ServiceGrid() {
  const { servicesSection } = home;

  return (
    <Section surface="muted" labelledBy="services-heading">
      <Container>
        <div className="max-w-2xl">
          <h2 id="services-heading" className="text-2xl md:text-3xl">
            {servicesSection.heading}
          </h2>
          <p className="mt-3 text-muted">{servicesSection.supportingText}</p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {serviceSummaries.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
