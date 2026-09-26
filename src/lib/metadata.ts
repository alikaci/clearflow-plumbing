import type { Metadata } from "next";
import { seo } from "@/config/seo";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site-url";

type RouteId = keyof typeof seo.routes;

/*
The social preview image lives at /opengraph-image and is generated in code by
the route handler. It is only referenced from metadata when a real origin is
configured, so no localhost or assumed domain is ever published.

Both the root layout and every page need this value: Next.js merges layout and
page metadata shallowly per top-level key, so a page-level `openGraph` object
replaces the layout one outright, including its `images`. Keeping the helper
here means the image, its dimensions and its alt text cannot drift apart.
*/
export function getSocialImage(): NonNullable<
  NonNullable<Metadata["openGraph"]>["images"]
> {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  return [
    {
      url: toAbsoluteUrl(siteUrl, "/opengraph-image"),
      width: 1200,
      height: 630,
      alt: "ClearFlow Plumbing Co. concept social preview: Reliable Plumbing Help, Without the Guesswork, Columbus, Ohio.",
    },
  ];
}

export function buildMetadataFor(input: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = siteUrl ? toAbsoluteUrl(siteUrl, input.path) : null;

  return {
    title: input.title,
    description: input.description,
    ...(canonical ? { alternates: { canonical } } : {}),
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
    openGraph: {
      title: `${input.title} | ${seo.siteName}`,
      description: input.description,
      siteName: seo.siteName,
      locale: "en_US",
      type: "website",
      ...(canonical ? { url: canonical } : {}),
      images: getSocialImage(),
    },
    twitter: {
      card: "summary_large_image",
      images: getSocialImage(),
    },
  };
}

export function buildMetadata(routeId: RouteId): Metadata {
  const route = seo.routes[routeId];
  return buildMetadataFor({
    title: route.title,
    description: route.description,
    path: route.path,
  });
}
