import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { services } from "../src/config/services";

const requiredSentence =
  "If there is an immediate threat involving fire, gas, electricity or severe flooding, contact the appropriate emergency service or utility provider first.";

const emergencyRouteGuidance = {
  "drain-cleaning": [
    "Do Not Add More Drain Cleaner",
    "Avoid Using the Affected Drain",
  ],
  "leak-repair": ["Keep Clear of Electrical Hazards"],
  "water-heaters": [
    "Do Not Open Access Panels",
    "Treat Gas or Electrical Concerns as Urgent",
  ],
  "pipe-repair": ["Stay Clear of Electrical Hazards"],
  "sump-pumps": [
    "Do Not Enter Water Near Electrical Equipment",
    "Do Not Bypass Electrical Controls",
  ],
  "sewer-lines": [
    "Limit Water Use During a Backup",
    "Keep Clear of Contaminated Areas",
    "Do Not Add Chemical Cleaners",
  ],
  "toilets-faucets": [
    "Avoid Continued Use During an Overflow",
    "Do Not Force Stuck Handles or Valves",
  ],
  "general-plumbing": ["Record What You Have Observed"],
} as const;

const section = (page: Page) => page.getByRole("region", { name: "Before Your Visit" });

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
}

test.describe("before your visit guidance", () => {
  test("keeps the original eight service routes", async ({ page }) => {
    await page.goto("/services");
    expect(services).toHaveLength(8);

    const hrefs = await page
      .locator('a[href^="/services/"]')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? ""),
      );

    expect([...new Set(hrefs)].sort()).toEqual(
      services.map((service) => `/services/${service.slug}`).sort(),
    );
  });

  for (const service of services) {
    test(`${service.slug} renders its guidance section`, async ({ page }) => {
      const response = await page.goto(`/services/${service.slug}`);
      expect(response?.status()).toBe(200);

      const guidance = section(page);
      await expect(guidance).toBeVisible();

      const items = guidance.getByRole("listitem");
      await expect(items).toHaveCount(service.beforeVisit?.items.length ?? 0);
      expect(service.beforeVisit?.items.length ?? 0).toBeGreaterThan(0);

      const titles = service.beforeVisit?.items.map((item) => item.title) ?? [];
      for (const title of titles) {
        await expect(guidance.getByRole("heading", { name: title })).toBeVisible();
      }

      await expect(
        guidance.getByText(/No service visit has been scheduled/),
      ).toBeVisible();
    });
  }

  test("shows the required safety titles for the hazardous services", async ({
    page,
  }) => {
    for (const [slug, titles] of Object.entries(emergencyRouteGuidance)) {
      await page.goto(`/services/${slug}`);
      const guidance = section(page);
      for (const title of titles) {
        await expect(
          guidance.getByRole("heading", { name: title }),
          `${slug} should include "${title}"`,
        ).toBeVisible();
      }
    }
  });

  test("marks important items with text, not colour alone", async ({ page }) => {
    await page.goto("/services/sump-pumps");
    const guidance = section(page);

    const labels = guidance.getByText("Important", { exact: true });
    await expect(labels).toHaveCount(1);

    const importantCard = guidance
      .getByRole("listitem")
      .filter({ hasText: "Do Not Enter Water Near Electrical Equipment" });
    await expect(importantCard.getByText("Important", { exact: true })).toBeVisible();

    const standardCard = guidance
      .getByRole("listitem")
      .filter({ hasText: "Keep the Pit Area Accessible" });
    await expect(
      standardCard.getByText("Important", { exact: true }),
    ).toHaveCount(0);
  });

  test("uses heading levels that keep a logical outline", async ({ page }) => {
    await page.goto("/services/leak-repair");

    const outline = await page.evaluate(() =>
      Array.from(document.querySelectorAll("h1,h2,h3,h4")).map((heading) => ({
        level: Number(heading.tagName[1]),
        text: (heading.textContent ?? "").trim().slice(0, 40),
      })),
    );

    expect(outline.filter((entry) => entry.level === 1)).toHaveLength(1);
    expect(
      outline.some((entry) => entry.text === "Before Your Visit" && entry.level === 2),
    ).toBe(true);

    const beforeVisitIndex = outline.findIndex(
      (entry) => entry.text === "Before Your Visit",
    );
    const itemIndex = outline.findIndex(
      (entry) => entry.text === "Keep Clear of Electrical Hazards",
    );
    expect(itemIndex).toBeGreaterThan(beforeVisitIndex);
    expect(outline[itemIndex].level).toBe(3);

    for (let index = 1; index < outline.length; index += 1) {
      expect(
        outline[index].level - outline[index - 1].level,
        `heading jump before "${outline[index].text}"`,
      ).toBeLessThanOrEqual(1);
    }
  });

  test("stays readable at 320px without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/services/drain-cleaning");

    const guidance = section(page);
    await guidance.scrollIntoViewIfNeeded();
    await expect(guidance.getByRole("listitem").first()).toBeVisible();

    expect(await horizontalOverflow(page)).toBe(0);

    const overflow = await page.evaluate(() => {
      const scope = document.querySelector("#before-your-visit");
      if (!scope) return null;
      return Array.from(scope.querySelectorAll("li")).map(
        (item) => item.getBoundingClientRect().right - window.innerWidth,
      );
    });
    expect(overflow).not.toBeNull();
    for (const value of overflow ?? []) {
      expect(value).toBeLessThanOrEqual(0);
    }
  });

  test("remains usable at 200% zoom", async ({ page }) => {
    await page.setViewportSize({ width: 195, height: 422 });
    await page.goto("/services/water-heaters");

    const guidance = section(page);
    await expect(guidance).toBeVisible();
    expect(await horizontalOverflow(page)).toBe(0);
    await expect(
      guidance.getByRole("heading", { name: "Do Not Open Access Panels" }),
    ).toBeVisible();
  });

  test("is reachable by keyboard and labelled as a region", async ({ page }) => {
    await page.goto("/services/sewer-lines");

    const guidance = section(page);
    await expect(guidance).toBeVisible();
    await expect(guidance).toHaveAttribute(
      "aria-labelledby",
      "before-your-visit-heading",
    );

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Start from the last focusable element that sits before the section.
    const startedBeforeSection = await page.evaluate((selector) => {
      const scope = document.querySelector("#before-your-visit");
      if (!scope) return false;
      const before = Array.from(
        document.querySelectorAll<HTMLElement>(selector),
      ).filter(
        (element) =>
          scope.compareDocumentPosition(element) &
          Node.DOCUMENT_POSITION_PRECEDING,
      );
      const last = before[before.length - 1];
      if (!last) return false;
      last.focus();
      return document.activeElement === last;
    }, focusableSelector);
    expect(startedBeforeSection).toBe(true);

    // Tab forward: the guidance is static content, so it must not add a tab
    // stop, and focus must continue to the call to action that follows it.
    const visited: string[] = [];
    let reachedFollowingContent = false;
    let focusEnteredSection = false;

    for (let step = 0; step < 12; step += 1) {
      await page.keyboard.press("Tab");

      const state = await page.evaluate(() => {
        const scope = document.querySelector("#before-your-visit");
        const active = document.activeElement as HTMLElement | null;
        if (!scope || !active || active === document.body) return null;
        return {
          label: `${active.tagName.toLowerCase()}: ${(active.textContent ?? "").trim().slice(0, 40)}`,
          insideSection: Boolean(active.closest("#before-your-visit")),
          followsSection: Boolean(
            scope.compareDocumentPosition(active) &
              Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        };
      });

      if (!state) break;
      visited.push(state.label);
      if (state.insideSection) {
        focusEnteredSection = true;
        break;
      }
      if (state.followsSection) {
        reachedFollowingContent = true;
        break;
      }
    }

    expect(focusEnteredSection).toBe(false);
    expect(
      reachedFollowingContent,
      `focus never moved past the guidance section; visited ${visited.join(" | ")}`,
    ).toBe(true);
  });

  test("keeps the guidance clear of the mobile action bar and footer reachable", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/services/toilets-faucets");

    const guidance = section(page);
    await expect(guidance).toBeVisible();

    const lastItem = guidance.getByRole("listitem").last();
    await expect(lastItem).toBeVisible();

    // The bar is fixed, so the requirement is that the final guidance item can
    // be scrolled fully clear of it rather than that the tall section is
    // shorter than the bar.
    const clearance = await page.evaluate(() => {
      const scope = document.querySelector("#before-your-visit");
      const bar = document.querySelector(".mobile-action-bar");
      const items = scope ? Array.from(scope.querySelectorAll("li")) : [];
      const last = items[items.length - 1];
      if (!last || !bar) return null;

      const barBox = bar.getBoundingClientRect();
      const targetTop =
        last.getBoundingClientRect().bottom + window.scrollY - barBox.height - 24;
      window.scrollTo({ top: targetTop, behavior: "instant" });

      const lastBox = last.getBoundingClientRect();
      return {
        covered: lastBox.bottom > barBox.top + 1,
        visible: lastBox.top < window.innerHeight && lastBox.bottom > 0,
      };
    });

    expect(clearance).not.toBeNull();
    expect(clearance?.covered).toBe(false);
    expect(clearance?.visible).toBe(true);

    await page.evaluate(() =>
      document.querySelector("footer")?.scrollIntoView({ block: "end" }),
    );
    await expect(page.locator("footer")).toBeInViewport();
  });

  test("places the guidance before the service request call to action", async ({
    page,
  }) => {
    await page.goto("/services/general-plumbing");

    const order = await page.evaluate(() => {
      const guidance = document.querySelector("#before-your-visit");
      const cta = Array.from(document.querySelectorAll("h2")).find((heading) =>
        (heading.textContent ?? "").startsWith("Request General Plumbing"),
      );
      if (!guidance || !cta) return null;
      return guidance.compareDocumentPosition(cta) &
        Node.DOCUMENT_POSITION_FOLLOWING
        ? "guidance-first"
        : "cta-first";
    });

    expect(order).toBe("guidance-first");
  });
});

test.describe("emergency safety callout", () => {
  test("shows the required immediate-threat sentence without interaction", async ({
    page,
  }) => {
    await page.goto("/emergency");

    const sentence = page.getByText(requiredSentence);
    await expect(sentence).toBeVisible();
    await expect(sentence).toBeInViewport();
    await expect(page.locator("details")).toHaveCount(0);
    await expect(page.locator("footer")).toHaveCount(1);
  });

  test("does not claim emergency response or dispatch", async ({ page }) => {
    await page.goto("/emergency");

    const text = (await page.locator("main").innerText()).toLowerCase();
    for (const phrase of [
      "on the way",
      "wait for our technician",
      "before we arrive",
      "your appointment",
      "guaranteed safe",
      "same-day",
    ]) {
      expect(text).not.toContain(phrase);
    }
    expect(text).not.toContain("911");
  });

  test("keeps the callout above the existing urgent-help content", async ({
    page,
  }) => {
    await page.goto("/emergency");

    const order = await page.evaluate(() => {
      const callout = document.querySelector("#emergency-immediate-heading");
      const situations = document.querySelector("#urgent-situations-heading");
      if (!callout || !situations) return null;
      return callout.compareDocumentPosition(situations) &
        Node.DOCUMENT_POSITION_FOLLOWING
        ? "callout-first"
        : "situations-first";
    });

    expect(order).toBe("callout-first");
  });
});
