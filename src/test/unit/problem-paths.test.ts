import { describe, expect, it } from "vitest";
import { problemChooser, problemPaths } from "@/config/problemPaths";
import { serviceSlugs } from "@/config/services";
import type { IconName } from "@/components/ui/Icon";

const validIcons: readonly IconName[] = [
  "drain",
  "leak",
  "water-heater",
  "pipe",
  "fixture",
  "sump-pump",
  "sewer",
  "wrench",
];

const forbiddenPhrases = [
  "24/7",
  "same-day",
  "same day service",
  "guaranteed",
  "guarantee",
  "on the way",
  "technician dispatch",
  "we are at your door",
  "fix it today",
  "license",
  "insured",
  "background-checked",
  "verified reviews",
  "official rating",
];

describe("problem paths configuration", () => {
  it("defines eight uniquely identified choices", () => {
    expect(problemPaths).toHaveLength(8);
    expect(new Set(problemPaths.map((path) => path.id)).size).toBe(
      problemPaths.length,
    );
  });

  it("maps every destination to an existing service route or a valid anchor", () => {
    for (const path of problemPaths) {
      if (path.href.startsWith("/services/")) {
        const slug = path.href.replace("/services/", "");
        expect(serviceSlugs, `${path.id} -> ${path.href}`).toContain(slug);
      } else {
        expect(path.href, `${path.id} href`).toMatch(/^#/);
      }
      if (path.altCta && path.altCta.href.startsWith("/services/")) {
        const slug = path.altCta.href.replace("/services/", "");
        expect(serviceSlugs, `${path.id} alt -> ${path.altCta.href}`).toContain(
          slug,
        );
      }
    }
  });

  it("finds the exact required eight destinations", () => {
    const destinations = problemPaths.map((path) => path.href);
    expect(destinations).toContain("/services/leak-repair");
    expect(destinations).toContain("/services/drain-cleaning");
    expect(destinations).toContain("/services/water-heaters");
    expect(destinations).toContain("/services/toilets-faucets");
    expect(destinations).toContain("/services/sewer-lines");
    expect(destinations).toContain("/services/pipe-repair");
    expect(destinations).toContain("/services/sump-pumps");
    expect(destinations).toContain("/services/general-plumbing");
  });

  it("reuses only real icon names", () => {
    for (const path of problemPaths) {
      expect(validIcons, `${path.id} icon`).toContain(path.icon);
    }
  });

  it("scopes the orange accent to the sewer option", () => {
    const sewer = problemPaths.find((path) => path.id === "sewer-backup");
    expect(sewer?.accent).toBe(true);
    expect(sewer?.href).toBe("/services/sewer-lines");
    expect(problemPaths.filter((path) => path.accent)).toHaveLength(1);
  });

  it("gives the not-sure option a route to the estimate form", () => {
    const notSure = problemPaths.find((path) => path.id === "not-sure");
    expect(notSure?.href).toBe("/services/general-plumbing");
    expect(notSure?.altCta).toEqual({
      label: "Request an assessment",
      href: "#estimate",
    });
  });

  it("keeps every label, description and link free of forbidden claims", () => {
    for (const path of problemPaths) {
      const copy = [
        path.label,
        path.description,
        path.linkLabel,
        path.altCta?.label ?? "",
      ]
        .join(" ")
        .toLowerCase();

      for (const phrase of forbiddenPhrases) {
        expect(copy, `${path.id} should not say "${phrase}"`).not.toContain(
          phrase,
        );
      }
      expect(path.label.length).toBeGreaterThan(0);
      expect(path.description.length).toBeGreaterThan(0);
      expect(path.linkLabel.length).toBeGreaterThan(0);
    }
  });

  it("keeps the sewer description measured rather than alarmist", () => {
    const sewer = problemPaths.find((path) => path.id === "sewer-backup");
    const text = `${sewer?.description ?? ""}`.toLowerCase();
    expect(text).not.toMatch(/emergency/);
    expect(text).not.toMatch(/critical/);
    expect(text).not.toMatch(/immediately/);
    expect(text).toMatch(/recurring|backups|slow/i);
  });

  it("publishes the canonical chooser heading and copy", () => {
    expect(problemChooser.heading).toBe("What's happening?");
    expect(problemChooser.supportingText.length).toBeGreaterThan(0);
  });
});