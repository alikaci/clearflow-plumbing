import type { GalleryPair } from "@/types";
import { BrandImage } from "@/components/ui/BrandImage";

export function GalleryGrid({ pairs }: { pairs: readonly GalleryPair[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {pairs.map((pair) => (
        <li key={pair.id}>
          <article className="flex h-full flex-col rounded-xl border border-border bg-white p-4">
            {/* The pair stays side by side on every phone width so the
                comparison reads horizontally; only the gutter widens. */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <figure>
                <BrandImage
                  imageKey={pair.beforeKey}
                  className="w-full rounded-lg object-cover"
                  sizes="(min-width: 1280px) 13vw, (min-width: 768px) 22vw, (min-width: 640px) 45vw, calc(50vw - 2.5rem)"
                />
                <figcaption className="mt-2 text-sm font-medium text-muted">
                  Before
                </figcaption>
              </figure>
              <figure>
                <BrandImage
                  imageKey={pair.afterKey}
                  className="w-full rounded-lg object-cover"
                  sizes="(min-width: 1280px) 13vw, (min-width: 768px) 22vw, (min-width: 640px) 45vw, calc(50vw - 2.5rem)"
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
