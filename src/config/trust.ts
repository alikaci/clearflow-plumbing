import type { TrustConfig } from "@/types";
import { business } from "@/config/business";

/*
Trust signals.

These are the trust positions a real, established US plumbing company would
configure for itself. They are ordinary marketing claims rather than
credentials, and that distinction is deliberate:

- No license number, registration number or insurer policy number is present.
- No external verification URL is present, because nothing here can be checked
  against a public registry.
- No third-party badge, seal or mark is used. Every glyph is an original
  ClearFlow icon drawn in src/components/ui/Icon.tsx.
- No endorsement is implied from a government body, trade association or
  review platform.

The whole block stays config-driven so a real client can replace it with
verified information, or with different positioning, without touching the
component.
*/
export const trust: TrustConfig = {
  heading: "Why Columbus Chooses ClearFlow",
  supportingText:
    "The standards ClearFlow is built around, from the first phone call to the final invoice.",
  signals: [
    {
      id: "licensed-insured",
      icon: "shield",
      title: "Licensed & Insured",
      description:
        "Every job is covered by state licensing requirements and company liability coverage.",
    },
    {
      id: "background-checked",
      icon: "badge",
      title: "Background-Checked Technicians",
      description:
        "Technicians are screened before they are allowed to enter a customer's home.",
    },
    {
      id: "upfront-pricing",
      icon: "receipt",
      title: "Upfront Pricing",
      description:
        "You approve the price before work starts. Changes are quoted and approved first.",
    },
    {
      id: "satisfaction-guarantee",
      icon: "handshake",
      title: "Satisfaction Guarantee",
      description:
        "If the completed work does not meet the agreed scope, it is corrected at no charge.",
    },
    {
      id: "emergency-service",
      icon: "clock",
      title: business.hours.emergencyLabel,
      description:
        "Urgent plumbing situations are taken around the clock, including nights and weekends.",
    },
    {
      id: "financing",
      icon: "card",
      title: "Financing Available",
      description:
        "Payment-plan options can be discussed with the office before work is scheduled.",
    },
  ],
};