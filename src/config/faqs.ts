import type { FaqItem } from "@/types";
import { business } from "./business";

export const faqHeading = "Frequently Asked Questions";

export const faqSupportingText =
  "Common questions about services, coverage, pricing and the request process.";

export const faqs: readonly FaqItem[] = [
  {
    id: "services",
    question: "What plumbing services are available?",
    answer:
      "ClearFlow handles drain cleaning, leak repair, water-heater services, pipe repair, toilet and faucet repair, sump-pump services, sewer-line services and general plumbing support. Each service page explains common problems, warning signs and what an assessment may include.",
  },
  {
    id: "areas",
    question: "Which areas are included?",
    answer:
      "The service area covers Columbus and nearby communities including Dublin, Westerville, Hilliard, Grove City, Gahanna, Reynoldsburg and Worthington. A ZIP-code checker on the homepage and the Service Areas page shows whether an address is included.",
  },
  {
    id: "estimate-online",
    question: "Can I request an estimate online?",
    answer:
      "Yes. The multi-step estimate form collects the service, location, timing, problem details and preferred contact method. The confirmation screen then shows you exactly what was entered and what happens next.",
  },
  {
    id: "information",
    question: "What information should I include?",
    answer:
      "It helps to describe what is happening, when it started, whether the issue is urgent, and any relevant property details. A short description and, where possible, a photo preview give the best starting point for a conversation.",
  },
  {
    id: "emergency",
    question: "Do you provide emergency service?",
    answer:
      `Yes. ${business.hours.emergencyLabel} are taken for urgent plumbing problems such as burst pipes, sewer backups and major blockages, including nights and weekends, while office hours remain ${business.hours.full}. The Emergency page explains how an urgent request is handled. For gas leaks, electrical danger or flooding that threatens personal safety, contact the appropriate emergency service first.`,
  },
  {
    id: "response-time",
    question: "How quickly will someone respond?",
    answer:
      "Response times depend on current availability, the type of request and when it is submitted. Urgent problems are prioritised ahead of planned work. Call the office if the situation cannot wait.",
  },
  {
    id: "financing",
    question: "Are financing options available?",
    answer:
      "Payment-plan options can be discussed with the office for larger projects such as water-heater replacement, sewer work and larger installations. The Financing page explains the typical structure, what information it usually requires and how to ask about it before work is scheduled.",
  },
  {
    id: "real-company",
    question: "Is ClearFlow Plumbing Co. a real company?",
    answer:
      "No. ClearFlow Plumbing Co. is a fictional portfolio concept created by ServiceHarbor Studio to demonstrate a production-quality plumbing website.",
  },
];
