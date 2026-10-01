import { trust } from "@/config/trust";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { IconName } from "@/components/ui/Icon";

/*
Trust signal strip.

Each signal is presented the way an established plumbing company presents its
own standards: an original ClearFlow glyph, a short title and one line of
detail. There is no logo wall, no certification mark, no registry number and no
external verification link, because none of that can be truthfully shown for a
fictional business. The footer disclosure carries the concept context for the
whole site, so no per-card warning is repeated here.
*/
export function TrustSignals() {
  return (
    <Section surface="muted" labelledBy="trust-signals-heading">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <h2 id="trust-signals-heading" className="text-2xl md:text-3xl">
              {trust.heading}
            </h2>
            <p className="mt-3 text-muted">{trust.supportingText}</p>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trust.signals.map((signal, index) => (
            <Reveal
              key={signal.id}
              as="li"
              index={index}
              className="flex gap-4 rounded-xl border border-border bg-white p-5"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue"
              >
                <Icon name={signal.icon as IconName} className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-semibold text-navy">{signal.title}</h3>
                <p className="mt-1.5 text-sm text-muted">
                  {signal.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}