import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { business } from "@/config/business";

/**
 * The utility bar has three responsive tiers. Tailwind's `sm` (640px) and `lg`
 * (1024px) prefixes decide which claims are in the markup at each width, so these
 * tests assert the tier boundaries themselves and the single-line guarantees
 * that keep the phone from dropping to a second row.
 */

const bar = () =>
  screen.getByText(business.hours.emergencyLabel).closest("div.bg-navy")!;

describe("UtilityBar", () => {
  it("offers emergency availability and the phone below 640px", () => {
    render(<UtilityBar />);

    expect(screen.getByText(business.hours.emergencyLabel)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: `Call ${business.phoneDisplay}` }),
    ).toBeInTheDocument();
  });

  it("hides the service area below 640px", () => {
    render(<UtilityBar />);

    expect(
      screen.getByText(`Serving ${business.serviceArea}`),
    ).toHaveClass("hidden");
    expect(screen.getByText(`Serving ${business.serviceArea}`)).toHaveClass(
      "sm:inline",
    );
  });

  it("hides office hours below the desktop tier", () => {
    render(<UtilityBar />);

    const office = screen.getByText(`Office: ${business.hours.short}`);
    expect(office).toHaveClass("hidden");
    expect(office).toHaveClass("lg:inline");
  });

  it("reveals office hours only from 1024px", () => {
    render(<UtilityBar />);

    const office = screen.getByText(`Office: ${business.hours.short}`);
    expect(office.className).not.toContain("sm:inline");
    expect(office.className).not.toContain("md:inline");
  });

  it("keeps the service area in the tablet tier between 640px and 1024px", () => {
    render(<UtilityBar />);

    // Visible from sm, and not deferred again until lg.
    const serving = screen.getByText(`Serving ${business.serviceArea}`);
    expect(serving.className).toContain("sm:inline");
    expect(serving.className).not.toContain("lg:inline");
  });

  it("never lets the bar wrap, so the phone cannot take a second row", () => {
    render(<UtilityBar />);

    expect(bar().querySelector("div")).toHaveClass("flex-nowrap");
  });

  it("marks every item as shrinkable so a narrow window cannot overflow the row", () => {
    render(<UtilityBar />);

    const items = [
      screen.getByText(`Serving ${business.serviceArea}`),
      screen.getByText(`Office: ${business.hours.short}`),
      screen.getByText(business.hours.emergencyLabel),
      screen.getByRole("link", { name: `Call ${business.phoneDisplay}` }),
    ];

    for (const item of items) {
      // min-w-0 lets the item shrink below its content size so the text wraps
      // inside it. Without this the flex min-width:auto floor keeps the item at
      // full content width and the row overflows at roughly 195px.
      expect(item.className).toContain("min-w-0");
    }
  });

  it("does not pin item text to one line, so it can wrap instead of overflowing", () => {
    render(<UtilityBar />);

    const items = [
      screen.getByText(`Serving ${business.serviceArea}`),
      screen.getByText(`Office: ${business.hours.short}`),
      screen.getByText(business.hours.emergencyLabel),
      screen.getByRole("link", { name: `Call ${business.phoneDisplay}` }),
    ];

    for (const item of items) {
      // whitespace-nowrap plus flex-nowrap is what caused horizontal overflow at
      // 200% zoom. The one-row guarantee comes from flex-nowrap alone.
      expect(item.className).not.toContain("whitespace-nowrap");
    }
  });

  it("keeps the emergency label and the phone as separate actions", () => {
    render(<UtilityBar />);

    const emergency = screen.getByRole("link", {
      name: business.hours.emergencyLabel,
    });
    const phone = screen.getByRole("link", {
      name: `Call ${business.phoneDisplay}`,
    });

    expect(emergency).toHaveAttribute("href", "/emergency");
    expect(phone).toHaveAttribute("href", business.phoneUri);
  });

  it("keeps both actions reachable by keyboard with a visible target", () => {
    render(<UtilityBar />);

    expect(
      screen.getByRole("link", { name: business.hours.emergencyLabel }),
    ).toHaveClass("min-h-6");
    expect(
      screen.getByRole("link", { name: `Call ${business.phoneDisplay}` }),
    ).toHaveClass("min-h-6");
  });

  it("gives the emergency line a restrained alert icon that stays out of the name", () => {
    render(<UtilityBar />);

    const emergency = screen.getByRole("link", {
      name: business.hours.emergencyLabel,
    });
    const icon = emergency.querySelector("svg");

    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass("text-orange");
    // The icon is decorative, so the accessible name is the label alone.
    expect(emergency.textContent).toBe(business.hours.emergencyLabel);
  });

  it("makes the phone number the single filled accent in the row", () => {
    render(<UtilityBar />);

    const phone = screen.getByRole("link", {
      name: `Call ${business.phoneDisplay}`,
    });

    expect(phone).toHaveClass("bg-orange");
    expect(phone).toHaveClass("text-navy");
    expect(phone).toHaveClass("font-semibold");
    // It is the only filled element: the rest of the row is plain text on navy.
    expect(screen.getByRole("link", { name: business.hours.emergencyLabel }).className)
      .not.toContain("bg-orange");
    expect(phone.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(phone.querySelector("svg")).toHaveClass("h-3.5");
  });

  it("shows the number on the bar while keeping the full call phrase as the name", () => {
    render(<UtilityBar />);

    const phone = screen.getByRole("link", {
      name: `Call ${business.phoneDisplay}`,
    });

    // The visible text buys width at 360px; the accessible name still reads
    // as an action and contains the visible text (WCAG 2.5.3).
    expect(phone).toHaveTextContent(business.phoneDisplay);
    expect(phone.textContent).not.toContain("Call");
    expect(phone.getAttribute("aria-label")).toBe(
      `Call ${business.phoneDisplay}`,
    );
  });

  it("keeps the strip inside the 40-44px band through py-2 around a min-h-6 row", () => {
    render(<UtilityBar />);

    const row = bar().querySelector("div");
    expect(row).toHaveClass("py-2");
    expect(row).toHaveClass("gap-x-4");
    // 8px + 24px + 8px = 40px, before any content wrapping.
    for (const item of [
      screen.getByText(business.hours.emergencyLabel),
      screen.getByRole("link", { name: `Call ${business.phoneDisplay}` }),
    ]) {
      expect(item).toHaveClass("min-h-6");
    }
  });

  it("does not drop the hours claim from desktop, only relocates it", () => {
    render(<UtilityBar />);

    expect(screen.getByText(`Office: ${business.hours.short}`)).toBeVisible();
  });

  it("carries no claims that are absent from the business configuration", () => {
    render(<UtilityBar />);

    const text = bar().textContent ?? "";
    expect(text).not.toMatch(/\d\s*(?:years|reviews|rating)/i);
    expect(text).not.toMatch(/licen[cs]e/i);
  });
});