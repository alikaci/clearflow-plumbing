import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("renders the primary heading and request call to action", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Request a Free Estimate" }).first(),
    ).toBeVisible();
  });

  test("loads with no console errors or page errors", async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(message.text());
    });
    page.on("pageerror", (error) => problems.push(error.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(problems.filter((entry) => !entry.includes("favicon"))).toEqual([]);
  });

  test("serves a custom not-found page", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-real-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("service discovery", () => {
  test("lists all eight services on the hub and opens a detail page", async ({
    page,
  }) => {
    await page.goto("/services");
    const links = page.locator('a[href^="/services/"]');
    await expect(links.first()).toBeVisible();
    expect(await links.count()).toBeGreaterThanOrEqual(8);

    await page.goto("/services/water-heaters");
    await expect(
      page.getByRole("heading", { level: 1, name: /Water Heater/i }),
    ).toBeVisible();
  });
});

test.describe("request flow", () => {
  test("completes the multi-step estimate form", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Request a Free Estimate" }).first().click();
    await expect(page).toHaveURL(/#estimate/);

    await page.getByLabel(/Which service do you need/).selectOption("water-heaters");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel(/^City/).fill("Columbus");
    await page.getByRole("textbox", { name: "ZIP code (required)" }).fill("43215");
    await page.getByRole("button", { name: "Continue" }).click();

    await page
      .getByLabel(/Describe the problem/)
      .fill("The water heater is leaking from the base.");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel(/^Full name/).fill("Jordan Miller");
    await page.getByRole("textbox", { name: /^Email/ }).fill("jordan@example.com");
    await page.getByRole("textbox", { name: /^Phone/ }).fill("6145550147");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel(/portfolio demonstration/).check();
    await page.getByRole("button", { name: "Submit request" }).click();

    await expect(page.getByText("Your request has been prepared.")).toBeVisible({
      timeout: 5000,
    });
    await expect(
      page.getByText("This portfolio demonstration did not create a real plumbing appointment."),
    ).toBeVisible();
  });

  test("checks ZIP coverage in the service-area tool", async ({ page }) => {
    await page.goto("/service-areas");
    await page.getByRole("textbox", { name: "ZIP code" }).fill("43215");
    await page.getByRole("button", { name: "Check coverage" }).click();
    await expect(
      page.getByText(/included in the demonstration service area/),
    ).toBeVisible();
  });
});

test.describe("responsive layout", () => {
  test("shows the mobile action bar on small screens and hides it on desktop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const bar = page.locator(".mobile-action-bar");
    await expect(bar.getByRole("link", { name: "Call Now" })).toBeVisible();

    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(bar.getByRole("link", { name: "Call Now" })).toBeHidden();
  });
});
