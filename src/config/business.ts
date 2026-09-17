import type { BusinessConfig } from "@/types";

const serviceArea = "Columbus and surrounding communities";

export const business = {
  name: "ClearFlow Plumbing Co.",
  shortName: "ClearFlow",
  creator: "ServiceHarbor Studio",
  region: "Columbus, Ohio and surrounding communities",
  serviceArea,
  phoneDisplay: "(614) 555-0147",
  phoneUri: "tel:+16145550147",
  email: {
    display: "hello@clearflow.example",
    href: null,
  },
  hours: {
    short: "Mon–Sat, 7:00 AM–7:00 PM",
    full: "Monday–Saturday, 7:00 AM–7:00 PM",
  },
  primaryCta: {
    label: "Request a Free Estimate",
    href: "#estimate",
  },
  secondaryCta: {
    label: "Call Now",
    href: "tel:+16145550147",
  },
  mobileBar: {
    call: {
      label: "Call Now",
      href: "tel:+16145550147",
    },
    request: {
      label: "Request Service",
      href: "#estimate",
    },
  },
  disclosures: {
    fictional:
      "ClearFlow Plumbing Co. is a fictional business created by ServiceHarbor Studio for portfolio demonstration. No real plumbing service, appointment, financing, offer or emergency response is provided through this website.",
    aiImagery:
      "Visuals may include AI-generated imagery created for this fictional portfolio concept.",
    copyright:
      "© 2026 ClearFlow Plumbing Co. Concept. Designed and developed by ServiceHarbor Studio.",
  },
  description: `Professional plumbing-services website concept for ${serviceArea}.`,
  socialLinks: [],
} satisfies BusinessConfig;