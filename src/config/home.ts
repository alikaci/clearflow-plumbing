import type { HomePageConfig } from "@/types";

export const home = {
  hero: {
    eyebrow: "Professional Plumbing Support Across Columbus",
    heading: "Reliable Plumbing Help, Without the Guesswork",
    paragraph:
      "From leaking pipes and blocked drains to water-heater problems, ClearFlow makes it easy to request professional plumbing support across Columbus and surrounding communities.",
    trustPoints: [
      "Clear Communication",
      "Upfront Estimates",
      "Respectful Service",
      "Easy Online Requests",
    ],
  },
  reputation: {
    rating: "4.9",
    ratingLabel: "Average Rating",
    reviewCount: "800+ Customer Reviews",
    highlights: ["Customer-Focused Service", "Columbus Area Coverage"],
    note: "Sample reputation metrics shown for concept demonstration.",
  },
  emergency: {
    heading: "Dealing With an Urgent Plumbing Problem?",
    text: "Leaks, backups and broken pipes can cause serious damage when left unattended. Tell us what is happening and request assistance.",
    callLabel: "Call Now",
    callHref: "tel:+16145550147",
    requestLabel: "Request Urgent Help",
    requestHref: "#estimate",
    safetyNote:
      "For gas leaks, electrical danger, flooding that threatens personal safety, or another immediate emergency, contact the appropriate emergency service.",
  },
  servicesSection: {
    heading: "Plumbing Services for the Problems Homeowners Face Most",
    supportingText:
      "Explore common plumbing needs and choose the option that best matches what is happening in your home.",
  },
  whyChoose: {
    heading: "A Simpler Way to Request Plumbing Service",
    points: [
      {
        title: "Clear Communication",
        description:
          "Understand the next step without confusing technical language.",
      },
      {
        title: "Upfront Estimates",
        description:
          "Review the proposed work before making a final decision.",
      },
      {
        title: "Respect for Your Home",
        description:
          "A service experience designed around care, cleanliness and communication.",
      },
      {
        title: "Convenient Requests",
        description: "Call directly or send the details online from any device.",
      },
      {
        title: "Local Service Information",
        description: "Quickly check services, areas and operating hours.",
      },
      {
        title: "Follow-Up Support",
        description:
          "Keep service details and next steps clear after the initial request.",
      },
    ],
  },
  process: {
    heading: "Request Service in Three Simple Steps",
    steps: [
      {
        step: 1,
        title: "Tell Us What Is Happening",
        description: "Choose a service and describe the plumbing problem.",
      },
      {
        step: 2,
        title: "Confirm the Details",
        description: "Share your location and preferred contact time.",
      },
      {
        step: 3,
        title: "Receive the Next Step",
        description:
          "The company reviews the request and follows up to discuss availability and pricing.",
      },
    ],
  },
  estimatePlaceholder: {
    heading: "Online Request Form Coming in the Next Build Phase",
    text: "The full multi-step estimate request experience will be connected here.",
  },
  finalCta: {
    heading: "Ready to Get the Plumbing Problem Looked At?",
    text: "Call directly or send the service details online in just a few steps.",
    primaryLabel: "Request a Free Estimate",
    primaryHref: "#estimate",
    secondaryLabel: "Call (614) 555-0147",
    secondaryHref: "tel:+16145550147",
  },
} satisfies HomePageConfig;