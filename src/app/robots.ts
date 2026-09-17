import type { MetadataRoute } from "next";
import { seo } from "@/config/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    host: seo.siteUrl,
  };
}
