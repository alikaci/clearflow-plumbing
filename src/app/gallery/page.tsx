import { gallery } from "@/config/gallery";
import { buildMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata = buildMetadata("gallery");

export default function GalleryPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageIntro
        eyebrow="Gallery"
        heading={gallery.heading}
        intro={gallery.supportingText}
      />

      <Section labelledBy="gallery-grid-heading">
        <Container>
          <h2 id="gallery-grid-heading" className="sr-only">
            Before and after project cards
          </h2>
          <GalleryGrid pairs={gallery.pairs} />
          <p className="mt-6 text-sm text-muted">{gallery.note}</p>
        </Container>
      </Section>

      <Section surface="dark">
        <Container size="narrow" className="text-center">
          <h2 className="text-2xl text-white md:text-3xl">
            Have a Similar Project?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-footer-text">
            Share the details and the team can follow up to discuss next steps.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/#estimate" variant="primary" size="lg">
              Request a Free Estimate
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
