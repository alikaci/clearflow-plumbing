import { describe, expect, it } from "vitest";
import { credentials } from "@/config/credentials";
import {
  filterValidCredentials,
  formatMarketDate,
  isValidCredential,
  validateCredential,
} from "@/lib/credentials";
import type { CredentialsConfig, VerifiedCredential } from "@/types";

/*
Fixtures live in the test file only. Production config ships disabled and
empty, so no example credential is ever rendered on the site.
*/

const validCredentialFixture: VerifiedCredential = {
  name: "Verified Trade Registry Example",
  registrationNumber: "EX-000-000",
  verificationUrl: "https://example.com/verify/credential-123",
  verifiedAt: "2026-02-10",
};

const invalidHttpCredentialFixture: VerifiedCredential = {
  ...validCredentialFixture,
  verificationUrl: "http://example.com/verify/credential-123",
};

const invalidRelativeUrlCredentialFixture: VerifiedCredential = {
  ...validCredentialFixture,
  verificationUrl: "/verify/credential-123",
};

const invalidJavascriptUrlCredentialFixture: VerifiedCredential = {
  ...validCredentialFixture,
  verificationUrl: "javascript:alert(1)",
};

const invalidEmptyNameCredentialFixture: VerifiedCredential = {
  ...validCredentialFixture,
  name: "",
};

const invalidWhitespaceNameCredentialFixture: VerifiedCredential = {
  ...validCredentialFixture,
  name: "   ",
};

const invalidDateCredentialFixture: VerifiedCredential = {
  ...validCredentialFixture,
  verifiedAt: "not-a-date",
};

const invalidOverflowDateCredentialFixture: VerifiedCredential = {
  ...validCredentialFixture,
  verifiedAt: "2026-02-31",
};

const invalidEmptyLogoAltFixture: VerifiedCredential = {
  ...validCredentialFixture,
  logo: { src: "/logos/example.svg", alt: "" },
};

const validLogoFixture: VerifiedCredential = {
  ...validCredentialFixture,
  logo: { src: "/logos/example.svg", alt: "Verified Trade Registry Example" },
};

describe("credential validation", () => {
  it("accepts a complete credential", () => {
    expect(isValidCredential(validCredentialFixture)).toBe(true);
    expect(validateCredential(validCredentialFixture)).toEqual({
      valid: true,
      credential: validCredentialFixture,
    });
  });

  it("accepts a credential without a registration number", () => {
    const { registrationNumber, ...withoutRegistration } =
      validCredentialFixture;
    expect(registrationNumber).toBeTruthy();
    expect(isValidCredential(withoutRegistration)).toBe(true);
  });

  it("rejects an empty or whitespace-only name", () => {
    expect(validateCredential(invalidEmptyNameCredentialFixture)).toEqual({
      valid: false,
      reason: "empty-name",
    });
    expect(validateCredential(invalidWhitespaceNameCredentialFixture)).toEqual({
      valid: false,
      reason: "empty-name",
    });
  });

  it("rejects an http verification url", () => {
    expect(validateCredential(invalidHttpCredentialFixture)).toEqual({
      valid: false,
      reason: "insecure-verification-url",
    });
  });

  it("rejects a relative verification url", () => {
    expect(validateCredential(invalidRelativeUrlCredentialFixture)).toEqual({
      valid: false,
      reason: "insecure-verification-url",
    });
  });

  it("rejects a javascript verification url", () => {
    expect(validateCredential(invalidJavascriptUrlCredentialFixture)).toEqual({
      valid: false,
      reason: "insecure-verification-url",
    });
  });

  it("rejects other unsafe protocols", () => {
    for (const url of [
      "data:text/html,hi",
      "ftp://example.com/verify",
      "file:///etc/passwd",
    ]) {
      expect(isValidCredential({ ...validCredentialFixture, verificationUrl: url })).toBe(
        false,
      );
    }
  });

  it("rejects an invalid or overflowing verified date", () => {
    expect(validateCredential(invalidDateCredentialFixture)).toEqual({
      valid: false,
      reason: "invalid-verified-at",
    });
    expect(validateCredential(invalidOverflowDateCredentialFixture)).toEqual({
      valid: false,
      reason: "invalid-verified-at",
    });
  });

  it("rejects a logo with empty alt text", () => {
    expect(validateCredential(invalidEmptyLogoAltFixture)).toEqual({
      valid: false,
      reason: "invalid-logo",
    });
  });

  it("accepts a logo that names the credential", () => {
    expect(isValidCredential(validLogoFixture)).toBe(true);
  });

  it("does not mutate the credential it validates", () => {
    const snapshot = JSON.stringify(validCredentialFixture);
    validateCredential(validCredentialFixture);
    filterValidCredentials([validCredentialFixture]);
    expect(JSON.stringify(validCredentialFixture)).toBe(snapshot);
  });
});

describe("filterValidCredentials", () => {
  it("keeps only valid credentials and preserves order", () => {
    const second: VerifiedCredential = {
      ...validCredentialFixture,
      name: "Second Verified Registry Example",
    };
    const result = filterValidCredentials([
      validCredentialFixture,
      invalidHttpCredentialFixture,
      second,
      invalidEmptyNameCredentialFixture,
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Verified Trade Registry Example");
    expect(result[1].name).toBe("Second Verified Registry Example");
  });

  it("returns an empty array for empty or fully invalid input", () => {
    expect(filterValidCredentials([])).toEqual([]);
    expect(
      filterValidCredentials([
        invalidHttpCredentialFixture,
        invalidEmptyNameCredentialFixture,
      ]),
    ).toEqual([]);
  });

  it("does not modify the input array", () => {
    const input: VerifiedCredential[] = [
      validCredentialFixture,
      invalidHttpCredentialFixture,
    ];
    const copy = [...input];
    filterValidCredentials(input);
    expect(input).toEqual(copy);
  });
});

describe("formatMarketDate", () => {
  it("formats using the US display convention", () => {
    expect(formatMarketDate("2026-02-10", "MM/DD/YYYY")).toBe("02/10/2026");
  });

  it("formats using a day-first display convention", () => {
    expect(formatMarketDate("2026-02-10", "DD/MM/YYYY")).toBe("10/02/2026");
  });

  it("returns an empty string for an invalid date", () => {
    expect(formatMarketDate("nope", "MM/DD/YYYY")).toBe("");
    expect(formatMarketDate("", "MM/DD/YYYY")).toBe("");
  });
});

describe("ClearFlow production credentials config", () => {
  it("is disabled with no items", () => {
    expect(credentials.enabled).toBe(false);
    expect(credentials.items).toEqual([]);
    expect(credentials.items).toHaveLength(0);
  });

  it("contains no placeholder credential data", () => {
    const serialized = JSON.stringify(credentials);
    expect(serialized).not.toContain("BBB");
    expect(serialized).not.toContain("Licensed");
    expect(serialized).not.toContain("Insured");
    expect(serialized).not.toContain("Gas Safe");
    expect(serialized).not.toContain("WaterSafe");
    expect(serialized).not.toContain("NICEIC");
    expect(serialized).not.toContain("CHAS");
    expect(serialized).not.toContain("WIAPS");
    expect(serialized).not.toMatch(/example\.com/);
  });

  it("produces no renderable credentials", () => {
    expect(filterValidCredentials(credentials.items)).toEqual([]);
  });

  it("stays empty when paired with a disabled config helper", () => {
    const config: CredentialsConfig = credentials;
    expect(config.enabled && filterValidCredentials(config.items).length > 0).toBe(
      false,
    );
  });
});
