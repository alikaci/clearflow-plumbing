import type { HomePageConfig } from "@/types";
import { business } from "@/config/business";

export const home = {
  hero: {
    eyebrow: `${business.hours.emergencyLabel} \u00b7 Serving Columbus`,
    heading: "Plumbing Help, Without the Runaround.",
    paragraph:
      "Tell us what\u2019s happening, find the right service, and request a clear next step\u2014from urgent leaks to everyday repairs across Columbus.",
    paragraphCompact:
      "Tell us what\u2019s happening and request a clear next step across Columbus.",
    primaryCtaLabel: "Tell Us What\u2019s Happening",
    primaryCtaHref: "#problem-chooser",
    secondaryCtaLabel: `Call ${business.phoneDisplay}`,
    tertiaryLabel: "Request a Free Estimate",
    tertiaryHref: "#estimate",
    proofCues: [
      {
        label: "Upfront Estimates",
        detail: "Review the work before you decide",
        icon: "receipt",
      },
      {
        label: "Problem-Led Routing",
        detail: "Start from the symptom, not the jargon",
        icon: "pipe",
      },
    ],
    imageKey: "heroTechnician",
    imageFocalPoint: "50% 38%",
    imageSizes:
      "(min-width: 1024px) 46vw, (min-width: 640px) 92vw, 100vw",
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
        description: "Review the proposed work before making a final decision.",
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
  finalCta: {
    heading: "Ready to Get the Plumbing Problem Looked At?",
    text: "Call directly or send the service details online in just a few steps.",
    primaryLabel: "Request a Free Estimate",
    primaryHref: "#estimate",
    secondaryLabel: "Call (614) 555-0147",
    secondaryHref: "tel:+16145550147",
  },
  optionalFeatures: {
    heading: "More Ways ClearFlow Supports Customers",
    supportingText:
      "Everything a homeowner needs before deciding, from project photos to seasonal offers and service agreements.",
    tiles: [
      {
        flag: "gallery",
        title: "Project Gallery",
        description:
          "Before-and-after presentation for common plumbing projects, with accessible side-by-side cards.",
        href: "/gallery",
        linkLabel: "View the gallery",
      },
      {
        flag: "specialOffers",
        title: "Current Offers",
        description:
          "A structured way to present seasonal promotions and first-visit offers without countdown gimmicks.",
        href: "/offers",
        linkLabel: "See the offers",
      },
      {
        flag: "membership",
        title: "ClearFlow Care Plan",
        description:
          "An optional membership concept covering priority handling, reminders and maintenance checks.",
        href: "/membership",
        linkLabel: "Explore membership",
      },
      {
        flag: "financing",
        title: "Financing Information",
        description:
          "How payment options would be introduced for larger projects such as water heaters and sewer work.",
        href: "/financing",
        linkLabel: "Read about financing",
      },
      {
        flag: "onlineBooking",
        title: "Booking Preview",
        description:
          "A simulated scheduling flow that shows how appointment selection could feel for a real business.",
        href: "/book",
        linkLabel: "Try the booking preview",
      },
      {
        flag: "costRangeTool",
        title: "Request Guidance Tool",
        description:
          "A short guidance tool that explains why an inspection is needed before pricing is discussed.",
        href: "/services",
        linkLabel: "Use the guidance tool",
      },
    ],
  },
} satisfies HomePageConfig;
