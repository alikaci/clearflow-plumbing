import type { Metadata } from "next";
import "./globals.css";
import { SkipLink } from "@/components/layout/SkipLink";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";

export const metadata: Metadata = {
  title: "ClearFlow Plumbing Co.",
  description: "Foundation initialized.",
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
      </body>
    </html>
  );
}