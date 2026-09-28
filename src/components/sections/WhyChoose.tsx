import { home } from "@/config/home";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

export function WhyChoose() {
  const { whyChoose } = home;

  return (
    <Section ariaLabel="Why choose ClearFlow">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div>
              <h2 className="text-2xl md:text-3xl">{whyChoose.heading}</h2>
            </div>
          </Reveal>

          <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {whyChoose.points.map((point, index) => (
              <Reveal
                key={point.title}
                as="li"
                index={index}
                className="border-l-2 border-blue/40 pl-4"
              >
                <h3 className="text-base font-semibold text-navy">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{point.description}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}