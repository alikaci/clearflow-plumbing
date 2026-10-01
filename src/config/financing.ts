import type { FinancingUseCase } from "@/types";

export const financingNotice =
  "Financing is presented for information only. No application is submitted, no credit check is run and no payment plan is arranged through this website.";

export const financingIntroduction =
  "Larger plumbing projects are often easier to plan when payment options are clear from the start. Ask the office about plan structures, typical terms and what is usually required to get started.";

export const financingUseCases: readonly FinancingUseCase[] = [
  {
    title: "Water heater replacement",
    description:
      "Replacement and installation projects where homeowners may prefer to spread the cost over time.",
  },
  {
    title: "Sewer work",
    description:
      "Larger sewer-line assessments and repairs that often require planning and staged decisions.",
  },
  {
    title: "Larger plumbing installations",
    description:
      "Whole-property upgrades such as fixture replacement or repiping conversations that benefit from a clear budget discussion.",
  },
];

export const financingDisclaimer =
  "No application is started on this page. Social Security numbers, income details, bank information, payment-card numbers, dates of birth and employment records are never collected here, and no real lender branding is displayed.";
