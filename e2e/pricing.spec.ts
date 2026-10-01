import { expect, test } from "@playwright/test";

test.describe("pricing page", () => {
  test("renders the process page with its disclosure and steps", async ({
    page,
  }) => {
    await page.goto("/pricing");

    await expect(page).toHaveTitle("How Pricing Works | ClearFlow Plumbing Co.");
    await expect(
      page.getByRole("heading", { level: 1, name: "Clear Estimates Before Work Begins" }),
    ).toBeVisible();
    await expect(page.getByText("PRICING PROCESS")).toBeVisible();
    await expect(
      page.getByText(
        "ClearFlow Plumbing Co. is fictional. No real pricing, estimates or plumbing services are provided through this website.",
      ),
    ).toBeVisible();

    for (const title of [
 "Tell Us What's Happening",
      "Initial Review",
      "On-Site Assessment",
      "Clear Estimate",
      "Customer Approval",
    ]) {
      await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }

    await expect(
      page.getByRole("heading", { level: 2, name: "What Can Affect the Cost?" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Questions to Ask Before Approving Work",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Request a Service" }),
    ).toHaveAttribute("href", "/#estimate");
  });

  test("keeps noindex/nofollow and publishes no canonical or social URLs", async ({
    request,
  }) => {
    const html = await (await request.get("/pricing")).text();

    expect(html).toContain('content="noindex, nofollow"');
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain("localhost");
    expect(html).not.toContain('property="og:url"');
  });

  test("links to the page from the footer", async ({ page }) => {
    await page.goto("/");
    const footerLink = page
      .getByRole("contentinfo")
      .getByRole("link", { name: "How Pricing Works" });

    await expect(footerLink).toBeVisible();
    await expect(footerLink).toHaveAttribute("href", "/pricing");

    await footerLink.click();
    await expect(page).toHaveURL(/\/pricing$/);
  });

  test("is not added to the primary desktop navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pricing");

    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(
      nav.getByRole("link", { name: "How Pricing Works" }),
    ).toHaveCount(0);
  });

  test("has one H1 and no horizontal overflow at narrow widths", async ({
    page,
  }) => {
    for (const width of [320, 360, 390]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/pricing");

      const data = await page.evaluate(() => {
        const root = document.documentElement;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, root.scrollHeight);
        const bar = document.querySelector<HTMLElement>(".mobile-action-bar");
        const last = Array.from(document.querySelectorAll("footer *"))
          .map((n) => n.getBoundingClientRect())
          .filter((r) => r.width > 0 && r.height > 0 && r.bottom > 0)
          .sort((x, y) => y.bottom - x.bottom)[0];
        window.scrollTo(0, 0);
        return {
          h1: document.querySelectorAll("h1").length,
          overflow: root.scrollWidth - root.clientWidth,
          lastBottom: Math.round(last.bottom),
          barTop: Math.round(bar?.getBoundingClientRect().top ?? 0),
          bodyPad: getComputedStyle(document.body).paddingBottom,
        };
      });

      expect(data.h1, `${width}px h1 count`).toBe(1);
      expect(data.overflow, `${width}px overflow`).toBe(0);
      // Batch 1 shell clearance still applies on the new page
      expect(data.lastBottom, `${width}px final content`).toBeLessThanOrEqual(
        data.barTop,
      );
      expect(data.bodyPad).not.toBe("0px");
    }
  });
});
