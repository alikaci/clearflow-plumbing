import { expect, test } from "@playwright/test";

const requiredDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
];

test.describe("production content security policy", () => {
  test("is strict and drops development-only allowances", async ({ page }) => {
    const response = await page.goto("/");
    const csp = response?.headers()["content-security-policy"] ?? "";

    expect(csp).not.toBe("");

    for (const directive of requiredDirectives) {
      expect(csp).toContain(directive);
    }

    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).toContain("connect-src 'self'");
    expect(csp).not.toContain("ws:");
    expect(csp).not.toContain("wss:");
  });

  test("keeps the baseline security headers", async ({ page }) => {
    const response = await page.goto("/");
    const headers = response?.headers() ?? {};

    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toBe(
      "geolocation=(), camera=(), microphone=()",
    );
    expect(headers["x-frame-options"]).toBe("DENY");
  });
});

test.describe("canonical and robots safety", () => {
  test("omits canonical, localhost and unowned-domain claims", async ({
    request,
  }) => {
    const html = await (await request.get("/")).text();

    expect(html).not.toContain("localhost");
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain('property="og:url"');
    expect(html).not.toContain('property="og:image"');
    expect(html).not.toContain('property="twitter:image"');
    expect(html).toContain('content="noindex, nofollow"');
  });

  test("does not publish a robots Host for an unowned domain", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(body).toContain("Disallow: /");
    expect(body).not.toMatch(/^Host:/m);
  });
});

test.describe("interactive hydration on the production build", () => {
  test("mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Services" })).toBeVisible();

    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(dialog).toBeHidden();
  });

  test("FAQ accordion expands on activation", async ({ page }) => {
    await page.goto("/");
    const trigger = page.locator('button[aria-controls^="faq-panel-"]').first();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panelId = await trigger.getAttribute("aria-controls");
    await expect(page.locator(`#${panelId}`)).toBeVisible();
  });

  test("ZIP checker validates and resets", async ({ page }) => {
    await page.goto("/");
    const zip = page.getByRole("textbox", { name: "ZIP code" });
    await zip.fill("43215");
    await page.getByRole("button", { name: "Check coverage" }).click();
    await expect(
      page.getByText(/included in the demonstration service area/),
    ).toBeVisible();

    await page.getByRole("button", { name: "Check another ZIP" }).click();
    await expect(zip).toHaveValue("");
  });

  test("booking preview completes without auto-submitting early", async ({
    page,
  }) => {
    await page.goto("/book");

    await page.getByLabel(/Which service do you need/).selectOption("drain-cleaning");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel(/Preferred date/).fill("2030-06-15");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel(/Preferred time range/).selectOption("8-10");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel(/^Full name/).fill("Jordan Miller");
    await page.getByRole("textbox", { name: /^Email/ }).fill("jordan@example.com");
    await page.getByRole("textbox", { name: /^Phone/ }).fill("6145550147");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText("Review your request")).toBeVisible();
    await page.getByRole("button", { name: "Submit request" }).click();
    await expect(
      page.getByText("Booking preview complete. No real appointment was created."),
    ).toBeVisible();
  });

  test("assistant opens, responds and closes with Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open website assistant" }).click();

    const dialog = page.getByRole("dialog", { name: "Website assistant" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "I have a leak" }).click();
    await expect(
      dialog.getByText(/Leaks can range from a dripping fixture/),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
