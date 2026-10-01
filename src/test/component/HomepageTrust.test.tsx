import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { business } from "@/config/business";
import { reviews } from "@/config/reviews";
import { trust } from "@/config/trust";

/*
The homepage is the highest-conversion surface, so it is also the surface where
an unsupported claim is most costly. These tests read the rendered homepage
rather than the config alone, because the failure mode is a claim that survives
in one component and not the other.
*/
const unsupportedClaims = [
  // Third-party verification or endorsement
  "google",
  "yelp",
  "trustpilot",
  "facebook",
  "bbb",
  "better business bureau",
  "angi",
  "houzz",
  "verified review",
  "accredited",
  "certified by",
  // Invented identifiers
  "license #",
  "licence #",
  "license no",
  "registration no",
  "policy number",
  "ohio plumbing license",
  // Claims about transactions that did not occur
  "request sent",
  "request submitted",
  "message sent",
  "technician dispatched",
  "technician on the way",
  "appointment booked",
  "we received your request",
  "we will call you back",
  "call you shortly",
  "within the hour",
  "same-day repair",
];

describe("homepage premium trust and reputation", () => {
  it("renders the trust signal section in the main conversion area", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: trust.heading }),
    ).toBeInTheDocument();
    for (const signal of trust.signals) {
      expect(
        screen.getByRole("heading", { level: 3, name: signal.title }),
      ).toBeInTheDocument();
    }
  });

  it("renders realistic review cards with service and location metadata", () => {
    render(<HomePage />);

    expect(screen.getByText(reviews.reviewCount)).toBeInTheDocument();
    for (const review of reviews.reviews) {
      expect(
        screen.getByText(`${review.service} · ${review.location}`),
      ).toBeInTheDocument();
    }
  });

  it("keeps an emergency path reachable from the homepage", () => {
    render(<HomePage />);

    const callLinks = screen.getAllByRole("link", {
      name: `Call ${business.phoneDisplay}`,
    });
    expect(callLinks.length).toBeGreaterThan(0);
    for (const link of callLinks) {
      expect(link).toHaveAttribute("href", business.phoneUri);
    }
  });

  it("makes no unsupported claim anywhere in the homepage", () => {
    const { container } = render(<HomePage />);
    const text = (container.textContent ?? "").toLowerCase();

    for (const claim of unsupportedClaims) {
      expect(text, `homepage should not claim "${claim}"`).not.toContain(claim);
    }
  });

  it("uses no third-party branding or external link in the reputation area", () => {
    const { container } = render(<HomePage />);

    const anchors = Array.from(container.querySelectorAll("a"));
    for (const anchor of anchors) {
      const href = anchor.getAttribute("href") ?? "";
      expect(href).not.toMatch(
        /google|yelp|trustpilot|facebook|business\.bbb|reviews\./i,
      );
    }
    const images = Array.from(container.querySelectorAll("img"));
    for (const image of images) {
      const src = image.getAttribute("src") ?? "";
      const alt = image.getAttribute("alt") ?? "";
      expect(`${src} ${alt}`).not.toMatch(
        /google|yelp|trustpilot|bbb|better-business|verified-badge/i,
      );
    }
  });

  it("avoids concept labelling inside the trust and reputation sections", () => {
    render(<HomePage />);

    for (const heading of [trust.heading, reviews.heading]) {
      const section = screen.getByRole("heading", { name: heading }).closest(
        "section",
      );
      expect(section).not.toBeNull();
      const clone = section?.cloneNode(true) as HTMLElement | undefined;
      // The one permitted section-level clarification is excluded from the
      // check, since it is where the invented-content context belongs.
      for (const paragraph of Array.from(
        clone?.querySelectorAll("p") ?? [],
      )) {
        if (paragraph.textContent?.includes(reviews.note)) {
          paragraph.remove();
        }
      }
      const text = (clone?.textContent ?? "").toLowerCase();
      expect(text, `${heading} should read as production copy`).not.toMatch(
        /sample|demo|placeholder|fictional|concept/,
      );
    }
  });

  it("carries exactly one clarifying note across the review cards", () => {
    render(<HomePage />);

    const section = screen
      .getByRole("heading", { name: reviews.heading })
      .closest("section");
    const text = (section?.textContent ?? "").toLowerCase();
    const notes = text.match(/invented/g) ?? [];
    expect(notes).toHaveLength(1);
  });

  it("retains one global portfolio disclosure in the shell", () => {
    const { container } = render(<HomePage />);

    const disclosure = business.disclosures.fictional;
    expect(disclosure.length).toBeGreaterThan(50);
    expect(disclosure.toLowerCase()).toContain("fictional");
    expect(disclosure.toLowerCase()).toContain("no real plumbing service");
  });
});