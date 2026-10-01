import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { business } from "@/config/business";
import { reviews } from "@/config/reviews";
import { trust } from "@/config/trust";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { TrustSignals } from "@/components/sections/TrustSignals";

/*
Trust and reputation presentation.

These tests exist because the honest failure mode here is not an obvious bug.
It is copy that quietly reintroduces third-party verification, or a claim that
cannot be true for a fictional business, while everything still renders.

Each test below fails on the specific regression it is guarding against.
*/
describe("trust signals", () => {
  it("presents the six standard trust positions", () => {
    expect(trust.signals.map((signal) => signal.title)).toEqual([
      "Licensed & Insured",
      "Background-Checked Technicians",
      "Upfront Pricing",
      "Satisfaction Guarantee",
      business.hours.emergencyLabel,
      "Financing Available",
    ]);
    for (const signal of trust.signals) {
      expect(signal.description.length).toBeGreaterThan(20);
      expect(signal.id.length).toBeGreaterThan(0);
    }
  });

  it("uses unique ids and original icon names for every signal", () => {
    const ids = trust.signals.map((signal) => signal.id);
    expect(new Set(ids).size).toBe(ids.length);
    const allowed = new Set([
      "shield",
      "badge",
      "receipt",
      "handshake",
      "card",
      "clock",
    ]);
    for (const signal of trust.signals) {
      expect(allowed.has(signal.icon)).toBe(true);
    }
  });

  it("invents no license, registration or insurance identifier", () => {
    const copy = trust.signals
      .map((signal) => `${signal.title} ${signal.description}`)
      .join(" ")
      .toLowerCase();
    for (const forbidden of [
      "license #",
      "license no",
      "licence #",
      "registration no",
      "policy no",
      "policy number",
      "certificate #",
      "npi",
      "bond #",
      "ohio plumbing license",
    ]) {
      expect(copy).not.toContain(forbidden);
    }
    expect(copy).not.toMatch(/\b[A-Z]{1,3}-?\d{4,}\b/);
  });

  it("implies no endorsement by a platform, association or authority", () => {
    const copy = [
      trust.heading,
      trust.supportingText,
      ...trust.signals.flatMap((signal) => [signal.title, signal.description]),
    ]
      .join(" ")
      .toLowerCase();
    for (const forbidden of [
      "bbb",
      "better business bureau",
      "google",
      "yelp",
      "trustpilot",
      "facebook",
      "angi",
      "houzz",
      "accredited",
      "endorsed by",
      "certified by",
      "award winning",
      "association member",
    ]) {
      expect(copy).not.toContain(forbidden);
    }
  });
});

describe("reviews and reputation", () => {
  it("presents an overall rating, a review count and three to six cards", () => {
    expect(reviews.rating).toMatch(/^\d(\.\d)?$/);
    expect(reviews.reviewCount).toMatch(/reviews?$/);
    expect(reviews.reviews.length).toBeGreaterThanOrEqual(3);
    expect(reviews.reviews.length).toBeLessThanOrEqual(6);
  });

  it("gives every card a name, location, service, date and whole-star rating", () => {
    for (const review of reviews.reviews) {
      expect(review.name.length).toBeGreaterThan(0);
      expect(review.location.length).toBeGreaterThan(0);
      expect(review.service.length).toBeGreaterThan(0);
      expect(review.quote.length).toBeGreaterThan(40);
      expect(review.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isInteger(review.rating)).toBe(true);
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
    }
    const names = reviews.reviews.map((review) => review.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("never names a review platform or claims external verification", () => {
    const copy = [
      reviews.heading,
      reviews.supportingText,
      reviews.ratingLabel,
      reviews.reviewCount,
      ...reviews.highlights,
      ...reviews.reviews.flatMap((review) => [
        review.name,
        review.location,
        review.service,
        review.quote,
      ]),
    ]
      .join(" ")
      .toLowerCase();
    for (const forbidden of [
      "google",
      "yelp",
      "trustpilot",
      "facebook",
      "verified review",
      "verified customer",
      "platform verified",
      "collected from",
      "syndicated",
      "bbb",
    ]) {
      expect(copy).not.toContain(forbidden);
    }
  });

  it("keeps one section-level clarification instead of per-card labels", () => {
    expect(reviews.note.length).toBeGreaterThan(0);
    expect(reviews.note.toLowerCase()).toMatch(/invented|portfolio/);
    const hasPresentationNote = "presentationNote" in reviews;
    expect(hasPresentationNote).toBe(false);
    for (const review of reviews.reviews) {
      const cardCopy = `${review.name} ${review.location} ${review.service} ${review.quote}`;
      expect(cardCopy.toLowerCase()).not.toMatch(
        /sample|demo|fictional|concept|placeholder|example review/,
      );
    }
  });

  it("uses the non-credential customer-experience concepts", () => {
    expect(reviews.highlights).toEqual([
      "Clear communication",
      "Easy online requests",
      "Upfront estimate process",
      "Columbus-area service",
      "Mobile-friendly booking",
    ]);
  });
});

describe("trust and review rendering", () => {
  it("renders the trust heading, every signal and no third-party branding", () => {
    render(<TrustSignals />);

    expect(
      screen.getByRole("heading", { name: trust.heading }),
    ).toBeInTheDocument();
    for (const signal of trust.signals) {
      expect(
        screen.getByRole("heading", { level: 3, name: signal.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(signal.description)).toBeInTheDocument();
    }

    const rendered = document.body.textContent?.toLowerCase() ?? "";
    for (const forbidden of ["bbb", "google", "yelp", "verified by", "accredited"]) {
      expect(rendered).not.toContain(forbidden);
    }
  });

  it("renders ratings as labelled star groups rather than bare icons", () => {
    render(<ReviewsSection />);

    expect(
      screen.getByRole("img", {
        name: `${reviews.rating} average rating out of 5 stars`,
      }),
    ).toBeInTheDocument();
    const cardStars = screen.getAllByRole("img", {
      name: /^[45] out of 5 stars$/,
    });
    expect(cardStars).toHaveLength(reviews.reviews.length);
    for (const review of reviews.reviews) {
      expect(
        screen.getAllByRole("img", {
          name: `${review.rating} out of 5 stars`,
        }).length,
      ).toBeGreaterThan(0);
    }
  });

  it("renders review metadata with real machine-readable dates", () => {
    render(<ReviewsSection />);

    for (const review of reviews.reviews) {
      expect(
        screen.getByText(`${review.service} · ${review.location}`),
      ).toBeInTheDocument();
      const time = document.querySelector(
        `time[datetime="${review.date}"]`,
      );
      expect(time).not.toBeNull();
      expect(time?.textContent?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it("shows the overall rating and count once, with a single section note", () => {
    render(<ReviewsSection />);

    expect(screen.getByText(reviews.rating)).toBeInTheDocument();
    expect(screen.getByText(reviews.reviewCount)).toBeInTheDocument();
    expect(screen.getByText(reviews.note)).toBeInTheDocument();
    expect(
      screen.getAllByText(/invented to demonstrate the review experience/i),
    ).toHaveLength(1);
  });

  it("gives every review card an original star row without platform icons", () => {
    render(<ReviewsSection />);

    const starRows = screen.getAllByRole("img", { name: /out of 5 stars/ });
    expect(starRows).toHaveLength(reviews.reviews.length + 1);

    const anchors = Array.from(document.querySelectorAll("a"));
    for (const anchor of anchors) {
      const href = anchor.getAttribute("href") ?? "";
      expect(href).not.toMatch(/google|yelp|trustpilot|facebook|business\.bbb/i);
    }

    const authorNames = reviews.reviews.map((review) => review.name);
    for (const name of authorNames) {
      const element = screen.getByText(name);
      expect(element.querySelector("svg")).toBeNull();
      expect(element.className).toContain("font-semibold");
    }
  });
});