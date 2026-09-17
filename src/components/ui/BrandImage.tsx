import Image from "next/image";
import { images } from "@/config/images";
import type { ImageKey } from "@/types";
import { PlaceholderArt } from "./PlaceholderArt";

type BrandImageProps = {
  imageKey: ImageKey;
  className?: string;
  sizes?: string;
};

/*
Renders the final local photo when the manifest entry is available, otherwise a
branded SVG fallback at the same aspect ratio. Swapping in a real image only
requires setting `available: true` in the manifest.
*/
export function BrandImage({ imageKey, className, sizes }: BrandImageProps) {
  const asset = images[imageKey];

  if (!asset.available) {
    return <PlaceholderArt imageKey={imageKey} className={className} />;
  }

  return (
    <Image
      src={asset.src}
      alt={asset.decorative ? "" : asset.alt}
      aria-hidden={asset.decorative ? true : undefined}
      width={asset.width}
      height={asset.height}
      priority={asset.priority}
      sizes={sizes}
      className={className}
    />
  );
}
