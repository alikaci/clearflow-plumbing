import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const targets = [
  { path: "/", name: "home" },
  { path: "/services", name: "services hub" },
  { path: "/services/water-heaters", name: "service detail" },
  { path: "/contact", name: "contact" },
  { path: "/book", name: "booking preview" },
  { path: "/service-areas", name: "service areas" },
  { path: "/pricing", name: "pricing process" },
];

for (const target of targets) {
  test(`${target.name} has no serious accessibility violations`, async ({
    page,
  }) => {
    await page.goto(target.path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const serious = results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    );

    expect(
      serious.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.length,
        targets: violation.nodes.map((node) => node.target.join(" ")),
        summary: violation.help,
      })),
    ).toEqual([]);
  });
}

test("exposes a keyboard skip link as the first focusable control", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /skip/i })).toBeFocused();
});
