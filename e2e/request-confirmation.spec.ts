import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const demoValues = {
  city: "Columbus",
  zip: "43215",
  description:
    "The water heater is leaking from the base and needs a new fitting.",
  fullName: "Jordan Miller",
  email: "jordan@example.com",
  phone: "6145550147",
};

async function reachEstimateForm(page: Page) {
  await page.goto("/");
  await page.getByRole("link", { name: "Request a Free Estimate" }).first().click();
  await expect(page).toHaveURL(/#estimate/);
}

async function completeRequest(page: Page) {
  await page.getByLabel(/Which service do you need/).selectOption("water-heaters");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel(/^City/).fill(demoValues.city);
  await page.getByRole("textbox", { name: "ZIP code (required)" }).fill(demoValues.zip);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel(/Describe the problem/).fill(demoValues.description);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel(/^Full name/).fill(demoValues.fullName);
  await page.getByRole("textbox", { name: /^Email/ }).fill(demoValues.email);
  await page.getByRole("textbox", { name: /^Phone/ }).fill(demoValues.phone);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel(/portfolio demonstration/).check();
  await page.getByRole("button", { name: "Submit request" }).click();
  await expect(
    page.getByRole("heading", { name: confirmationHeading }),
  ).toBeVisible({ timeout: 5000 });
}

function readStorage(page: Page) {
  return page.evaluate(() => ({
    local: JSON.stringify(window.localStorage),
    session: JSON.stringify(window.sessionStorage),
    cookies: document.cookie,
    search: window.location.search,
    hash: window.location.hash,
  }));
}

const confirmationHeading = "Your Request Summary Is Ready";

test.describe("request confirmation", () => {
  test("keeps the submitted request out of storage, cookies and the URL", async ({
    page,
  }) => {
    const requests: string[] = [];
    const consoleErrors: string[] = [];
    page.on("request", (request) => {
      requests.push(`${request.method()} ${request.url()}`);
    });
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        consoleErrors.push(message.text());
      }
    });

    await reachEstimateForm(page);
    await completeRequest(page);

    const stored = await readStorage(page);
    expect(stored.local).toBe("{}");
    expect(stored.session).toBe("{}");
    expect(stored.cookies).toBe("");
    expect(stored.search).toBe("");
    expect(stored.hash).toBe("#estimate");
    expect(requests.filter((entry) => !entry.startsWith("GET "))).toEqual([]);
    expect(consoleErrors).toEqual([]);

    const body = await page.locator("main").innerText();
    for (const secret of [
      demoValues.fullName,
      demoValues.email,
      demoValues.phone,
    ]) {
      expect(body).not.toContain(secret);
    }
  });

  test("does not restore the confirmation after reload, a new tab or history", async ({
    page,
    context,
  }) => {
    await reachEstimateForm(page);
    await completeRequest(page);
    await expect(page.getByText(/^CF-DEMO-\d{6}$/)).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("heading", { name: confirmationHeading }),
    ).toHaveCount(0);
    await expect(page.getByText(/^CF-DEMO-\d{6}$/)).toHaveCount(0);

    const freshTab = await context.newPage();
    await freshTab.goto("/");
    await expect(
      freshTab.getByRole("heading", { name: confirmationHeading }),
    ).toHaveCount(0);
    await expect(freshTab.getByText(/^CF-DEMO-\d{6}$/)).toHaveCount(0);
    await freshTab.close();

    await page.goBack();
    await page.goForward();
    await expect(page.getByText(/^CF-DEMO-\d{6}$/)).toHaveCount(0);
    expect(new URL(page.url()).search).toBe("");
  });

  test("Start a New Request clears the form, the reference and the photos", async ({
    page,
  }) => {
    await reachEstimateForm(page);
    await completeRequest(page);

    await page.getByRole("button", { name: "Start a New Request" }).click();

    await expect(page.getByText(/^CF-DEMO-\d{6}$/)).toHaveCount(0);
    await expect(page.getByText("Step 1 of 5", { exact: true })).toBeVisible();
    await expect(page.getByLabel(/Which service do you need/)).toHaveValue("");
    await expect(
      page.getByRole("heading", { name: confirmationHeading }),
    ).toHaveCount(0);

    const focusedLabel = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement | null;
      return active?.getAttribute("id") ?? active?.tagName ?? "";
    });
    expect(focusedLabel).toBe("estimate-service");
  });

  test("keeps the confirmation actions clear of the mobile action bar", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await reachEstimateForm(page);
    await completeRequest(page);

    const actions = page.getByRole("button", { name: "Start a New Request" });
    await actions.scrollIntoViewIfNeeded();
    await expect(actions).toBeVisible();

    const overlap = await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find(
        (node) => node.textContent?.trim() === "Start a New Request",
      );
      const bar = document.querySelector(".mobile-action-bar");
      if (!button || !bar) return null;
      const a = button.getBoundingClientRect();
      const b = bar.getBoundingClientRect();
      return {
        buttonBottom: Math.round(a.bottom),
        barTop: Math.round(b.top),
        overlaps: a.bottom > b.top && a.top < b.bottom,
      };
    });
    expect(overlap).not.toBeNull();
    expect(overlap?.overlaps).toBe(false);
    expect(overlap?.buttonBottom).toBeLessThanOrEqual(overlap?.barTop ?? 0);
  });

  test("leaves the confirmation actions reachable at 320px without overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await reachEstimateForm(page);
    await completeRequest(page);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
    const estimate = page.locator("#estimate");
    await expect(estimate.getByRole("link", { name: "Return Home" })).toBeVisible();
    await expect(
      estimate.getByRole("link", { name: /Call \(614\) 555-0147/ }),
    ).toHaveAttribute("href", "tel:+16145550147");

    const sizes = await page.evaluate(() => {
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(
          '#estimate button, #estimate a[href^="tel:"]',
        ),
      ).filter((node) => node.offsetParent !== null);
      return targets.map((node) => ({
        text:
          node.textContent?.trim().slice(0, 28) ||
          node.getAttribute("aria-label") ||
          "",
        height: Math.round(node.getBoundingClientRect().height),
        width: Math.round(node.getBoundingClientRect().width),
      }));
    });
    expect(sizes.length).toBeGreaterThan(0);
    for (const target of sizes) {
      expect(target.height, `${target.text} touch target`).toBeGreaterThanOrEqual(44);
    }
  });
});
