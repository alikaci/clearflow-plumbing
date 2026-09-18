import type { Metadata } from "next";
import { seo } from "@/config/seo";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site-url";

type RouteId = keyof typeof seo.routes;

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
