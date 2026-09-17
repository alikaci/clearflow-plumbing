import type { MembershipBenefit } from "@/types";

export const membershipName = "ClearFlow Care Plan";

export const membershipNote =
  "Optional membership feature shown for demonstration. No membership can be purchased through this website.";

export const membershipIntroduction =
  "A membership concept for homeowners who prefer a predictable, ongoing relationship with their plumbing service. The Care Plan would be presented as an optional add-on alongside standard service requests.";

export const membershipBenefits: readonly MembershipBenefit[] = [
  {
    title: "Priority request handling",
    description:
      "Member requests would be reviewed ahead of standard requests when the schedule allows.",
  },
  {
    title: "Annual visual plumbing check",
    description:
      "A yearly walkthrough to note visible wear, leaks or fixtures that may need attention.",
  },
  {
    title: "Service reminders",
    description:
      "Optional reminders for maintenance such as water-heater checks or seasonal preparation.",
  },
  {
    title: "Member-only offers",
    description:
      "Access to promotions that would be reserved for Care Plan members.",
  },
  {
    title: "Future service-history capability",
    description:
      "A planned feature where past requests and recommendations could be reviewed in one place.",
  },
  {
    title: "Discount options",
    description:
      "Configurable member pricing on selected services, defined by the business.",
  },
];
