import type { FinancingUseCase } from "@/types";

export const financingNotice =
  "Financing integrations are available for eligible client businesses. This portfolio demonstration does not provide financing.";

export const financingIntroduction =
  "Larger plumbing projects are often easier to plan when payment options are clear from the start. This page shows how financing information would be introduced for a real client business.";

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
  "This demonstration never collects Social Security numbers, income details, bank information, payment-card numbers, dates of birth or employment information, and it does not display real lender branding.";
