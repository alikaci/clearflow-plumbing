import type { Metadata } from "next";
import "./globals.css";
import { seo } from "@/config/seo";
import { SkipLink } from "@/components/layout/SkipLink";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Assistant } from "@/components/assistant/Assistant";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
/*
The opengraph-image file convention is resolved against metadataBase. Next.js
defaults metadataBase to http://localhost:3000 when it is not set, which would
emit an unverified absolute image URL. When no real origin is configured we
explicitly clear the images so no localhost or assumed domain is published.
*/
const openGraphImage = siteUrl
  ? toAbsoluteUrl(siteUrl, "/opengraph-image")
  : null;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: seo.defaultTitle,
    template: seo.titleTemplate,
  },
  description: seo.defaultDescription,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    siteName: seo.siteName,
    locale: "en_US",
    type: "website",
    ...(siteUrl ? { url: siteUrl } : {}),
    images: openGraphImage ? [openGraphImage] : [],
  },
  twitter: {
    images: openGraphImage ? [openGraphImage] : [],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        <UtilityBar />
        <SiteHeader />
        {children}
        <Footer />
        <MobileActionBar />
        <Assistant />
      </body>
    </html>
  );
}
