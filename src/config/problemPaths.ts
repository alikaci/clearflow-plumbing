import type { ProblemPath } from "@/types";

export const problemPaths: readonly ProblemPath[] = [
  {
    id: "active-water-leak",
    label: "Active Water Leak",
    description: "Visible dripping, moisture or a puddle under a fixture.",
    icon: "leak",
    href: "/services/leak-repair",
    linkLabel: "See leak repair support",
  },
  {
    id: "slow-or-blocked-drain",
    label: "Slow or Blocked Drain",
    description: "Sinks or showers draining slowly, backing up or gurgling.",
    icon: "drain",
    href: "/services/drain-cleaning",
    linkLabel: "See drain cleaning",
  },
  {
    id: "no-hot-water",
    label: "No Hot Water",
    description: "Water not reaching temperature, or an aging unit.",
    icon: "water-heater",
    href: "/services/water-heaters",
    linkLabel: "See water heater services",
  },
  {
    id: "toilet-or-faucet",
    label: "Toilet or Faucet Problem",
    description: "A running toilet, dripping faucet or loose fixture.",
    icon: "fixture",
    href: "/services/toilets-faucets",
    linkLabel: "See fixture repair",
  },
  {
    id: "sewer-backup",
    label: "Sewer Backup or Repeated Blockages",
    description:
      "Multiple slow drains, recurring backups or gurgling sounds across the house.",
    icon: "sewer",
    href: "/services/sewer-lines",
    linkLabel: "See sewer line services",
    accent: true,
  },
  {
    id: "low-pressure-or-damaged-pipe",
    label: "Low Water Pressure or Damaged Pipe",
    description: "Weak flow, discolored water or an aging line.",
    icon: "pipe",
    href: "/services/pipe-repair",
    linkLabel: "See pipe repair",
  },
  {
    id: "sump-pump-concern",
    label: "Sump Pump Concern",
    description: "Constant running, odd noises or water near the pit.",
    icon: "sump-pump",
    href: "/services/sump-pumps",
    linkLabel: "See sump pump services",
  },
  {
    id: "not-sure",
    label: "Not Sure What's Wrong?",
    description:
 "Something seems off but you are not sure what-describe it and get guidance.",
    icon: "wrench",
    href: "/services/general-plumbing",
    linkLabel: "See general plumbing",
    altCta: { label: "Request an assessment", href: "#estimate" },
  },
];

export const problemChooser = {
  eyebrow: "Common Plumbing Problems",
  heading: "What's happening?",
  supportingText:
    "Choose the option that best matches what you are seeing in your home, and go straight to the service page for that problem.",
};