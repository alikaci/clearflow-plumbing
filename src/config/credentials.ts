import type { CredentialsConfig } from "@/types";

/*
ClearFlow ships with verified credentials disabled and empty.

No real client credential data exists for this fictional business, so nothing
is listed here and no placeholder registration number, logo or example claim is
added. The section renders nothing until a real, reviewer-approved credential
is supplied alongside the rest of the configuration.

`enabled: false` also means the component returns null even if items are added
later, so a half-finished rollout cannot publish a claim by accident.
*/
export const credentials: CredentialsConfig = {
  enabled: false,
  heading: "Verified Credentials",
  intro:
    "Credentials listed here would be independently verifiable through a public registry.",
  items: [],
};
