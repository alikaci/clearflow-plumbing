import type { PricingConfig, PricingContextLink } from "@/types";

/*
This page explains the pricing process only. It deliberately contains no
amounts, rates, ranges, "starting at" claims, fees, discounts or warranties, so
every string below describes how an estimate is produced and approved rather
than what anything would cost.
*/
export const pricing = {
  eyebrow: "PRICING PROCESS",
  heading: "Clear Estimates Before Work Begins",
  intro:
    "A professional plumbing company should explain the scope of work and receive approval before starting. This concept demonstrates how that process could be presented clearly online.",
  disclosure:
    "ClearFlow Plumbing Co. is fictional. No real pricing, estimates or plumbing services are provided through this website.",

  process: {
    heading: "How Pricing Works",
    steps: [
      {
        step: 1,
        title: "Tell Us What’s Happening",
        description:
          "Choose the closest service and describe the problem, including when it started and what you have observed.",
      },
      {
        step: 2,
        title: "Initial Review",
        description:
          "The business reviews the request and determines whether an appointment, additional information or another next step is appropriate.",
      },
      {
        step: 3,
        title: "On-Site Assessment",
        description:
          "A qualified technician would inspect the affected plumbing and confirm the work that may be required.",
      },
      {
        step: 4,
        title: "Clear Estimate",
        description:
          "The customer would receive an explanation of the proposed work and the applicable estimate before work begins.",
      },
      {
        step: 5,
        title: "Customer Approval",
        description:
          "No work should begin until the customer understands the proposed scope and approves it.",
      },
    ],
  },
  processNote:
    "If the scope changes after work begins, the updated work and cost should be explained and approved before proceeding.",

  costFactorsHeading: "What Can Affect the Cost?",
  costFactors: [
    {
      title: "Type of plumbing problem",
      description:
        "The nature and location of the problem influence the assessment and required work.",
      icon: "wrench",
    },
    {
      title: "Accessibility",
      description:
        "Work behind walls, beneath floors or in difficult-to-reach areas may require additional steps.",
      icon: "pipe",
    },
    {
      title: "Materials and replacement parts",
      description:
        "The required fixture, fitting, pipe or equipment affects the final scope.",
      icon: "fixture",
    },
    {
      title: "Urgency and appointment timing",
      description:
        "Availability and scheduling policies can differ between service providers.",
      icon: "clock",
    },
    {
      title: "Permits or inspections",
      description:
        "Some projects may require permits or inspections depending on the location and scope.",
      icon: "check",
    },
    {
      title: "Additional damage",
      description:
        "An assessment may reveal related damage that was not visible when the request was submitted.",
      icon: "alert",
    },
  ],

  questionsHeading: "Questions to Ask Before Approving Work",
  questions: [
    "Is there a diagnostic or call-out fee?",
    "Will the estimate be provided in writing?",
    "Are labour and replacement parts included?",
    "Does applicable tax apply?",
    "Is a workmanship warranty offered, and what does it cover?",
    "What happens if the required scope changes?",
    "When is payment expected?",
    "Who should the customer contact with follow-up questions?",
  ],
  questionsNote:
    "Policies vary by company and location. Customers should confirm the applicable terms before approving work.",

  ctaHeading: "Ready to Describe the Problem?",
  ctaText:
    "Share the details through the demonstration request flow and see how a professional service request could be organized.",
  ctaPrimaryLabel: "Request a Service",
  // The canonical request destination, resolved from the same hash target the
  // homepage and service pages use.
  ctaPrimaryHref: "#estimate",
  ctaSecondaryLabel: "Explore Financing Options",
  ctaSecondaryHref: "/financing",
} satisfies PricingConfig;

/*
One small contextual link per page. Each page uses at most one, and each label is
written for the content it sits next to rather than repeating a promotional
block.
*/
export const pricingContextLinks = {
  service: {
    label: "Learn how pricing works",
    href: "/pricing",
  },
  financing: {
    label: "Understand the estimate process",
    href: "/pricing",
  },
  booking: {
    label: "See how estimates are reviewed",
    href: "/pricing",
  },
} satisfies Record<string, PricingContextLink>;
