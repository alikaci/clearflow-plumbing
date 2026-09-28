import { business } from "@/config/business";
import { features } from "@/config/features";
import { marketProfiles } from "@/config/markets";
import type { MarketId, MarketProfile } from "@/types";

/*
Market accessors.

`business.activeMarketId` is the single source of truth for the active market.
Nothing here reads geolocation, IP address, browser language or visitor input,
and there is no client-side switch: the active market is a build-time setting.

Every accessor is a pure function over static config, so helpers are safe to
call from both server and client components and are deterministic in tests.
*/

function isCompleteForActivation(profile: MarketProfile): boolean {
  if (profile.requiresCountryCompletion) return false;
  if (profile.countryCode === null) return false;
  if (profile.phoneCountryCode === null) return false;
  return profile.postalCode.example.trim().length > 0;
}

/**
 * Returns true only when a profile may be used as a concrete production
 * market. EU_BASE fails this check, so it can never be activated.
 */
export function isActivatableMarket(profile: MarketProfile): boolean {
  return isCompleteForActivation(profile);
}

/**
 * Explains why a profile cannot be activated, or returns null when it can.
 * Callers can surface this during setup instead of throwing at render time.
 */
export function getMarketActivationBlocker(
  profile: MarketProfile,
): string | null {
  if (!isActivatableMarket(profile)) {
    return profile.activationNote ?? "This profile requires a country override.";
  }
  return null;
}

export function getMarketProfile(id: MarketId): MarketProfile {
  return marketProfiles[id];
}

export function isMarketId(value: string): value is MarketId {
  return Object.prototype.hasOwnProperty.call(marketProfiles, value);
}

export function getActiveMarketProfile(): MarketProfile {
  return marketProfiles[business.activeMarketId];
}

export function getPostalCodeLabel(): string {
  return getActiveMarketProfile().postalCode.label;
}

export function getPostalCodeShortLabel(): string {
  return getActiveMarketProfile().postalCode.shortLabel;
}

/** Sentence-case label for form fields, so wiring it changes no copy casing. */
export function getPostalCodeFieldLabel(): string {
  return getActiveMarketProfile().postalCode.fieldLabel;
}

/** Empty when the active market has no single canonical example. */
export function getPostalCodeExample(): string {
  return getActiveMarketProfile().postalCode.example;
}

export function getTaxLabel(): string {
  return getActiveMarketProfile().taxLabel;
}

export function getCurrencyCode(): MarketProfile["currency"] {
  return getActiveMarketProfile().currency;
}

export function getDateFormat(): string {
  return getActiveMarketProfile().dateFormat;
}

/** Null when the active market has no resolved country calling prefix. */
export function getPhoneCountryCode(): string | null {
  return getActiveMarketProfile().phoneCountryCode;
}

export function marketSupportsFinancing(profile: MarketProfile): boolean {
  return profile.supportsFinancing;
}

export function marketSupportsMembership(profile: MarketProfile): boolean {
  return profile.supportsMembership;
}

/*
Effective availability combines the business flag with market capability.

A business flag of false always stays false: market capability can only turn a
feature off, never on. Order matters, so it is written as an explicit `&&`.
*/
export function isFinancingAvailable(
  profile: MarketProfile = getActiveMarketProfile(),
): boolean {
  return features.financing && marketSupportsFinancing(profile);
}

export function isMembershipAvailable(
  profile: MarketProfile = getActiveMarketProfile(),
): boolean {
  return features.membership && marketSupportsMembership(profile);
}
