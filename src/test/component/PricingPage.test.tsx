import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PricingPage from "@/app/pricing/page";
import { pricing } from "@/config/pricing";
import { seo } from "@/config/seo";

/*
The financing CTA is the one flag-dependent part of the page, so the flag is
stubbed here to check both states through the same public behaviour.
*/
const flags = vi.hoisted(() => ({ financing: true }));

vi.mock("@/config/features", () => ({ features: flags }));

beforeEach(() => {
  flags.financing = true;
});

describe("pricing page", () => {
  it("presents the hero, disclosure and the five process steps", () => {
    render(<PricingPage />);

    expect(screen.getByText(pricing.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: pricing.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(pricing.disclosure)).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "How Pricing Works" }),
    ).toBeInTheDocument();
    for (const step of pricing.process.steps) {
      expect(
        screen.getByRole("heading", { level: 3, name: step.title }),
      ).toBeInTheDocument();
    }
    expect(pricing.process.steps).toHaveLength(5);
  });

  it("keeps the process steps in a single logical reading order", () => {
    const { container } = render(<PricingPage />);
    const titles = Array.from(
      container.querySelectorAll("ol li h3"),
    ).map((node) => node.textContent);

    expect(titles).toEqual(pricing.process.steps.map((step) => step.title));
  });

  it("lists the cost factors and the questions to ask before approving work", () => {
    render(<PricingPage />);

    expect(
      screen.getByRole("heading", { level: 2, name: "What Can Affect the Cost?" }),
    ).toBeInTheDocument();
    for (const factor of pricing.costFactors) {
      expect(
        screen.getByRole("heading", { level: 3, name: factor.title }),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Questions to Ask Before Approving Work",
      }),
    ).toBeInTheDocument();
    for (const question of pricing.questions) {
      expect(screen.getByText(question)).toBeInTheDocument();
    }
    expect(pricing.questions.length).toBeGreaterThanOrEqual(8);
    expect(screen.getByText(pricing.questionsNote)).toBeInTheDocument();
  });

  it("uses a single H1 and keeps the tax wording of the US market profile", () => {
    const { container } = render(<PricingPage />);

    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(pricing.questions).toContain("Does applicable tax apply?");
    expect(
      pricing.questions.some((question) => /vat/i.test(question)),
    ).toBe(false);
  });

  it("sends the primary CTA to the canonical request destination", () => {
    render(<PricingPage />);

    const cta = screen.getByRole("link", { name: "Request a Service" });
    expect(cta).toHaveAttribute("href", "/#estimate");
  });

  it("shows the financing CTA only while the financing feature is enabled", () => {
    const { unmount } = render(<PricingPage />);
    expect(
      screen.getByRole("link", { name: "Explore Financing Options" }),
    ).toHaveAttribute("href", "/financing");
    unmount();

    flags.financing = false;
    render(<PricingPage />);
    expect(
      screen.queryByRole("link", { name: "Explore Financing Options" }),
    ).not.toBeInTheDocument();
    // the page still works without the flag
    expect(screen.getByRole("link", { name: "Request a Service" })).toBeInTheDocument();
  });

  it("never states a price, rate, fee amount or saving", () => {
    const { container } = render(<PricingPage />);
    const text = container.textContent ?? "";

    const pricingPatterns = [
      /[$£€]\s?\d/, // currency symbol followed by an amount
      /\d[\d.,]*\s?(USD|GBP|EUR)\b/i, // amount followed by a currency code
      /starting\s+(at|from)\s+[$£€]?\d/i,
      /from\s+[$£€]\s?\d/i,
      /\d+\s*(per|\/)\s*(hour|hr)\b/i, // hourly rate claim
      /\d+\s*(call[\s-]?out|diagnostic|dispatch)\s*(fee|charge)s?\b/i,
      /\d+\s*(%|\spercent\b)/i, // discount or percentage saving
      /\b(free|guaranteed|guarantee[sd]?)\s+(visit|quote|estimate|price|discount)\b/i,
    ];

    for (const pattern of pricingPatterns) {
      expect(text).not.toMatch(pattern);
    }
  });

  it("publishes the pricing route metadata with noindex behaviour", () => {
    const route = seo.routes.pricing;

    expect(route.path).toBe("/pricing");
    expect(route.title).toBe("How Pricing Works");
    expect(route.description).toBe(
      "How a professional plumbing estimate process is explained clearly before any work begins.",
    );
  });
});
