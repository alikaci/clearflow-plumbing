import type { ServiceSummary } from "@/types";

export const services: readonly ServiceSummary[] = [
  {
    slug: "drain-cleaning",
    name: "Drain Cleaning",
    description:
      "Help for slow, blocked or overflowing drains using a clear diagnostic process.",
    icon: "drain",
    requestHref: "#estimate",
  },
  {
    slug: "leak-repair",
    name: "Leak Repair",
    description:
      "Identify and address visible leaks before they lead to larger water-damage problems.",
    icon: "leak",
    requestHref: "#estimate",
  },
  {
    slug: "water-heater-services",
    name: "Water Heater Services",
    description:
      "Support for water-heater problems, maintenance, replacement and installation requests.",
    icon: "water-heater",
    requestHref: "#estimate",
  },
  {
    slug: "pipe-repair",
    name: "Pipe Repair",
    description:
      "Assessment and repair options for damaged, leaking or aging plumbing lines.",
    icon: "pipe",
    requestHref: "#estimate",
  },
  {
    slug: "toilet-and-faucet-repair",
    name: "Toilet and Faucet Repair",
    description:
      "Practical support for running toilets, dripping faucets and damaged fixtures.",
    icon: "fixture",
    requestHref: "#estimate",
  },
  {
    slug: "sump-pump-services",
    name: "Sump Pump Services",
    description:
      "Inspection, maintenance and replacement support for sump-pump systems.",
    icon: "sump-pump",
    requestHref: "#estimate",
  },
  {
    slug: "sewer-line-services",
    name: "Sewer Line Services",
    description:
      "Request an assessment for backups, repeated blockages and suspected sewer-line problems.",
    icon: "sewer",
    requestHref: "#estimate",
  },
  {
    slug: "general-plumbing-support",
    name: "General Plumbing Support",
    description:
      "Not sure which service you need? Describe the problem and request an assessment.",
    icon: "wrench",
    requestHref: "#estimate",
  },
];