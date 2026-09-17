import type { FaqItem } from "@/types";

export const faqHeading = "Frequently Asked Questions";

export const faqSupportingText =
  "Common questions about the services, coverage and request process presented in this concept.";

export const faqs: readonly FaqItem[] = [
  {
    id: "services",
    question: "What plumbing services are available?",
    answer:
      "The concept presents drain cleaning, leak repair, water-heater services, pipe repair, toilet and faucet repair, sump-pump services, sewer-line services and general plumbing support. Each service page explains common problems, warning signs and what an assessment may include.",
  },
  {
    id: "areas",
    question: "Which areas are included?",
    answer:
      "The demonstration service area covers Columbus and nearby communities including Dublin, Westerville, Hilliard, Grove City, Gahanna, Reynoldsburg and Worthington. A ZIP-code checker on the homepage and the Service Areas page shows how coverage could be presented.",
  },
  {
    id: "estimate-online",
    question: "Can I request an estimate online?",
    answer:
      "Yes. The multi-step estimate form collects the service, location, problem details and preferred contact information. In this portfolio demonstration the request is prepared locally and no real appointment is created.",
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
      "The Emergency page explains how urgent plumbing problems such as burst pipes, sewer backups and major blockages can be presented. Hours are shown clearly, and no 24/7 availability or technician dispatch is promised. For gas leaks, electrical danger or flooding that threatens personal safety, contact the appropriate emergency service.",
  },
  {
    id: "response-time",
    question: "How quickly will someone respond?",
    answer:
      "Response times depend on availability, the type of request and the time it is submitted. This demonstration does not promise a specific response window or a confirmed appointment time.",
  },
  {
    id: "financing",
    question: "Are financing options available?",
    answer:
      "The Financing page explains how payment options are typically presented for larger projects such as water-heater replacement, sewer work and larger installations. Financing integrations would be configured for a real client business, and this demonstration does not provide financing.",
  },
  {
    id: "real-company",
    question: "Is ClearFlow Plumbing Co. a real company?",
    answer:
      "No. ClearFlow Plumbing Co. is a fictional portfolio concept created by ServiceHarbor Studio to demonstrate a production-quality plumbing website.",
  },
];
