import { describe, expect, it, vi } from "vitest";
import { filterNavigation, isFeatureEnabled } from "@/lib/features";
import { resolveHashHref } from "@/lib/links";
import { buildMetadata, buildMetadataFor } from "@/lib/metadata";
import { simulateSubmit } from "@/lib/submit";
import { collectErrors, estimateStepSchemas } from "@/lib/validation";
import { isZipInArea, isValidZip, sanitizeZipInput } from "@/lib/zip";
import { serviceAreas } from "@/config/serviceAreas";
import type { NavigationItem } from "@/types";

describe("zip helpers", () => {
  it("accepts only five-digit codes", () => {
    expect(isValidZip("43215")).toBe(true);
    expect(isValidZip(" 43215 ")).toBe(true);
    expect(isValidZip("4321")).toBe(false);
    expect(isValidZip("432155")).toBe(false);
    expect(isValidZip("4321a")).toBe(false);
    expect(isValidZip("")).toBe(false);
  });

  it("sanitizes input to digits and five characters", () => {
    expect(sanitizeZipInput("43a2b1")).toBe("4321");
    expect(sanitizeZipInput("4321 5")).toBe("43215");
    expect(sanitizeZipInput("43215999")).toBe("43215");
    expect(sanitizeZipInput("abc")).toBe("");
  });

  it("detects coverage against the configured list", () => {
    expect(isZipInArea("43215", serviceAreas.zips)).toBe(true);
    expect(isZipInArea("90210", serviceAreas.zips)).toBe(false);
    expect(isZipInArea("4321", serviceAreas.zips)).toBe(false);
  });
});

describe("resolveHashHref", () => {
  it("prefixes hash links on non-home routes", () => {
    expect(resolveHashHref("#estimate", "/services")).toBe("/#estimate");
  });

  it("leaves hash links untouched on the home route", () => {
    expect(resolveHashHref("#estimate", "/")).toBe("#estimate");
  });

  it("leaves absolute and relative links untouched", () => {
    expect(resolveHashHref("/services", "/about")).toBe("/services");
    expect(resolveHashHref("tel:+16145550147", "/about")).toBe(
      "tel:+16145550147",
    );
  });
});

describe("feature flags", () => {
  it("treats an undefined flag as enabled", () => {
    expect(isFeatureEnabled(undefined)).toBe(true);
  });

  it("filters navigation items by flag", () => {
    const items: NavigationItem[] = [
      { label: "Always", href: "/always" },
      { label: "Booking", href: "/book", flag: "onlineBooking" },
    ];
    expect(filterNavigation(items)).toHaveLength(2);
  });
});

describe("validation schemas", () => {
  it("rejects an empty service and accepts a known one", () => {
    expect(estimateStepSchemas[0].safeParse({ service: "" }).success).toBe(false);
    expect(
      estimateStepSchemas[0].safeParse({ service: "water-heaters" }).success,
    ).toBe(true);
    expect(estimateStepSchemas[0].safeParse({ service: "nope" }).success).toBe(
      false,
    );
  });

  it("requires a valid location", () => {
    expect(
      estimateStepSchemas[1].safeParse({
        city: "",
        zip: "4321",
        propertyType: "house",
      }).success,
    ).toBe(false);
    expect(
      estimateStepSchemas[1].safeParse({
        city: "Columbus",
        zip: "43215",
        propertyType: "house",
      }).success,
    ).toBe(true);
  });

  it("requires a description of at least ten characters", () => {
    expect(
      estimateStepSchemas[2].safeParse({
        urgency: "urgent",
        description: "short",
      }).success,
    ).toBe(false);
    expect(
      estimateStepSchemas[2].safeParse({
        urgency: "urgent",
        description: "The kitchen sink drains very slowly.",
      }).success,
    ).toBe(true);
  });

  it("requires valid contact details", () => {
    const base = {
      fullName: "Jordan Miller",
      phone: "6145550147",
      contactMethod: "phone",
      contactTime: "morning",
    };
    expect(estimateStepSchemas[3].safeParse({ ...base, email: "bad" }).success).toBe(
      false,
    );
    expect(
      estimateStepSchemas[3].safeParse({ ...base, email: "a@b.co" }).success,
    ).toBe(true);
  });

  it("requires the demonstration acknowledgement", () => {
    expect(estimateStepSchemas[4].safeParse({ privacy: false }).success).toBe(false);
    expect(estimateStepSchemas[4].safeParse({ privacy: true }).success).toBe(true);
  });

  it("collects the first message per field", () => {
    const errors = collectErrors(estimateStepSchemas[1], {
      city: "",
      zip: "4321",
      propertyType: "house",
    });
    expect(errors.city).toBe("Enter your city.");
    expect(errors.zip).toBe("Enter a five-digit ZIP code.");
    expect(Object.keys(errors)).toHaveLength(2);
  });

  it("returns no errors for valid values", () => {
    expect(
      collectErrors(estimateStepSchemas[0], { service: "drain-cleaning" }),
    ).toEqual({});
  });
});

describe("simulateSubmit", () => {
  it("resolves successfully after the simulated delay", async () => {
    vi.useFakeTimers();
    const promise = simulateSubmit();
    await vi.advanceTimersByTimeAsync(600);
    await expect(promise).resolves.toEqual({ ok: true });
    vi.useRealTimers();
  });
});

describe("metadata builders", () => {
  it("builds metadata for a named route", () => {
    const metadata = buildMetadata("services");
    expect(metadata.title).toBe("Plumbing Services");
    expect(metadata.alternates?.canonical).toBe("https://clearflow.example/services");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("builds metadata from explicit values", () => {
    const metadata = buildMetadataFor({
      title: "Custom",
      description: "Custom description",
      path: "/custom",
    });
    expect(metadata.title).toBe("Custom");
    expect(metadata.openGraph?.title).toBe("Custom | ClearFlow Plumbing Co.");
    expect(metadata.openGraph?.url).toBe("https://clearflow.example/custom");
  });
});
