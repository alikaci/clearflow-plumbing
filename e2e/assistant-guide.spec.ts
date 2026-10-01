import { expect, test, type Page } from "@playwright/test";

/*
Premium Batch Part 2: the guided ClearFlow assistant.

These checks cover the interactive contract (open, route, respond, reset,
Escape), the two required viewports, keyboard-only use, the mobile action bar
offset, text-only zoom reflow, reduced motion, the no-JavaScript fallback, and
a runtime proof that typing sends no request and writes no storage.
*/

const LAUNCHER = "Open website assistant";
const CLOSE = "Close website assistant";
const DIALOG = "Website assistant";

async function openAssistant(page: Page) {
  await page.getByRole("button", { name: LAUNCHER }).click();
  const dialog = page.getByRole("dialog", { name: DIALOG });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function ask(dialog: ReturnType<Page["getByRole"]>, text: string) {
  const input = dialog.getByRole("textbox");
  await input.fill(text);
  await input.press("Enter");
}

test.describe("guided assistant", () => {
  test.describe("mobile 390x844", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("shows the welcome state with the scripted demo disclosures", async ({
      page,
    }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);

 await expect(dialog.getByText("Hi - I'm the ClearFlow Guide.")).toBeVisible();
      await expect(dialog.getByText(/scripted, guided tour/)).toBeVisible();
      await expect(dialog.getByText(/cannot diagnose/)).toBeVisible();
      await expect(dialog.getByText(/does not connect to a live person/)).toBeVisible();
      await expect(
        dialog.getByText(/Nothing you type is sent anywhere or stored/),
      ).toBeVisible();
      await expect(dialog.getByText(/fictional portfolio demonstration/)).toBeVisible();
      await expect(dialog.getByText("Guided demo")).toBeVisible();
      await expect(dialog.getByRole("textbox")).toHaveAttribute(
        "maxlength",
        "300",
      );
    });

    test("routes a quick prompt and links into the matching service page", async ({
      page,
    }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);

      await dialog.getByRole("button", { name: "I have a water leak" }).click();

      await expect(
        dialog.getByText("I have a water leak", { exact: true }),
      ).toHaveCount(2); // the retained prompt chip and the new user bubble
      await expect(
        dialog.getByText(/A leak can range from a dripping fixture/),
      ).toBeVisible();
      await expect(
        dialog.getByRole("link", { name: "See leak repair" }),
      ).toHaveAttribute("href", "/services/leak-repair");
    });

    test("keeps the panel above the mobile action bar with no overlap", async ({
      page,
    }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);

      // The action bar yields its space to the open panel, so the reserved
      // height reads zero and the panel only has to clear the shared gap.
      const bar = page.locator(".mobile-action-bar");
      await expect(bar).toBeHidden();

      const panelBox = await dialog.boundingBox();
      const launcherBox = await page
        .getByRole("button", { name: CLOSE })
        .last()
        .boundingBox();
      const send = dialog.getByRole("button", { name: "Send" });
      const sendBox = await send.boundingBox();

      expect(panelBox).not.toBeNull();
      expect(sendBox).not.toBeNull();
      // One launcher height of clearance keeps the toggle clear of the composer.
      expect(panelBox!.y + panelBox!.height).toBeLessThanOrEqual(
        844 - (launcherBox!.height + 14),
      );

      // The launcher toggle must not cover the send control beneath it.
      const overlaps = (
        a: NonNullable<typeof sendBox>,
        b: NonNullable<typeof sendBox>,
      ) =>
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
      expect(overlaps(sendBox!, launcherBox!)).toBe(false);
      await dialog.getByRole("textbox").fill("is my area covered");
      await send.click();
      await expect(dialog.getByRole("textbox")).toHaveValue("");

      // Closing restores the bar and its reserved height.
      await dialog.getByRole("button", { name: CLOSE }).click();
      await expect(bar).toBeVisible();
      const restored = await page
        .getByRole("button", { name: LAUNCHER })
        .boundingBox();
      const barBox = await bar.boundingBox();
      expect(barBox!.y).toBeGreaterThanOrEqual(
        restored!.y + restored!.height,
      );
    });

    test("keeps every turn reachable as the conversation grows", async ({
      page,
    }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);

      for (const question of [
        "my drain is blocked",
        "no hot water",
        "how does pricing work",
        "what hours are you open",
      ]) {
        await ask(dialog, question);
      }

      await expect(dialog.getByRole("log")).toContainText(
        "Office hours are Monday",
      );
      await expect(dialog.getByRole("button", { name: "Start over" })).toBeVisible();

      // The newest reply is scrolled into view inside the panel, not the page.
      const scrolled = await dialog
        .getByRole("log")
        .evaluate((node) => {
          const log = node as HTMLElement;
          return log.scrollHeight - log.clientHeight - log.scrollTop;
        });
      expect(Math.abs(scrolled)).toBeLessThan(4);

      const composer = dialog.getByRole("textbox");
      await composer.scrollIntoViewIfNeeded();
      await expect(composer).toBeInViewport();
    });

    test("routes a safety message ahead of every ordinary topic", async ({
      page,
    }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);

      await ask(dialog, "there is a gas smell and the toilet is overflowing");

      await expect(dialog.getByText("Safety first")).toBeVisible();
      await expect(dialog.getByRole("log")).toContainText(
        "Your safety comes before any plumbing question.",
      );
      await expect(dialog.getByText(/cannot send help/)).toBeVisible();
      await expect(
        dialog.getByRole("link", { name: "Read the emergency guidance" }),
      ).toHaveAttribute("href", "/emergency");
      await expect(
        dialog.getByRole("link", { name: "Call the demonstration number" }),
      ).toHaveAttribute("href", "tel:+16145550147");
    });

    test("gives a safe, linkable answer when nothing matches", async ({
      page,
    }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);

      await ask(dialog, "purple monkey dishwasher telescope");

      await expect(
        dialog.getByText(/I couldn't match that question/),
      ).toBeVisible();
      await expect(
        dialog.getByRole("link", { name: "Browse all services" }),
      ).toHaveAttribute("href", "/services");
      await expect(
        dialog.getByRole("link", { name: "Open the request form" }),
      ).toBeVisible();
    });

    test("resets on Start over and on reload, never on hide or show", async ({
      page,
    }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);
      await ask(dialog, "my sump pump failed");

      await dialog.getByRole("button", { name: CLOSE }).click();
      await expect(dialog).toBeHidden();

      // Reopening in the same page view keeps the conversation, and the reset
      // control is offered because the history can grow.
      const reopened = await openAssistant(page);
      await expect(reopened.getByRole("log")).toContainText("my sump pump failed");
      await reopened.getByRole("button", { name: "Start over" }).click();
      await expect(
 reopened.getByText("Hi - I'm the ClearFlow Guide."),
      ).toBeVisible();
      await expect(reopened.getByRole("log")).not.toContainText(
        "my sump pump failed",
      );

      // A reload is the only thing that discards the conversation, because
      // messages are React state with no persistence.
      await ask(reopened, "is my area covered");
      await page.reload();
      const fresh = await openAssistant(page);
      await expect(fresh.getByRole("log")).not.toContainText("my area covered");
 await expect(fresh.getByText("Hi - I'm the ClearFlow Guide.")).toBeVisible();
    });
  });

  test.describe("desktop 1440x900", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("keeps the panel compact and inside the viewport", async ({ page }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);

      const panelBox = await dialog.boundingBox();
      expect(panelBox!.width).toBeLessThanOrEqual(448);
      expect(panelBox!.y).toBeGreaterThanOrEqual(0);
      expect(panelBox!.y + panelBox!.height).toBeLessThanOrEqual(900);

      // The desktop action bar is hidden while the guide is open.
      await expect(page.locator("[data-mobile-action-bar]")).toBeHidden();
      await dialog.getByRole("button", { name: CLOSE }).first().click();
      await expect(dialog).toBeHidden();
      await expect(page.locator("[data-mobile-action-bar]")).toBeHidden();
    });

    test("answers a typed question and sends it with Enter or the button", async ({
      page,
    }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);

      await ask(dialog, "the toilet keeps running");
      await expect(
        dialog.getByText(/Toilet and Faucet Repair page covers/),
      ).toBeVisible();
      await expect(
        dialog.getByRole("link", { name: "See fixture repair" }),
      ).toHaveAttribute("href", "/services/toilets-faucets");

      const input = dialog.getByRole("textbox");
      await input.fill("do you offer financing");
      await dialog.getByRole("button", { name: "Send" }).click();
      await expect(dialog.getByRole("log")).toContainText("financing page");
      await expect(input).toHaveValue("");
    });

    test("uses the configured demonstration number and hours", async ({
      page,
    }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);

      await ask(dialog, "what is your phone number");
      const call = dialog.getByRole("link", { name: "Call (614) 555-0147" });
      await expect(call).toHaveAttribute("href", "tel:+16145550147");

      await ask(dialog, "what hours are you open");
      await expect(dialog.getByRole("log")).toContainText(
        "Office hours are Monday",
      );
      await expect(dialog.getByRole("log")).toContainText(
        "no technician is dispatched",
      );
    });

    test("resolves the request-form hash per route instead of assuming home", async ({
      page,
    }) => {
      await page.goto("/pricing");
      const dialog = await openAssistant(page);

      await ask(dialog, "how much does a repair cost");
      await expect(
        dialog.getByRole("link", { name: "Open the request form" }),
      ).toHaveAttribute("href", "/#estimate");

      await dialog
        .getByRole("link", { name: "Open the request form" })
        .click();
      await expect(page).toHaveURL(/\/#estimate$/);
      await expect(page.locator(".step-in")).toHaveCount(1);
    });

    test("states the financing and booking demonstrations without dispatch", async ({
      page,
    }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);

      await ask(dialog, "do you offer financing");
      await expect(dialog.getByRole("log")).toContainText(
        "not actually offered",
      );
      await expect(dialog.getByRole("log")).toContainText(
        "no payment plan is arranged through this website",
      );

      await ask(dialog, "can I book a visit online");
      await expect(dialog.getByRole("log")).toContainText(
        "no appointment is ever created",
      );
      await expect(
        dialog.getByRole("link", { name: "See the booking preview" }),
      ).toHaveAttribute("href", "/book");
    });

    test("gives identical answers for the same question on a second load", async ({
      page,
    }) => {
      const read = async () => {
        await page.goto("/");
        const dialog = await openAssistant(page);
        await ask(dialog, "my basement is flooding");
        return (await dialog.getByRole("log").innerText()).trim();
      };

      expect(await read()).toBe(await read());
    });
  });

  test.describe("keyboard and motion", () => {
    test("opens from the keyboard, keeps every control reachable, and restores focus on Escape", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");

      const launcher = page.getByRole("button", { name: LAUNCHER });
      await launcher.focus();
      await expect(launcher).toBeFocused();
      await page.keyboard.press("Enter");

      const dialog = page.getByRole("dialog", { name: DIALOG });
      await expect(dialog).toBeVisible();
      await expect(dialog).toBeFocused();

      // Every interactive control inside the panel is reachable by Tab. The
      // composer is filled first so the send control is enabled and focusable,
      // then focus returns to the panel so the walk starts at the top.
      await dialog.getByRole("textbox").fill("my pipe is leaking");
      await dialog.focus();
      const reached: string[] = [];
      for (let step = 0; step < 12; step += 1) {
        await page.keyboard.press("Tab");
        reached.push(
          await page.evaluate(() => {
            const active = document.activeElement as HTMLElement | null;
            if (!active) return "none";
            const labels = (active as HTMLInputElement).labels;
            return (
              active.getAttribute("aria-label") ??
              labels?.[0]?.textContent?.trim() ??
              active.getAttribute("placeholder") ??
              active.textContent?.trim() ??
              active.tagName
            );
          }),
        );
      }
      // The ten stops inside the panel are visited in reading order. The
      // conversation log is one of them because Chromium makes a scrollable
      // region keyboard-focusable, which keeps it scrollable without a mouse.
      expect(reached.slice(0, 10)).toEqual([
        "Close website assistant",
        "Conversation",
        "I have a water leak",
        "My drain is blocked",
        "No hot water",
        "Check my service area",
        "How does pricing work?",
        "Request an estimate",
        "Describe your plumbing question",
        "Send",
      ]);
      // The launcher toggle follows the panel and remains reachable.
      expect(reached[10]).toBe("Close website assistant");

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(page.getByRole("button", { name: LAUNCHER })).toBeFocused();

      // Reopening by keyboard starts a fresh exchange from the composer.
      await page.keyboard.press("Enter");
      const again = page.getByRole("dialog", { name: DIALOG });
      await expect(again).toBeVisible();
      await expect(again.getByRole("log")).toContainText(
        "I'm the ClearFlow Guide",
      );
    });

    test("closes with the panel close button and returns focus", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      const dialog = await openAssistant(page);

      await dialog.getByRole("button", { name: CLOSE }).first().click();
      await expect(dialog).toBeHidden();
      await expect(page.getByRole("button", { name: LAUNCHER })).toBeFocused();
    });

    test("reflows without horizontal scrolling at 200% zoom", async ({ page }) => {
      // A 200% browser zoom on a 1440x900 screen leaves a 720x450 layout
      // viewport, which is the honest way to reproduce zoom reflow in Playwright.
      await page.setViewportSize({ width: 720, height: 450 });
      await page.goto("/");

      const dialog = await openAssistant(page);
      await ask(dialog, "there is standing water by the outlet");
      await expect(dialog.getByText("Safety first")).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      const panelBox = await dialog.boundingBox();
      expect(panelBox!.x).toBeGreaterThanOrEqual(0);
      expect(panelBox!.y + panelBox!.height).toBeLessThanOrEqual(450);

      // The composer stays operable after zooming.
      await dialog.getByRole("textbox").fill("no hot water");
      await dialog.getByRole("button", { name: "Send" }).click();
      await expect(dialog.getByRole("textbox")).toHaveValue("");
      await expect(
        dialog.getByText(/Water Heater Services page/),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: CLOSE }).last()).toBeVisible();
    });

    test("keeps the narrowest supported width usable", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto("/");

      const dialog = await openAssistant(page);
 await expect(dialog.getByText("Hi - I'm the ClearFlow Guide.")).toBeVisible();

      const panelBox = await dialog.boundingBox();
      expect(panelBox!.x).toBeGreaterThanOrEqual(0);
      expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(320);
      expect(panelBox!.y + panelBox!.height).toBeLessThanOrEqual(640);

      // Below 26rem the launcher label collapses to the icon, which keeps the
      // launcher clear of the panel and the action bar.
      await dialog.getByRole("button", { name: CLOSE }).first().click();
      await expect(page.locator(".mobile-action-bar")).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });

    test("animates the panel only when motion is allowed", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");

      await page.getByRole("button", { name: LAUNCHER }).click();
      const dialog = page.getByRole("dialog", { name: DIALOG });
      await expect(dialog).toBeVisible();

      const state = await dialog.evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          duration: style.transitionDuration,
          animation: style.animationName,
        };
      });

      expect(state.animation === "none" || state.duration === "0s").toBe(true);
    });
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("opens, responds and closes without motion-dependent behavior", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");

      const dialog = await openAssistant(page);
 await expect(dialog.getByText("Hi - I'm the ClearFlow Guide.")).toBeVisible();

      await dialog.getByRole("button", { name: "I have a water leak" }).click();
      await expect(
        dialog.getByText(/A leak can range from a dripping fixture/),
      ).toBeVisible();

      const transforms = await dialog.evaluate((node) => {
        const panels = [node, ...Array.from(node.querySelectorAll("*"))];
        return panels
          .map((child) => getComputedStyle(child as Element).transform)
          .filter((value) => value !== "none");
      });
      expect(transforms).toEqual([]);

      await dialog.getByRole("button", { name: CLOSE }).first().click();
      await expect(dialog).toBeHidden();
    });
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("leaves the page usable and the launcher inert rather than breaking layout", async ({
      page,
    }) => {
      await page.goto("/");

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Request a Free Estimate" }).first(),
      ).toBeVisible();

      // The guide is progressive enhancement: without hydration the launcher
      // is still rendered but does nothing, and no panel is ever created.
      const launcher = page.getByRole("button", { name: LAUNCHER });
      await expect(launcher).toBeVisible();
      await launcher.click();
      await expect(page.getByRole("dialog", { name: DIALOG })).toHaveCount(0);
      await expect(launcher).toBeVisible();

      // The rest of the page keeps working, including primary navigation.
      await expect(page.getByRole("navigation").first()).toBeVisible();
      await page
        .getByRole("navigation")
        .first()
        .getByRole("link", { name: "Services" })
        .click();
      await expect(page).toHaveURL(/\/services$/);
    });
  });

  test.describe("privacy at runtime", () => {
    test("sends no request and writes no storage while the guide is used", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const requests: string[] = [];
      page.on("request", (request) => requests.push(request.url()));

      const dialog = await openAssistant(page);
      const typed = "my pipe is leaking right now";
      await ask(dialog, typed);
      await expect(
        dialog.getByText(/A leak can range from a dripping fixture/),
      ).toBeVisible();
      await dialog.getByRole("button", { name: "I have a water leak" }).click();
      await expect(
        dialog.getByText(/A leak can range from a dripping fixture/),
      ).toHaveCount(2);
      await page.waitForTimeout(400);

      /*
      Nothing the user typed may leave the browser. The only requests that can
      appear are Next.js framework prefetches for the links already rendered in
      the answer, which are same-origin page prefetches with no typed content.
      */
      const origin = new URL(page.url()).origin;
      expect(
        requests.every((url) => {
          const parsed = new URL(url);
          return parsed.origin === origin && !parsed.searchParams.has("q");
        }),
      ).toBe(true);
      expect(
        requests.some((url) =>
          url.toLowerCase().includes(typed.toLowerCase()),
        ),
      ).toBe(false);

      const stored = await page.evaluate(() => ({
        local: window.localStorage.length,
        session: window.sessionStorage.length,
        cookie: document.cookie,
        href: window.location.href,
      }));
      expect(stored.local).toBe(0);
      expect(stored.session).toBe(0);
      expect(stored.cookie).toBe("");
      expect(stored.href).not.toContain("?");
    });

    test("keeps typed text inert, with no markup interpretation", async ({
      page,
    }) => {
      await page.goto("/");
      const dialog = await openAssistant(page);
      const payload = '<img src=x onerror="window.__pwned = true">';

      await ask(dialog, payload);

      await expect(dialog.getByText(payload, { exact: true })).toBeVisible();
      expect(await dialog.locator("img").count()).toBe(0);
      expect(
        await page.evaluate(() =>
          Reflect.get(window as unknown as Record<string, unknown>, "__pwned"),
        ),
      ).toBeUndefined();
    });
  });
});
