import { expect, test } from "@playwright/test";

test.describe("premium motion", () => {
  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("keeps content visible without JavaScript", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const html = await page.content();
      expect(html).toContain("data-reveal");
      expect(html).not.toContain('data-reveal-state="pending"');
      await expect(page.locator('[data-reveal-state="pending"]')).toHaveCount(0);
    });
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("keeps every revealed element fully visible with no transforms", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const state = await page.evaluate(() => {
        const reveals = Array.from(document.querySelectorAll("[data-reveal]"));
        return {
          count: reveals.length,
          pending: reveals.filter((node) =>
            (node as HTMLElement).dataset.revealState === "pending",
          ).length,
          opacity: reveals.map((node) => getComputedStyle(node).opacity),
          transform: reveals.map((node) => getComputedStyle(node).transform),
          scrollBehavior:
            getComputedStyle(document.documentElement).scrollBehavior,
        };
      });

      expect(state.pending).toBe(0);
      expect(state.opacity.every((value) => value === "1")).toBe(true);
      expect(
        state.transform.every(
          (value) => value === "none" || value === "matrix(1, 0, 0, 1, 0, 0)",
        ),
      ).toBe(true);
      expect(state.scrollBehavior).toBe("auto");
    });
  });

  test("marks below-the-fold cards pending, then reveals them with a capped stagger", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.waitForFunction(() =>
      document.querySelectorAll('[data-reveal-state="pending"]').length > 0,
    );

    const lastCard = page.locator("li[data-reveal]").last();
    await lastCard.scrollIntoViewIfNeeded();
    await expect(lastCard).toHaveAttribute("data-reveal-state", "revealed");

    const delays = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("[data-reveal]"),
      ).map((node) =>
        Number.parseInt(
          (node as HTMLElement).style.getPropertyValue("--reveal-stagger-ms") || "0",
          10,
        ),
      ),
    );
    expect(delays.length).toBeGreaterThan(0);
    expect(
      delays.every((value) => Number.isFinite(value) && value <= 240),
    ).toBe(true);
  });

  test("toggles the header scroll-state attribute without changing its height", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const header = page.locator("header.site-header");
    await expect(header).toHaveCSS("position", "sticky");
    const before = await header.boundingBox();

    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(page.locator("html")).toHaveAttribute("data-scrolled", "true");
    const after = await header.boundingBox();
    expect(after?.height).toBe(before?.height);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-scrolled",
      "true",
    );
  });

  test("targets the page top with the back-to-top control", async ({ page }) => {
    await page.goto("/");
    const backToTop = page.getByRole("link", { name: "Back to top" });
    await expect(backToTop).toHaveAttribute("href", "#top");
    await expect(page.locator("#top").first()).toHaveCount(1);
  });

  test("reapplies the menu entrance animation on every open", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator(".mobile-menu-panel-enter")).toHaveCount(1);
    await page.getByRole("button", { name: "Close menu" }).click();

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator(".mobile-menu-panel-enter")).toHaveCount(1);
  });

  test("keeps the landing weight behind the step-in form content", async ({
    page,
  }) => {
    await page.goto("/#estimate");
    await expect(page.locator(".step-in")).toHaveCount(1);
  });
});