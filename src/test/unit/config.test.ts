import { describe, expect, it } from "vitest";
import { business } from "@/config/business";
import { faqs } from "@/config/faqs";
import { features } from "@/config/features";
import { images } from "@/config/images";
import { footerNavigation, mainNavigation } from "@/config/navigation";
import { offers } from "@/config/offers";
import { reviews } from "@/config/reviews";
import { seo } from "@/config/seo";
import {
  getService,
  isServiceSlug,
  serviceSlugs,
  serviceSummaries,
  services,
} from "@/config/services";
import { serviceAreas } from "@/config/serviceAreas";

describe("service configuration", () => {
  it("defines eight uniquely named services", () => {
    expect(services).toHaveLength(8);
    expect(new Set(serviceSlugs).size).toBe(serviceSlugs.length);
    expect(serviceSummaries).toHaveLength(services.length);
  });

  it("resolves slugs through getService and isServiceSlug", () => {
    expect(isServiceSlug("drain-cleaning")).toBe(true);
    expect(isServiceSlug("unknown")).toBe(false);
    expect(getService("water-heaters")?.name).toBeTruthy();
    expect(getService("unknown")).toBeUndefined();
  });

  it("keeps related service slugs valid and non-self-referential", () => {
    for (const service of services) {
      for (const related of service.relatedSlugs) {
        expect(serviceSlugs).toContain(related);
        expect(related).not.toBe(service.slug);
      }
    }
  });

  it("references only real image keys", () => {
    for (const service of services) {
      expect(images[service.imageKey]).toBeDefined();
    }
  });

  it("gives each service enough content to render a real page", () => {
    for (const service of services) {
      expect(service.commonProblems.length).toBeGreaterThan(0);
      expect(service.warningSigns.length).toBeGreaterThan(0);
      expect(service.assessmentIncludes.length).toBeGreaterThan(0);
      expect(service.benefits.length).toBeGreaterThan(0);
      expect(service.faqs.length).toBeGreaterThan(0);
    }
  });
});

describe("before-visit guidance", () => {
  const expectedSlugs = [
    "drain-cleaning",
    "leak-repair",
    "water-heaters",
    "pipe-repair",
    "toilets-faucets",
    "sump-pumps",
    "sewer-lines",
    "general-plumbing",
  ];

  function titlesFor(slug: string): string[] {
    return (getService(slug)?.beforeVisit?.items ?? []).map(
      (item) => item.title,
    );
  }

  it("keeps the same eight unique slugs after the guidance was added", () => {
    expect(serviceSlugs).toHaveLength(8);
    expect(new Set(serviceSlugs).size).toBe(8);
    expect([...serviceSlugs].sort()).toEqual([...expectedSlugs].sort());
  });

  it("gives every active service non-empty guidance", () => {
    for (const service of services) {
      const items = service.beforeVisit?.items;
      expect(items, `${service.slug} should define beforeVisit`).toBeDefined();
      expect(items?.length ?? 0, `${service.slug} guidance`).toBeGreaterThan(0);
      expect(
        items?.length ?? 0,
        `${service.slug} should stay concise`,
      ).toBeLessThanOrEqual(5);
    }
  });

  it("uses fully written titles and descriptions for every item", () => {
    for (const service of services) {
      for (const item of service.beforeVisit?.items ?? []) {
        expect(item.title.trim().length, service.slug).toBeGreaterThan(3);
        expect(item.description.trim().length, item.title).toBeGreaterThan(20);
        if (item.importance !== undefined) {
          expect(["standard", "important"]).toContain(item.importance);
        }
      }
    }
  });

  it("covers the drain chemical and affected-drain warnings", () => {
    const titles = titlesFor("drain-cleaning");
    expect(titles).toContain("Do Not Add More Drain Cleaner");
    expect(titles).toContain("Avoid Using the Affected Drain");
  });

  it("covers leak electrical, safe-shutoff and stuck-valve wording", () => {
    const items = getService("leak-repair")?.beforeVisit?.items ?? [];
    const electrical = items.find(
      (item) => item.title === "Keep Clear of Electrical Hazards",
    );
    expect(electrical?.importance).toBe("important");
    expect(electrical?.description).toMatch(/standing water/i);
    expect(electrical?.description).toMatch(
      /appropriate emergency service or utility provider/i,
    );

    const shutoff = items.find(
      (item) => item.title === "Use a Known Shutoff Only If Safe",
    );
    expect(shutoff?.description).toMatch(/reached safely/i);
    expect(shutoff?.description).toMatch(/do not force a stuck valve/i);
  });

  it("covers water-heater panel and gas/electrical warnings", () => {
    const items = getService("water-heaters")?.beforeVisit?.items ?? [];
    const panels = items.find((item) => item.title === "Do Not Open Access Panels");
    expect(panels?.importance).toBe("important");
    expect(panels?.description).toMatch(/gas or electrical components/i);

    const urgent = items.find(
      (item) => item.title === "Treat Gas or Electrical Concerns as Urgent",
    );
    expect(urgent?.importance).toBe("important");
    expect(urgent?.description).toMatch(/leave the area/i);
    expect(urgent?.description).toMatch(
      /appropriate emergency service or utility provider/i,
    );
  });

  it("covers sump-pump standing water and bypassed controls", () => {
    const titles = titlesFor("sump-pumps");
    expect(titles).toContain("Do Not Enter Water Near Electrical Equipment");
    expect(titles).toContain("Do Not Bypass Electrical Controls");

    const water = (getService("sump-pumps")?.beforeVisit?.items ?? []).find(
      (item) => item.title === "Do Not Enter Water Near Electrical Equipment",
    );
    expect(water?.importance).toBe("important");
  });

  it("covers sewer water use, contamination and chemical warnings", () => {
    const titles = titlesFor("sewer-lines");
    expect(titles).toContain("Limit Water Use During a Backup");
    expect(titles).toContain("Keep Clear of Contaminated Areas");
    expect(titles).toContain("Do Not Add Chemical Cleaners");

    const contamination = (getService("sewer-lines")?.beforeVisit?.items ?? []).find(
      (item) => item.title === "Keep Clear of Contaminated Areas",
    );
    expect(contamination?.importance).toBe("important");
    expect(contamination?.description).toMatch(/children and pets/i);
  });

  it("covers fixture overflow and forcing controls", () => {
    const titles = titlesFor("toilets-faucets");
    expect(titles).toContain("Avoid Continued Use During an Overflow");
    expect(titles).toContain("Do Not Force Stuck Handles or Valves");
  });

  it("covers pipework and electrical awareness for pipe repair", () => {
    const titles = titlesFor("pipe-repair");
    expect(titles).toContain("Do Not Disturb Damaged Pipework");
    expect(titles).toContain("Stay Clear of Electrical Hazards");
  });

  it("keeps general plumbing guidance non-diagnostic", () => {
    const items = getService("general-plumbing")?.beforeVisit?.items ?? [];
    expect(items.map((item) => item.title)).toContain(
      "Record What You Have Observed",
    );
    const text = items.map((item) => `${item.title} ${item.description}`).join(" ");
    expect(text).not.toMatch(/diagnos/i);
    expect(text).not.toMatch(/the cause is/i);
  });

  it("never instructs disassembly, chemicals, panels or live electrical work", () => {
    const forbidden = [
      /remove the trap/i,
      /drain snake/i,
      /mix the chemicals/i,
      /boiling water/i,
      /sewer cleanout/i,
      /open the breaker panel/i,
      /relight (the )?pilot/i,
      /remove (the )?(heating )?element/i,
      /drain the tank/i,
      /adjust the pressure/i,
      /open the (tank|access )?panel/i,
      /clamp the pipe/i,
      /patch the pipe/i,
      /reach into the pit/i,
      /call 911/i,
    ];

    for (const service of services) {
      const text = (service.beforeVisit?.items ?? [])
        .map((item) => `${item.title} ${item.description}`)
        .join(" ");
      for (const pattern of forbidden) {
        expect(text, `${service.slug} should not match ${pattern}`).not.toMatch(
          pattern,
        );
      }
    }
  });

  it("keeps guidance free of arrival, booking and guaranteed-safety claims", () => {
    const forbidden = [
      "our technician will",
      "we are on the way",
      "before we arrive",
      "while you wait for clearflow",
      "your appointment",
      "your scheduled visit",
      "guaranteed safe",
      "this will stop the damage",
      "follow these steps to fix",
      "diagnose the issue",
      "repair it yourself",
      "same-day",
    ];

    for (const service of services) {
      const text = (
        (service.beforeVisit?.items ?? [])
          .map((item) => `${item.title} ${item.description}`)
          .join(" ") + (service.beforeVisit?.intro ?? "")
      ).toLowerCase();

      for (const phrase of forbidden) {
        expect(text, `${service.slug} should not say "${phrase}"`).not.toContain(
          phrase,
        );
      }
    }
  });
});

describe("image manifest", () => {
  it("points every entry at a local path with real dimensions", () => {
    for (const [key, asset] of Object.entries(images)) {
      expect(asset.src.startsWith("/images/"), key).toBe(true);
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
      expect(asset.alt.length).toBeGreaterThan(0);
    }
  });

  it("includes the configured open graph image", () => {
    expect(images[seo.openGraphImageKey]).toBeDefined();
    expect(images[seo.openGraphImageKey].width).toBe(1200);
    expect(images[seo.openGraphImageKey].height).toBe(630);
  });
});

describe("site configuration", () => {
  it("lists valid, unique five-digit service-area ZIP codes", () => {
    expect(serviceAreas.zips.length).toBeGreaterThan(0);
    expect(new Set(serviceAreas.zips).size).toBe(serviceAreas.zips.length);
    for (const zip of serviceAreas.zips) {
      expect(zip).toMatch(/^\d{5}$/);
    }
  });

  it("keeps internal navigation inside the site", () => {
    const items = [...mainNavigation];
    for (const item of items) {
      expect(
        item.href.startsWith("/") || item.href.startsWith("#"),
        item.href,
      ).toBe(true);
    }
    for (const group of footerNavigation) {
      for (const link of group.items) {
        expect(
          link.href.startsWith("/") || link.href.startsWith("#"),
          link.href,
        ).toBe(true);
      }
    }
  });

  it("links the pricing process page from the footer but not the main navigation", () => {
    const more = footerNavigation.find((group) => group.id === "more");
    const link = more?.items.find((item) => item.href === "/pricing");

    expect(link?.label).toBe("How Pricing Works");
    expect(
      mainNavigation.some((item) => item.href === "/pricing"),
    ).toBe(false);
  });

  it("exposes a canonical path and copy for every SEO route", () => {
    for (const [key, route] of Object.entries(seo.routes)) {
      expect(route.path.startsWith("/"), key).toBe(true);
      expect(route.title.length).toBeGreaterThan(0);
      expect(route.description.length).toBeGreaterThan(0);
    }
  });

  it("uses a real tel link and never a mailto link", () => {
    expect(business.phoneUri).toMatch(/^tel:\+\d+$/);
    expect(business.secondaryCta.href).toBe(business.phoneUri);
    expect(business.email.href).toBeNull();
  });

  it("publishes complete review, FAQ and offer content", () => {
    expect(reviews.reviews.length).toBeGreaterThanOrEqual(3);
    expect(reviews.heading.length).toBeGreaterThan(0);
    expect(faqs.length).toBeGreaterThanOrEqual(6);
    expect(new Set(faqs.map((faq) => faq.id)).size).toBe(faqs.length);
    expect(offers.length).toBeGreaterThan(0);
  });

  it("exposes every feature flag as a boolean", () => {
    for (const flag of Object.keys(features) as (keyof typeof features)[]) {
      expect(typeof features[flag]).toBe("boolean");
    }
  });
});
