import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

/* TEMPORARY Phase 1A shell preview. Replaced by the real homepage in a later phase. */

export default function Home() {
  return (
    <main id="main-content">
      <Section>
        <Container>
          <Badge variant="blue">Phase 1A layout preview</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl">ClearFlow Plumbing Co.</h1>
          <p className="mt-3 max-w-xl text-lg text-muted">
            Global layout and design foundation initialized.
          </p>
        </Container>
      </Section>

      <Section surface="muted">
        <Container>
          <h2 className="text-2xl md:text-3xl">UI primitives preview</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="#estimate" variant="primary">
              Request a Free Estimate
            </Button>
            <Button href="#estimate" variant="secondary">
              Call Now
            </Button>
            <Button href="#estimate" variant="outline">
              Outline link
            </Button>
            <Button href="#estimate" variant="ghost">
              Ghost link
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <Badge variant="orange">Badge</Badge>
              <h3 className="mt-3 text-xl">Card heading</h3>
              <p className="mt-2 text-muted">
                Rounded surface with border and padding.
              </p>
            </Card>
            <Card elevated>
              <Badge variant="neutral">Elevated</Badge>
              <h3 className="mt-3 text-xl">Card heading</h3>
              <p className="mt-2 text-muted">
                Same card with a subtle shadow.
              </p>
            </Card>
            <Card>
              <Badge variant="blue">Blue</Badge>
              <h3 className="mt-3 text-xl">Card heading</h3>
              <p className="mt-2 text-muted">
                Flexible container for future sections.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section id="estimate">
        <Container>
          <h2 className="text-2xl md:text-3xl">Estimate anchor target</h2>
          <p className="mt-3 max-w-2xl text-muted">
            CTAs across the shell link to #estimate. The estimate form arrives
            with the homepage in a later phase; for now this section is the
            target.
          </p>
        </Container>
      </Section>
    </main>
  );
}