import type { Metadata } from "next";
import { seo } from "@/config/seo";

type RouteId = keyof typeof seo.routes;

export function buildMetadataFor(input: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: `${seo.siteUrl}${input.path}` },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
    openGraph: {
      title: `${input.title} | ${seo.siteName}`,
      description: input.description,
      url: `${seo.siteUrl}${input.path}`,
      siteName: seo.siteName,
      locale: "en_US",
      type: "website",
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
