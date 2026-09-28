import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EmergencyPage from "@/app/emergency/page";
import { home } from "@/config/home";

const requiredSentence =
  "If there is an immediate threat involving safety, fire, gas, electricity or severe flooding, contact the appropriate emergency service or utility provider.";

const forbiddenPhrases = [
  "on the way",
  "wait for our technician",
  "wait for a technician",
  "our technician will",
  "before we arrive",
  "your appointment",
  "your scheduled visit",
  "guaranteed safe",
  "same-day",
  "same day service",
  "fix it yourself",
];

/*
These words legitimately appear inside the page's existing negations, such as
"No 24/7 availability ... is promised by this demonstration", so each mention
has to be checked for a negation in the same sentence rather than banned
outright.
*/
const phrasesThatMustBeNegated = [
  "24/7",
  "guaranteed response",
  "technician dispatch",
];

const negations = ["no ", "not ", "never", "cannot", "isn't", "without"];

function sentencesContaining(text: string, phrase: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.toLowerCase())
    .filter((sentence) => sentence.includes(phrase.toLowerCase()));
}

function expectEveryMentionNegated(text: string, phrase: string) {
  const mentions = sentencesContaining(text, phrase);
  for (const sentence of mentions) {
    expect(
      negations.some((negation) => sentence.includes(negation)),
      `"${phrase}" should only appear in a negated sentence, found: "${sentence.trim()}"`,
    ).toBe(true);
  }
}

describe("emergency page safety guidance", () => {
  it("states the required immediate-threat sentence", () => {
    render(<EmergencyPage />);
    expect(screen.getByText(requiredSentence)).toBeInTheDocument();
  });

  it("shows the required sentence without interaction, outside any accordion", () => {
    const { container } = render(<EmergencyPage />);

    const sentence = screen.getByText(requiredSentence);
    expect(sentence).toBeVisible();
    expect(sentence.closest("details")).toBeNull();
    expect(sentence.closest("summary")).toBeNull();
    expect(container.querySelector("details")).toBeNull();
  });

  it("presents the required sentence inside a highlighted callout", () => {
    const { container } = render(<EmergencyPage />);

    const callout = screen.getByText(requiredSentence).closest("div");
    expect(callout).not.toBeNull();

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "When an Immediate Threat Should Come First",
    });
    expect(heading).toBeInTheDocument();
    expect(callout?.contains(heading)).toBe(true);
    expect(callout?.className).toMatch(/border-orange/);
    expect(container).toBeTruthy();
  });

  it("keeps the callout near the top of the page content, not in the footer", () => {
    const { container } = render(<EmergencyPage />);

    const main = container.querySelector("main");
    const calloutSection = screen
      .getByRole("heading", {
        level: 2,
        name: "When an Immediate Threat Should Come First",
      })
      .closest("section");

    expect(main?.contains(calloutSection)).toBe(true);
    expect(container.querySelector("footer")).toBeNull();
  });

  it("adds complementary guidance as a semantic list", () => {
    render(<EmergencyPage />);

    expect(
      screen.getByText(
        "Stay clear of standing water that is near electrical outlets, cords or appliances.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Keep children and pets away from wet, contaminated or restricted areas.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Avoid using fixtures when continued use may worsen an overflow.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Do not attempt gas or electrical repairs, and do not open an equipment panel.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "When you make contact, describe what you observed, when it started and whether it is getting worse.",
      ),
    ).toBeInTheDocument();
  });

  it("preserves the existing emergency disclosure and request copy", () => {
    render(<EmergencyPage />);

    expect(screen.getByText(home.emergency.safetyNote)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Request Urgent Plumbing Help" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "When to Request Urgent Help" }),
    ).toBeInTheDocument();
  });

  it("makes no emergency-response, dispatch or scheduling claim", () => {
    const { container } = render(<EmergencyPage />);
    const text = (container.textContent ?? "").toLowerCase();

    for (const phrase of forbiddenPhrases) {
      expect(text, `page should not claim "${phrase}"`).not.toContain(phrase);
    }

    for (const phrase of phrasesThatMustBeNegated) {
      expectEveryMentionNegated(text, phrase);
    }
  });

  it("does not present a universal emergency number", () => {
    const { container } = render(<EmergencyPage />);
    const text = (container.textContent ?? "").replace(/\s+/g, " ");

    expect(text).not.toMatch(/911/);
    expect(container.querySelector('a[href^="tel:911"]')).toBeNull();
  });

  it("does not offer a response-time promise or countdown", () => {
    const { container } = render(<EmergencyPage />);
    const text = (container.textContent ?? "").toLowerCase();

    expect(text).not.toMatch(/within \d+ minutes?/);
    expect(text).not.toMatch(/response time/);
    expect(container.querySelector("time")).toBeNull();
  });
});
