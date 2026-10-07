import { expect, test, type Page } from "@playwright/test";

/*
Floating-control fixes.

The two duplicated controls in the bottom corner (the mobile action bar and the
Assistant launcher) are suppressed while the Hero is on screen. Because the
suppression is published by an inline bootstrap script, the attribute exists
before any request for a JavaScript bundle has even been made, which is what the
bundle-blocking test proves. The other tests pin the boundary, the return
behavior, viewport changes, bfcache restore, focus safety, reduced motion,
Desktop, the no-JavaScript fallback, and the soft-navigation regression.
*/

const BAR = "mobile-action-bar";

/** Scrolls so the Hero's bottom edge sits 24px above the sticky header. */
async function scrollPastHero(page: Page) {
  await page.evaluate(() => {
    if (window.innerWidth >= 1024) return;
    const hero = document
      .querySelector("main [data-hero-root]")
      ?.closest("section");
    if (!hero) return;
    window.scrollTo({
      top: hero.getBoundingClientRect().top + window.scrollY + hero.offsetHeight + 24,
      behavior: "instant",
    });
  });
}

async function scrollBackToHero(page: Page) {
  await page.evaluate(() => {
    if (window.innerWidth >= 1024) return;
    const hero = document
      .querySelector("main [data-hero-root]")
      ?.closest("section");
    if (!hero) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

test.describe("floating controls over the homepage hero", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("is already hiding the controls at the earliest contentful paint", async ({
    page,
  }) => {
    // Runs in every frame before the page scripts, so it observes the first
    // frame exactly as the browser paints it.
    await page.addInitScript(() => {
      (window as Window & { __firstPaint?: Promise<unknown> }).__firstPaint =
        new Promise((resolve) => {
          const po = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name !== "first-contentful-paint") continue;
              const bar = document.querySelector(".mobile-action-bar");
              const launcher = document.querySelector("[data-assistant-launcher]");
              resolve({
                attr: document.documentElement.dataset.floatingControls ?? null,
                barPresent: Boolean(bar),
                barVisibility: bar ? getComputedStyle(bar).visibility : null,
                launcherVisibility: launcher
                  ? getComputedStyle(launcher).visibility
                  : null,
              });
              po.disconnect();
            }
          });
          po.observe({ type: "paint", buffered: true });
        });
    });

    await page.goto("/");
    const firstPaint = (await page.evaluate(
      () => (window as Window & { __firstPaint?: Promise<unknown> }).__firstPaint,
    )) as {
      attr: string | null;
      barPresent: boolean;
      barVisibility: string | null;
      launcherVisibility: string | null;
    };

    // If the controls are painted in the first frame they must already be
    // invisible, and any visible control implies the attribute failed to land
    // before paint.
    expect(firstPaint.barVisibility).toBe("hidden");
    expect(firstPaint.launcherVisibility).toBe("hidden");
    expect(firstPaint.attr).toBe("hero");
  });

  test("keeps both controls hidden on the first frame even if React never hydrates", async ({
    page,
  }) => {
    // Block every JavaScript module request, not just the entry: the inline
    // bootstrap is the only script that is allowed to run, and it must be
    // enough. No framework code will ever execute, so there is no React effect
    // that could hide the controls later.
    await page.route("**/*.js", (route) => route.abort());

    await page.goto("/");
    await expect(page.locator("." + BAR)).toBeHidden();

    await scrollPastHero(page);
    await expect(page.locator("." + BAR)).toBeVisible();

    await scrollBackToHero(page);
    await expect(page.locator("." + BAR)).toBeHidden();
  });

  test("reveals only once the hero passes the sticky header and re-hides on return", async ({
    page,
  }) => {
    await page.goto("/");

    const bar = page.locator("." + BAR);
    const launcher = page.getByRole("button", { name: /assistant/i });

    await expect(bar).toBeHidden();
    expect(
      await page.locator("html").getAttribute("data-floating-controls"),
    ).toBe("hero");

    // Ten pixels short of the boundary: still hidden.
    await page.evaluate(() => {
      const hero = document
        .querySelector("main [data-hero-root]")
        ?.closest("section");
      if (!hero) return;
      const header = document.querySelector("[data-sticky-header]")!;
      const bottom = hero.getBoundingClientRect().bottom;
      const target =
        bottom + window.scrollY - (header.getBoundingClientRect().bottom + 10);
      window.scrollTo({ top: target, behavior: "instant" });
    });
    await expect(bar).toBeHidden();

    await scrollPastHero(page);
    await expect(bar).toBeVisible();
    await expect(launcher).toBeVisible();
    expect(
      await page.locator("html").getAttribute("data-floating-controls"),
    ).toBe("page");

    await scrollBackToHero(page);
    await expect(bar).toBeHidden();
    await expect(launcher).toBeHidden();
  });

  test("keeps the pageshow (bfcache) state correct after a hard refresh below the boundary", async ({
    page,
  }) => {
    await page.goto("/");
    await scrollPastHero(page);
    await expect(page.locator("." + BAR)).toBeVisible();

    await page.reload();
    // The browser restores the scroll position without a scroll event; the
    // controller must recompute on pageshow.
    await expect(page.locator("." + BAR)).toBeVisible();
    expect(
      await page.locator("html").getAttribute("data-floating-controls"),
    ).toBe("page");
  });

  test("stays correct through an address-bar height change", async ({
    page,
  }) => {
    await page.goto("/");

    // Tall phone: hero visible, controls suppressed.
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator("." + BAR)).toBeHidden();

    // Address-bar collapse shrinks the viewport; hero still on screen.
    await page.setViewportSize({ width: 390, height: 700 });
    await expect(page.locator("." + BAR)).toBeHidden();

    await scrollPastHero(page);
    await expect(page.locator("." + BAR)).toBeVisible();

    // Address-bar expand changes the height back; the revealed state holds.
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator("." + BAR)).toBeVisible();
  });

  test("stays correct through a landscape orientation change", async ({
    page,
  }) => {
    await page.goto("/");
    await page.setViewportSize({ width: 844, height: 390 });
    await expect(page.locator("." + BAR)).toBeHidden();

    await scrollPastHero(page);
    await expect(page.locator("." + BAR)).toBeVisible();

    await scrollBackToHero(page);
    await expect(page.locator("." + BAR)).toBeHidden();
  });

  test("never hides the launcher while keyboard focus is on it", async ({
    page,
  }) => {
    await page.goto("/");
    await scrollPastHero(page);
    const launcher = page.getByRole("button", { name: /assistant/i });
    await expect(launcher).toBeVisible();

    await launcher.focus();
    await scrollBackToHero(page);

    // Focus wins: the visitor is still using the control.
    await expect(launcher).toBeVisible();
    expect(
      await page.locator("html").getAttribute("data-floating-controls"),
    ).toBe("page");
  });

  test("respects reduced motion", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto("/");

    await expect(page.locator("." + BAR)).toBeHidden();
    const styles = await page.evaluate(() => {
      const bar = document.querySelector(".mobile-action-bar")!;
      const s = getComputedStyle(bar);
      return {
        // The global reduced-motion rule still forces a 0.01ms duration, so the
        // shorthand serializes as "none 1e-05s"; what must hold is that there
        // is no transition property and no transform at all.
        transitionProperty: s.transitionProperty,
        opacity: s.opacity,
        transform: s.transform,
      };
    });
    expect(styles.transitionProperty).toBe("none");
    expect(styles.transform).toBe("none");
    expect(styles.opacity).toBe("0");
  });

  test("cannot run without JavaScript, so the controls stay visible by design", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto("/");

    await expect(page.locator("." + BAR)).toBeVisible();
    expect(
      await page.locator("html").getAttribute("data-floating-controls"),
    ).toBeNull();
  });
});

test.describe("floating controls across route changes", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("resets the attribute after a client-side navigation leaves the homepage", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: "All Services", exact: true })
      .click();
    await expect(page).toHaveURL(/\/services$/);

    // No Hero on this route, so the controls are never suppressed.
    expect(
      await page.locator("html").getAttribute("data-floating-controls"),
    ).toBeNull();
    await expect(page.locator("." + BAR)).toBeVisible();
  });

  test("starts suppressing as soon as a client-side navigation returns to the homepage", async ({
    page,
  }) => {
    await page.goto("/services");
    expect(
      await page.locator("html").getAttribute("data-floating-controls"),
    ).toBeNull();

    // Return to the Hero route without a full page load: the old controller
    // must notice the Hero arriving and publish the state over it.
    await page.getByRole("link", { name: /Home$/ }).first().click();
    await expect(page).toHaveURL(/\/$/);

    await expect(page.locator("." + BAR)).toBeHidden();
    expect(
      await page.locator("html").getAttribute("data-floating-controls"),
    ).toBe("hero");
  });
});

test.describe("floating controls at desktop", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("publishes no state above the lg breakpoint", async ({ page }) => {
    await page.goto("/");

    expect(
      await page.locator("html").getAttribute("data-floating-controls"),
    ).toBeNull();
    // The bar still renders, hidden by `lg:hidden` at this width.
    await expect(page.locator("." + BAR)).toBeHidden();
  });
});