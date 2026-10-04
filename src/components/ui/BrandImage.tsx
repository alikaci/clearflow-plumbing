import Image from "next/image";
import { images } from "@/config/images";
import type { ImageKey } from "@/types";
import { PlaceholderArt } from "./PlaceholderArt";

type BrandImageProps = {
  imageKey: ImageKey;
  className?: string;
  sizes?: string;
  /**
   * CSS `object-position` for editorial crops. Separate from `className` so a
   * focal point stays a typed, config-driven value instead of an arbitrary
   * utility string, and so the fallback art can mirror the same framing.
   */
  objectPosition?: string;
};

/*
Renders the final local photo when the manifest entry is available, otherwise a
branded SVG fallback at the same aspect ratio. Swapping in a real image only
requires setting `available: true` in the manifest.
*/
export function BrandImage({ imageKey, className, sizes, objectPosition }: BrandImageProps) {
  const asset = images[imageKey];
  const position = objectPosition ? { objectPosition } : undefined;

  if (!asset.available) {
    return <PlaceholderArt imageKey={imageKey} className={className} objectPosition={objectPosition} />;
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
      style={position}
    />
  );
}
