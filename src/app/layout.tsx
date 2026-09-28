import type { Metadata, Viewport } from "next";
import "./globals.css";
import { seo } from "@/config/seo";
import { SkipLink } from "@/components/layout/SkipLink";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Assistant } from "@/components/assistant/Assistant";
import { getSiteUrl } from "@/lib/site-url";
import { getSocialImage } from "@/lib/metadata";

const siteUrl = getSiteUrl();
/*
metadataBase must never fall back to http://localhost:3000, so it is only set
when a real origin is configured. Page-level metadata built by buildMetadata()
carries its own openGraph object, which replaces this one per key, so the social
image is resolved by the shared getSocialImage() helper in both places.
*/
const socialImage = getSocialImage();

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
    images: socialImage,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    images: socialImage,
  },
};

/*
The brand navy matches the --color-navy custom property in globals.css. It is
only a theme color hint for mobile browser chrome; nothing here is a PWA.
*/
export const viewport: Viewport = {
  themeColor: "#0b1f33",
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
