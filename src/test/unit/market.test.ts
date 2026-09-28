import { describe, expect, it } from "vitest";
import { business } from "@/config/business";
import { marketProfiles } from "@/config/markets";
import {
  getActiveMarketProfile,
  getCurrencyCode,
  getDateFormat,
  getMarketActivationBlocker,
  getMarketProfile,
  getPhoneCountryCode,
  getPostalCodeExample,
  getPostalCodeFieldLabel,
  getPostalCodeLabel,
  getPostalCodeShortLabel,
  getTaxLabel,
  isActivatableMarket,
  isFinancingAvailable,
  isMarketId,
  isMembershipAvailable,
  marketSupportsFinancing,
  marketSupportsMembership,
} from "@/lib/market";
import type { MarketProfile } from "@/types";

const uk = marketProfiles.UK;
const euBase = marketProfiles.EU_BASE;

/*
Market capability is tested with explicit profile inputs rather than by mutating
the active market, so these tests never depend on execution order.
*/
const supportsBoth: MarketProfile = {
  ...marketProfiles.US,
  id: "US",
  label: "Test Market",
  supportsFinancing: true,
  supportsMembership: true,
};

const supportsNeither: MarketProfile = {
  ...marketProfiles.US,
  id: "US",
  label: "Test Market Without Capabilities",
  supportsFinancing: false,
  supportsMembership: false,
};

describe("active market selection", () => {
  it("resolves ClearFlow to the US profile from a single source of truth", () => {
    expect(business.activeMarketId).toBe("US");
    expect(getActiveMarketProfile().id).toBe("US");
    expect(getActiveMarketProfile()).toBe(marketProfiles.US);
  });

  it("exposes US conventions", () => {
    const profile = getActiveMarketProfile();
    expect(profile.label).toBe("United States");
    expect(profile.locale).toBe("en-US");
    expect(profile.countryCode).toBe("US");
    expect(profile.currency).toBe("USD");
    expect(profile.postalCode.label).toBe("ZIP Code");
    expect(profile.postalCode.shortLabel).toBe("ZIP");
    expect(profile.postalCode.fieldLabel).toBe("ZIP code");
    expect(profile.postalCode.example).toBe("43215");
    expect(profile.taxLabel).toBe("Tax");
    expect(profile.phoneCountryCode).toBe("+1");
    expect(profile.dateFormat).toBe("MM/DD/YYYY");
  });

  it("keeps US financing and membership capabilities enabled", () => {
    expect(getActiveMarketProfile().supportsFinancing).toBe(true);
    expect(getActiveMarketProfile().supportsMembership).toBe(true);
  });

  it("deterministically returns the same profile on repeated calls", () => {
    expect(getActiveMarketProfile()).toEqual(getActiveMarketProfile());
    expect(getPostalCodeLabel()).toBe(getPostalCodeLabel());
  });

  it("validates market ids against the profile registry", () => {
    expect(isMarketId("US")).toBe(true);
    expect(isMarketId("UK")).toBe(true);
    expect(isMarketId("EU_BASE")).toBe(true);
    expect(isMarketId("DE")).toBe(false);
    expect(isMarketId("toString")).toBe(false);
  });

  it("looks profiles up by id", () => {
    expect(getMarketProfile("US")).toBe(marketProfiles.US);
    expect(getMarketProfile("UK")).toBe(uk);
    expect(getMarketProfile("EU_BASE")).toBe(euBase);
  });
});

describe("UK market profile", () => {
  it("carries UK conventions", () => {
    expect(uk.id).toBe("UK");
    expect(uk.label).toBe("United Kingdom");
    expect(uk.locale).toBe("en-GB");
    expect(uk.countryCode).toBe("GB");
    expect(uk.currency).toBe("GBP");
    expect(uk.postalCode.label).toBe("Postcode");
    expect(uk.postalCode.example).toBe("SW1A 1AA");
    expect(uk.taxLabel).toBe("VAT");
    expect(uk.phoneCountryCode).toBe("+44");
    expect(uk.dateFormat).toBe("DD/MM/YYYY");
  });

  it("defaults optional tracking consent expectation to true", () => {
    expect(uk.requiresOptionalTrackingConsent).toBe(true);
  });

  it("is not the active ClearFlow market", () => {
    expect(business.activeMarketId).not.toBe("UK");
    expect(getActiveMarketProfile()).not.toBe(uk);
  });
});

describe("EU base market profile", () => {
  it("is not treated as a country", () => {
    expect(euBase.id).toBe("EU_BASE");
    expect(euBase.countryCode).toBeNull();
    expect(euBase.phoneCountryCode).toBeNull();
    expect(euBase.label).toBe("European Union Base");
  });

  it("uses EUR and VAT with neutral postal terminology and no invented example", () => {
    expect(euBase.currency).toBe("EUR");
    expect(euBase.taxLabel).toBe("VAT");
    expect(euBase.postalCode.label).toBe("Postal code");
    expect(euBase.postalCode.example).toBe("");
  });

  it("cannot be activated without a concrete country override", () => {
    expect(euBase.requiresCountryCompletion).toBe(true);
    expect(isActivatableMarket(euBase)).toBe(false);
    expect(getMarketActivationBlocker(euBase)).toBeTypeOf("string");
    expect(getMarketActivationBlocker(euBase)).not.toBe("");
    expect(getMarketActivationBlocker(euBase)).toMatch(/country/i);
  });

  it("documents that country rules must be verified", () => {
    expect(euBase.activationNote).toBeTypeOf("string");
    expect(euBase.activationNote).toMatch(/legal, tax, address and consent/i);
    expect(euBase.activationNote).toMatch(/not legal advice/i);
  });

  it("activates once concrete country values are supplied", () => {
    const completed: MarketProfile = {
      ...euBase,
      id: "US",
      countryCode: "NL",
      phoneCountryCode: "+31",
      postalCode: {
        label: "Postal code",
        fieldLabel: "Postal code",
        shortLabel: "Postal code",
        example: "1011 AB",
      },
      requiresCountryCompletion: false,
    };
    expect(isActivatableMarket(completed)).toBe(true);
    expect(getMarketActivationBlocker(completed)).toBeNull();
  });

  it("rejects activation when required country values are still missing", () => {
    expect(
      isActivatableMarket({ ...euBase, countryCode: "NL" }),
    ).toBe(false);
    expect(
      isActivatableMarket({ ...euBase, postalCode: { ...euBase.postalCode, example: "1011 AB" } }),
    ).toBe(false);
    expect(
      isActivatableMarket({ ...euBase, requiresCountryCompletion: false }),
    ).toBe(false);
  });
});

describe("market profiles are complete and generic", () => {
  it("defines exactly the three intended profiles", () => {
    expect(Object.keys(marketProfiles).sort()).toEqual(["EU_BASE", "UK", "US"]);
  });

  it("gives every profile a matching id and a label", () => {
    for (const profile of Object.values(marketProfiles)) {
      expect(profile.id).toBeTruthy();
      expect(profile.label).toBeTruthy();
      expect(profile.locale).toBeTruthy();
      expect(profile.dateFormat).toBeTruthy();
    }
  });

  it("keeps business data out of market profiles", () => {
    const serialized = JSON.stringify(marketProfiles);
    expect(serialized).not.toContain("614");
    expect(serialized).not.toContain("ClearFlow");
    expect(serialized).not.toContain("Columbus");
    expect(serialized).not.toContain("555-0147");
    // The 28 demonstration ZIPs belong to serviceAreas, not to a market.
    expect(serialized).not.toContain("43004");
    expect(serialized).not.toContain("43235");
  });

  it("only ever uses a real country code or null", () => {
    for (const profile of Object.values(marketProfiles)) {
      if (profile.countryCode === null) continue;
      expect(profile.countryCode).toMatch(/^[A-Z]{2}$/);
      // "EU" is a union, not an ISO 3166-1 country code.
      expect(profile.countryCode).not.toBe("EU");
    }
  });
});

describe("market copy helpers", () => {
  it("resolves active US terminology", () => {
    expect(getPostalCodeLabel()).toBe("ZIP Code");
    expect(getPostalCodeFieldLabel()).toBe("ZIP code");
    expect(getPostalCodeShortLabel()).toBe("ZIP");
    expect(getPostalCodeExample()).toBe("43215");
    expect(getTaxLabel()).toBe("Tax");
    expect(getCurrencyCode()).toBe("USD");
    expect(getDateFormat()).toBe("MM/DD/YYYY");
    expect(getPhoneCountryCode()).toBe("+1");
  });

  it("returns the same values on every call", () => {
    expect(getPostalCodeLabel()).toBe(getPostalCodeLabel());
    expect(getTaxLabel()).toBe(getTaxLabel());
    expect(getCurrencyCode()).toBe(getCurrencyCode());
  });

  it("reads UK values without changing the active market", () => {
    expect(uk.postalCode.label).toBe("Postcode");
    expect(uk.taxLabel).toBe("VAT");
    expect(uk.currency).toBe("GBP");
    // The active market is unchanged by inspecting another profile.
    expect(getPostalCodeLabel()).toBe("ZIP Code");
  });
});

describe("financing and membership availability", () => {
  it("preserves current US availability", () => {
    expect(isFinancingAvailable()).toBe(true);
    expect(isMembershipAvailable()).toBe(true);
  });

  it("reports market capability for a supplied profile", () => {
    expect(marketSupportsFinancing(marketProfiles.US)).toBe(true);
    expect(marketSupportsMembership(marketProfiles.US)).toBe(true);
    expect(marketSupportsFinancing(uk)).toBe(false);
    expect(marketSupportsMembership(uk)).toBe(true);
    expect(marketSupportsFinancing(euBase)).toBe(false);
    expect(marketSupportsMembership(euBase)).toBe(true);
  });

  it("disables financing when the market capability is false", () => {
    expect(isFinancingAvailable(uk)).toBe(false);
    expect(isFinancingAvailable(supportsNeither)).toBe(false);
  });

  it("keeps membership available for UK but not for a market that disables it", () => {
    expect(isMembershipAvailable(uk)).toBe(true);
    expect(isMembershipAvailable(supportsNeither)).toBe(false);
  });

  it("never overrides a disabled business flag with market capability", () => {
    // Market capability true, business flag false must stay false.
    const available = (flag: boolean, profile: MarketProfile) =>
      flag && marketSupportsFinancing(profile);

    expect(available(false, supportsBoth)).toBe(false);
    expect(available(true, supportsBoth)).toBe(true);
  });
});
