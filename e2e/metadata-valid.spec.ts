import { expect, test } from "@playwright/test";

const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
test.skip(!envUrl, "requires NEXT_PUBLIC_SITE_URL at build and runtime");

const baseUrl = envUrl ? envUrl.replace(/\/$/, "") : "http://127.0.0.1:4300";

function findContent(html: string, name: string): string | null {
  const match = html.match(new RegExp(`${name}" content="([^"]*)"`));
  return match?.[1] ?? null;
}

test.describe("metadata head with a configured site URL", () => {
  test("homepage publishes absolute route-correct metadata", async ({
    request,
  }) => {
    const html = await (await request.get("/")).text();

    expect(html).toContain(
      "Plumbing Website Concept | ClearFlow Plumbing Co.",
    );
    expect(html).toContain(`rel="canonical" href="${baseUrl}"`);
    expect(findContent(html, "og:url")).toBe(baseUrl);
    expect(findContent(html, "og:title")).toBe(
      "Plumbing Website Concept | ClearFlow Plumbing Co.",
    );
    expect(findContent(html, "og:image")).toBe(`${baseUrl}/opengraph-image`);
    expect(findContent(html, "og:image:width")).toBe("1200");
    expect(findContent(html, "og:image:height")).toBe("630");
    expect(findContent(html, "og:image:type")).toBe("image/png");
    expect(findContent(html, "twitter:image")).toBe(
      `${baseUrl}/opengraph-image`,
    );
    expect(html).toContain(
      'name="twitter:card" content="summary_large_image"',
    );
    expect(html).toContain('content="noindex, nofollow"');
    expect(html).not.toContain("localhost");
  });

  test("a nested route keeps its own canonical and shares the social image", async ({
    request,
  }) => {
    const html = await (await request.get("/gallery")).text();

    expect(html).toContain(`rel="canonical" href="${baseUrl}/gallery"`);
    expect(findContent(html, "og:url")).toBe(`${baseUrl}/gallery`);
    expect(findContent(html, "og:title")).toBe(
      "Project Gallery | ClearFlow Plumbing Co.",
    );
    expect(findContent(html, "og:image")).toBe(`${baseUrl}/opengraph-image`);
    expect(html).not.toContain("localhost");
  });

  test("robots.txt publishes the owned origin as Host and keeps disallow", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(body).toContain("Disallow: /");
    expect(body).toContain(`Host: ${baseUrl}`);
  });
});