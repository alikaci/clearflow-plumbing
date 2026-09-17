import type { GalleryPair } from "@/types";
import { BrandImage } from "@/components/ui/BrandImage";

export function GalleryGrid({ pairs }: { pairs: readonly GalleryPair[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {pairs.map((pair) => (
        <li key={pair.id}>
          <article className="flex h-full flex-col rounded-xl border border-border bg-white p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <figure>
                <BrandImage
                  imageKey={pair.beforeKey}
                  className="w-full rounded-lg"
                  sizes="(min-width: 1280px) 16vw, (min-width: 768px) 38vw, 88vw"
                />
                <figcaption className="mt-2 text-sm font-medium text-muted">
                  Before
                </figcaption>
              </figure>
              <figure>
                <BrandImage
                  imageKey={pair.afterKey}
                  className="w-full rounded-lg"
                  sizes="(min-width: 1280px) 16vw, (min-width: 768px) 38vw, 88vw"
                />
                <figcaption className="mt-2 text-sm font-medium text-muted">
                  After
                </figcaption>
              </figure>
            </div>
            <h3 className="mt-5 text-lg">{pair.category}</h3>
            <p className="mt-2 text-sm text-muted">{pair.description}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
