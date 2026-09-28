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
