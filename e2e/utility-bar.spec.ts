import { expect, test, type Page } from "@playwright/test";

/*
Utility bar redesign.

The bar is the navy strip under the sticky header. Everything on it stays on
one line at every width (the phone number is the visible label, the emergency
line the only accented text), the strip holds its 40-44px height target, and
the claims tier out by width: mobile shows emergency + phone, sm adds the
service area, lg adds office hours.
*/

const BAR = "div.bg-navy";

async function barMetrics(page: Page) {
  return page.evaluate(() => {
    const bar = document.querySelector("div.bg-navy");
    const box = bar!.getBoundingClientRect();
    const items = Array.from(bar!.querySelectorAll("span, a")).filter(
      (el) => el.getClientRects().length > 0 && (el as HTMLElement).offsetHeight > 0,
    );
    const tops = items.map((el) => el.getBoundingClientRect().top);
    const bottoms = items.map((el) => el.getBoundingClientRect().bottom);
    return {
      height: box.height,
      itemCount: items.length,
      // One visual row: a centre-aligned flex line lets inline text sit ~2px
      // off the 24px-tall links, but a genuinely wrapped item would sit a full
      // row (~26px) lower. 12px separates those cases.
      singleLine: tops.length > 0 && Math.max(...tops) - Math.min(...tops) < 12,
      topOverflow: bottoms.length > 0 && Math.max(...bottoms) - box.bottom < 1,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
}

test.describe("utility bar mobile", () => {
  for (const viewport of [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
  ]) {
    test(`fits one line between 40-44px tall at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const bar = page.locator("div.bg-navy");

      const emergency = bar.getByRole("link", {
        name: "24/7 emergency calls",
        exact: true,
      });
      const phone = bar.getByRole("link", {
        name: "Call (614) 555-0147",
        exact: true,
      });

      await expect(emergency).toBeVisible();
      await expect(phone).toBeVisible();

      const m = await barMetrics(page);
      expect(m.horizontalOverflow).toBeLessThanOrEqual(1);
      expect(m.height).toBeGreaterThanOrEqual(40);
      expect(m.height).toBeLessThanOrEqual(44);
      expect(m.singleLine).toBe(true);
      expect(m.topOverflow).toBe(true);

      // The number reads at a glance even when it is the only visible clue.
      await expect(bar.getByText("(614) 555-0147")).toBeVisible();
    });
  }

  test("tiers out: no service area and no office hours below 640px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const bar = page.locator("div.bg-navy");

    await expect(bar.getByText(/Serving Columbus/)).toBeHidden();
    await expect(bar.getByText(/Office:/)).toBeHidden();
  });

  test("keeps the phone reachable and the offer visible at 280px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 280, height: 653 });
    await page.goto("/");

    // 200% zoom on a phone is a 195px-ish layout box; 280px is the narrowest
    // Chromium will render. The bar must wrap its texts, not overflow.
    await expect(
      page
        .locator("div.bg-navy")
        .getByRole("link", { name: "Call (614) 555-0147", exact: true }),
    ).toBeVisible();
    const m = await barMetrics(page);
    expect(m.horizontalOverflow).toBeLessThanOrEqual(1);
  });
});

test.describe("utility bar sm and lg tiers", () => {
  test("adds the service area at sm but not office hours", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    const bar = page.locator("div.bg-navy");

    await expect(bar.getByText(/Serving Columbus/)).toBeVisible();
    await expect(bar.getByText(/Office:/)).toBeHidden();
    await expect(bar.getByText("(614) 555-0147")).toBeVisible();
    await expect(bar.getByText("24/7 emergency calls")).toBeVisible();

    const m = await barMetrics(page);
    expect(m.height).toBeLessThanOrEqual(44);
    expect(m.singleLine).toBe(true);
  });

  test("shows the complete bar at lg and up, one line, in the height band", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const bar = page.locator("div.bg-navy");

    await expect(bar.getByText(/Serving Columbus/)).toBeVisible();
    await expect(bar.getByText(/Office:/)).toBeVisible();
    await expect(
      bar.getByRole("link", { name: "Call (614) 555-0147", exact: true }),
    ).toBeVisible();

    const m = await barMetrics(page);
    expect(m.height).toBeGreaterThanOrEqual(40);
    expect(m.height).toBeLessThanOrEqual(44);
    expect(m.singleLine).toBe(true);
  });
});

test.describe("utility bar contrast", () => {
  test("phone pill and emergency glyph meet WCAG AA, as does body text", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const ratio = (a: string, b: string) => {
      const rgb = (cs: string) =>
        cs
          .match(/\d+/g)!
          .slice(0, 3)
          .map((v) => Number(v) / 255)
          .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      const lum = (cs: string) => {
        const [r, g, b] = rgb(cs);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (l1 + 0.05) / (l2 + 0.05);
    };

    const colors = await page.evaluate(() => {
      const phone = document.querySelector<HTMLAnchorElement>(
        'a[aria-label="Call (614) 555-0147"]',
      )!;
      const navys = getComputedStyle(phone).color;
      const oranges = getComputedStyle(phone).backgroundColor;
      const emergency = document.querySelector<HTMLAnchorElement>(
        'a[href="/emergency"]',
      )!;
      const bar = document.querySelector("div.bg-navy")!;
      return {
        navyText: navys,
        orangeBg: oranges,
        barBg: getComputedStyle(bar).backgroundColor,
        whiteText: getComputedStyle(bar).color,
        emergencyGlyph: getComputedStyle(
          emergency.querySelector("svg")!,
        ).color,
      };
    });

    expect(ratio(colors.navyText, colors.orangeBg)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(colors.whiteText, colors.barBg)).toBeGreaterThanOrEqual(7);
    expect(ratio(colors.emergencyGlyph, colors.barBg)).toBeGreaterThanOrEqual(
      4.5,
    );
  });
});