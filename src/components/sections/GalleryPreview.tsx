import Link from "next/link";
import { gallery } from "@/config/gallery";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export function GalleryPreview() {
  const pairs = gallery.pairs.slice(0, gallery.previewCount);

  return (
    <Section surface="muted" labelledBy="gallery-preview-heading">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 id="gallery-preview-heading" className="text-2xl md:text-3xl">
              {gallery.heading}
            </h2>
            <p className="mt-3 text-muted">{gallery.supportingText}</p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-blue underline-offset-2 hover:underline"
          >
            View the full gallery
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10">
          <GalleryGrid pairs={pairs} />
        </div>

        <p className="mt-6 text-sm text-muted">{gallery.note}</p>
      </Container>
    </Section>
  );
}
