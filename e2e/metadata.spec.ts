import { expect, test } from "@playwright/test";

function pngDimensions(buffer: Buffer): { width: number; height: number } {
  expect(buffer.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

test.describe("metadata head on the default build (no site URL)", () => {
  for (const path of ["/", "/pricing"]) {
    test(`publishes safe, complete metadata on ${path}`, async ({ request }) => {
      const html = await (await request.get(path)).text();

      expect(html).toContain('content="noindex, nofollow"');
      expect(html).toContain('property="og:type" content="website"');
      expect(html).toContain('property="og:locale" content="en_US"');
      expect(html).toContain(
        'property="og:site_name" content="ClearFlow Plumbing Co."',
      );
      expect(html).toContain(
        'name="twitter:card" content="summary_large_image"',
      );
      expect(html).not.toContain('rel="canonical"');
      expect(html).not.toContain('property="og:url"');
      expect(html).not.toContain('property="og:image"');
      expect(html).not.toContain('property="twitter:image"');
      expect(html).not.toContain("localhost");
    });

    test(`renders a correct title and theme hint on ${path}`, async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(/ClearFlow Plumbing Co\.$/);
      await expect(
        page.locator('meta[name="theme-color"]'),
      ).toHaveAttribute("content", "#0b1f33");
      await expect
        .poll(() =>
          page.locator('meta[name="viewport"]').getAttribute("content"),
        )
        .toContain("width=device-width");
    });
  }

  test("does not publish a robots Host without a configured origin", async ({
    request,
  }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toContain("Disallow: /");
    expect(body).not.toMatch(/^Host:/m);
  });
});

test.describe("social preview image route", () => {
  test("serves a deterministic 1200x630 PNG under 5MB", async ({ request }) => {
    const response = await request.get("/opengraph-image");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");

    const body = await response.body();
    expect(body.length).toBeGreaterThan(0);
    expect(body.length).toBeLessThan(5 * 1024 * 1024);

    const { width, height } = pngDimensions(body);
    expect(width).toBe(1200);
    expect(height).toBe(630);

    const second = await request.get("/opengraph-image");
    expect((await second.body()).equals(body)).toBe(true);
  });

  test("serves the site icon route", async ({ request }) => {
    const response = await request.get("/icon.svg");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
  });
});