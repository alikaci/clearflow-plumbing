import type { SeoConfig } from "@/types";
import { getSiteUrl } from "@/lib/site-url";

export const seo = {
  siteName: "ClearFlow Plumbing Co.",
  /*
  No public domain is owned and nothing has been deployed. The origin is read
  from NEXT_PUBLIC_SITE_URL and stays null when it is not configured, so no
  canonical, Open Graph URL or robots Host value is emitted for an unverified
  domain. See README.md for deployment configuration.
  */
  siteUrl: getSiteUrl(),
  indexable: false,
  defaultTitle: "ClearFlow Plumbing Co.",
  titleTemplate: "%s | ClearFlow Plumbing Co.",
  defaultDescription:
    "ClearFlow Plumbing Co. is a fictional Columbus plumbing website concept created by ServiceHarbor Studio for portfolio demonstration.",
  openGraphImageKey: "openGraph",
  routes: {
    home: {
      path: "/",
      title: "Plumbing Website Concept",
      description:
        "ClearFlow Plumbing Co. is a fictional Columbus plumbing website concept by ServiceHarbor Studio. Explore the demonstration pages for services, pricing and more.",
    },
    services: {
      path: "/services",
      title: "Plumbing Services",
      description:
        "Explore drain cleaning, leak repair, water-heater services, pipe repair, fixture repair, sump pumps, sewer lines and general plumbing support.",
    },
    emergency: {
      path: "/emergency",
      title: "Urgent Plumbing Help",
      description:
        "Guidance for urgent plumbing problems such as burst pipes, sewer backups and major blockages, with clear hours and safety information.",
    },
    serviceAreas: {
      path: "/service-areas",
      title: "Service Areas",
      description:
        "Check the demonstration service area for Columbus and nearby communities including Dublin, Westerville, Hilliard, Grove City, Gahanna, Reynoldsburg and Worthington.",
    },
    about: {
      path: "/about",
      title: "About the Concept",
      description:
        "ClearFlow Plumbing Co. is a fictional Columbus plumbing brand created to demonstrate a modern local-service website.",
    },
    gallery: {
      path: "/gallery",
      title: "Project Gallery",
      description:
        "Before-and-after project presentation for common plumbing work, shown for concept demonstration.",
    },
    offers: {
      path: "/offers",
      title: "Current Offers",
      description:
        "Sample offer presentation showing how promotions would be configured for a real plumbing business.",
    },
    membership: {
      path: "/membership",
      title: "ClearFlow Care Plan",
      description:
        "An optional membership concept for homeowners, shown for demonstration purposes only.",
    },
    financing: {
      path: "/financing",
      title: "Financing Information",
      description:
        "How financing information would be presented for larger plumbing projects. This demonstration does not provide financing.",
    },
    pricing: {
      path: "/pricing",
      title: "How Pricing Works",
      description:
        "See how a professional plumbing estimate process could be explained clearly before work begins in this fictional portfolio concept.",
    },
    book: {
      path: "/book",
      title: "Booking Preview",
      description:
        "A simulated booking flow showing how appointment scheduling could be presented for a real plumbing business.",
    },
    contact: {
      path: "/contact",
      title: "Contact",
      description:
        "Demonstration phone number, hours, service region and the multi-step request form for ClearFlow Plumbing Co.",
    },
    privacy: {
      path: "/privacy",
      title: "Privacy Notes",
      description:
        "How this fictional portfolio demonstration handles form data, local photo previews and tracking.",
    },
  },
} satisfies SeoConfig;
