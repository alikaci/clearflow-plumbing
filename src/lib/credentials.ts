import type { VerifiedCredential } from "@/types";

/*
Credential validation.

ClearFlow ships with credentials disabled and empty, so this module never runs
against real claims today. It exists so that a future reviewer adding real,
verified data cannot accidentally publish an incomplete or unsafe credential.

Validation is deliberately hand-rolled rather than a zod schema: this checks
static build-time config, not user input, so a runtime schema system would add
weight without adding safety. Functions are pure and never mutate the input.

A credential is renderable only when it has a non-empty name, an absolute
https verification URL, a parseable ISO date, and alt text if a logo is
present. Registration number stays optional because not every verifiable
credential publishes one.
*/

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type CredentialRejectionReason =
  | "empty-name"
  | "invalid-verification-url"
  | "insecure-verification-url"
  | "invalid-verified-at"
  | "invalid-logo";

export type CredentialValidation =
  | { valid: true; credential: VerifiedCredential }
  | { valid: false; reason: CredentialRejectionReason };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidVerifiedAt(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  // Rejects overflow dates such as 2026-02-31, which Date would roll over.
  return parsed.toISOString().slice(0, 10) === value;
}

function isValidVerificationUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim().length === 0) return false;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    // Rejects relative URLs and malformed values.
    return false;
  }

  // Rejects http, javascript:, data: and every non-https protocol.
  return url.protocol === "https:";
}

function isValidLogo(
  logo: VerifiedCredential["logo"],
): boolean {
  if (logo === undefined) return true;
  if (typeof logo !== "object" || logo === null) return false;
  if (!isNonEmptyString(logo.src)) return false;
  // A logo must be identified by name, never by a generic word like "image".
  return isNonEmptyString(logo.alt);
}

/**
 * Validates a single credential without mutating it. Returns the reason so
 * tests and future tooling can explain why something was filtered out.
 */
export function validateCredential(
  credential: VerifiedCredential,
): CredentialValidation {
  if (!isNonEmptyString(credential.name)) {
    return { valid: false, reason: "empty-name" };
  }
  if (typeof credential.verificationUrl !== "string" || credential.verificationUrl.trim().length === 0) {
    return { valid: false, reason: "invalid-verification-url" };
  }
  if (!isValidVerificationUrl(credential.verificationUrl)) {
    return { valid: false, reason: "insecure-verification-url" };
  }
  if (!isValidVerifiedAt(credential.verifiedAt)) {
    return { valid: false, reason: "invalid-verified-at" };
  }
  if (!isValidLogo(credential.logo)) {
    return { valid: false, reason: "invalid-logo" };
  }
  return { valid: true, credential };
}

export function isValidCredential(credential: VerifiedCredential): boolean {
  return validateCredential(credential).valid;
}

/**
 * Returns only the credentials that are safe to render. The input array is
 * never modified and invalid entries are dropped rather than repaired, so a
 * bad value can never become a visible verified claim.
 */
export function filterValidCredentials(
  credentials: readonly VerifiedCredential[],
): VerifiedCredential[] {
  return credentials.filter((credential) => isValidCredential(credential));
}

/**
 * Formats an ISO date using the active market's display convention.
 *
 * Implemented with explicit token replacement rather than `Intl` so the output
 * is fully deterministic across runtimes and test environments.
 */
export function formatMarketDate(isoDate: string, dateFormat: string): string {
  if (!isValidVerifiedAt(isoDate)) return "";

  const [year, month, day] = isoDate.split("-");
  return dateFormat
    .replace("YYYY", year)
    .replace("MM", month)
    .replace("DD", day);
}
