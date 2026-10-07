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
    const postSubmitRequests: string[] = [];
    page.on("request", (request) => {
      postSubmitRequests.push(`${request.method()} ${request.url()}`);
    });
    await page.getByRole("button", { name: "Submit request" }).click();

    await expect(
      page.getByRole("heading", { name: "Your Request Summary Is Ready" }),
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.getByText("Request prepared. No information was sent and no appointment was created."),
    ).toBeVisible();
    await expect(
      page.getByText(
        "This is a portfolio demonstration. No information has been sent to a plumbing company, no appointment has been created and no technician has been dispatched.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Request Summary", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "How a Request Moves Through the Office" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "What has not happened" }),
    ).toBeVisible();
    await expect(page.getByText(/^CF-DEMO-\d{6}$/)).toBeVisible();
    await expect(page.getByText("No photos selected")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Return Home" }),
    ).toHaveAttribute("href", "/");
    await expect(
      page
        .locator("#estimate")
        .getByRole("link", { name: /Call \(614\) 555-0147/ }),
    ).toHaveAttribute("href", "tel:+16145550147");
    expect(
      postSubmitRequests.filter((entry) => !entry.startsWith("GET ")),
    ).toEqual([]);
  });

  test("checks ZIP coverage in the service-area tool", async ({ page }) => {
    await page.goto("/service-areas");
    await page.getByRole("textbox", { name: "ZIP code" }).fill("43215");
    await page.getByRole("button", { name: "Check coverage" }).click();
    // Scope to the live region: the intro copy also mentions the service area.
    await expect(
      page.getByRole("status").filter({ hasText: /inside our Columbus service area/ }),
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
    // The bar intentionally stays hidden while the Hero is on screen, exactly
    // like a visitor who has not scrolled yet would not see it, so this check
    // scrolls past the Hero first.
    await page.evaluate(() => {
      const hero = document
        .querySelector("main [data-hero-root]")
        ?.closest("section");
      if (!hero) return;
      window.scrollTo({
        top: hero.getBoundingClientRect().top + window.scrollY + hero.offsetHeight + 24,
        behavior: "instant",
      });
    });
    await expect(bar.getByRole("link", { name: "Call Now" })).toBeVisible();

    await page.setViewportSize({ width: 1280, height: 900 });
    // The bar does not render at all on desktop.
    await expect(bar.getByRole("link", { name: "Call Now" })).toHaveCount(0);
  });
});

test.describe("premium conversion", () => {
  test("homepage problem chooser lists every problem destination", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "What's happening?" }),
    ).toBeVisible();

    const serviceLinks = page.locator('a[href^="/services/"]');
    expect(await serviceLinks.count()).toBeGreaterThanOrEqual(8);
    await expect(
      page.getByRole("link", { name: "See general plumbing" }),
    ).toHaveAttribute("href", "/services/general-plumbing");
  });

  test("service-areas hero anchors to the ZIP checker", async ({ page }) => {
    await page.goto("/service-areas");

    await page.getByRole("link", { name: "Check Coverage" }).click();
    await expect(page).toHaveURL(/#check-coverage/);
    await expect(page.getByRole("textbox", { name: "ZIP code" })).toBeVisible();
  });
});
