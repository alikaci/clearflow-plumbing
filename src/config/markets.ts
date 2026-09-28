import type { MarketId, MarketProfile } from "@/types";

/*
Market profiles hold generic market conventions only.

They never contain business data. ClearFlow's phone number, its 28 Columbus
demonstration ZIP codes, its service areas and its business hours live in
`business`, `serviceAreas` and `features` instead, so switching a profile can
never silently substitute another company's details.

`EU_BASE` is a template rather than a country. The European Union is not an
ISO country, so it carries no country code and cannot be activated until a
concrete country profile supplies real values.
*/
export const marketProfiles: Record<MarketId, MarketProfile> = {
  US: {
    id: "US",
    label: "United States",
    locale: "en-US",
    countryCode: "US",
    currency: "USD",
    postalCode: {
      label: "ZIP Code",
      fieldLabel: "ZIP code",
      shortLabel: "ZIP",
      example: "43215",
    },
    taxLabel: "Tax",
    phoneCountryCode: "+1",
    dateFormat: "MM/DD/YYYY",
    supportsFinancing: true,
    supportsMembership: true,
    requiresOptionalTrackingConsent: false,
    requiresCountryCompletion: false,
    activationNote: null,
  },
  UK: {
    id: "UK",
    label: "United Kingdom",
    locale: "en-GB",
    countryCode: "GB",
    currency: "GBP",
    postalCode: {
      label: "Postcode",
      fieldLabel: "Postcode",
      shortLabel: "Postcode",
      example: "SW1A 1AA",
    },
    taxLabel: "VAT",
    phoneCountryCode: "+44",
    dateFormat: "DD/MM/YYYY",
    supportsFinancing: false,
    supportsMembership: true,
    requiresOptionalTrackingConsent: true,
    requiresCountryCompletion: false,
    activationNote: null,
  },
  EU_BASE: {
    id: "EU_BASE",
    label: "European Union Base",
    /*
    Locale is a neutral base value. A concrete country profile must override
    it, because member states do not share one language or locale.
    */
    locale: "en-IE",
    countryCode: null,
    currency: "EUR",
    postalCode: {
      label: "Postal code",
      fieldLabel: "Postal code",
      shortLabel: "Postal code",
      /* No single EU-wide postal format exists, so no invented example. */
      example: "",
    },
    taxLabel: "VAT",
    phoneCountryCode: null,
    dateFormat: "DD/MM/YYYY",
    supportsFinancing: false,
    supportsMembership: true,
    requiresOptionalTrackingConsent: true,
    requiresCountryCompletion: true,
    activationNote:
      "EU_BASE is a template, not a country. Before activation, a concrete country profile must supply a country code, locale, postal-code format and example, and phone prefix. Country-specific legal, tax, address and consent rules differ and require verification for each market. This is not legal advice.",
  },
};
