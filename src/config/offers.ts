import type { Offer } from "@/types";

export const offersNote =
  "Sample offer presentation. Availability and terms would be configured for the real business.";

export const offers: readonly Offer[] = [
  {
    id: "first-visit",
    title: "$25 Off a First Service Visit",
    description:
      "A sample introductory offer for new customers requesting their first plumbing service.",
    detail:
      "In a real deployment this offer would be tied to defined eligibility, a service list and an expiration policy configured by the business.",
  },
  {
    id: "free-estimate",
    title: "Free Estimate for Selected Installations",
    description:
      "A sample estimate offer for larger installation conversations such as water heaters or fixture replacements.",
    detail:
      "For a live business, this offer would specify which installations qualify and how the estimate is scheduled.",
  },
  {
    id: "water-heater-assessment",
    title: "Water Heater Assessment Offer",
    description:
      "A sample seasonal offer focused on water-heater performance, maintenance and replacement questions.",
    detail:
      "A real version would include the assessment scope, any included checks and the terms shown at the time of booking.",
  },
];
