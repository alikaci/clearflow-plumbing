import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EmergencyPage from "@/app/emergency/page";
import { business } from "@/config/business";

const requiredSentence =
  "If there is an immediate threat involving fire, gas, electricity or severe flooding, contact the appropriate emergency service or utility provider first.";

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
The emergency page is allowed to read as a real premium page: the portfolio
disclosure in the footer carries the concept context, and emergency-call
availability is rendered from config rather than hard-coded. Phrases that would
still be false claims, such as a response guarantee or a dispatch promise, must
stay inside a negation.
*/
const phrasesThatMustBeNegated = [
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
      name: "Safety Comes Before Plumbing",
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
        name: "Safety Comes Before Plumbing",
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
        "If the building is unsafe to stay in, move to safety before calling anyone.",
      ),
    ).toBeInTheDocument();
  });

  it("presents the emergency path in the required priority order", () => {
    render(<EmergencyPage />);

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent ?? "");
    const order = [
      "Safety Comes Before Plumbing",
      "Request Emergency Service",
      "When to Request Urgent Help",
      "What Happens After You Contact Us",
    ];
    const positions = order.map((title) => headings.indexOf(title));
    for (const position of positions) {
      expect(position).toBeGreaterThanOrEqual(0);
    }
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("offers direct phone contact and an emergency request path", () => {
    render(<EmergencyPage />);

    expect(
      screen.getByRole("link", { name: `Call ${business.phoneDisplay}` }),
    ).toHaveAttribute("href", business.phoneUri);
    expect(
      screen.getByRole("link", { name: "Send an Emergency Request" }),
    ).toHaveAttribute("href", "/#estimate");
  });

  it("keeps the emergency page free of demo framing", () => {
    render(<EmergencyPage />);

    expect(
      screen.getByRole("heading", { name: "Emergency Help, Day or Night" }),
    ).toBeInTheDocument();
    const text = (document.body.textContent ?? "").toLowerCase();
    expect(text).not.toMatch(/sample|demo|placeholder|fictional|concept/);
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
