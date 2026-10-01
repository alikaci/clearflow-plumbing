import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import EmergencyPage from "@/app/emergency/page";
import PricingPage from "@/app/pricing/page";
import FinancingPage from "@/app/financing/page";
import GalleryPage from "@/app/gallery/page";
import ServiceAreasPage from "@/app/service-areas/page";
import ContactPage from "@/app/contact/page";
import AboutPage from "@/app/about/page";
import { serviceSlugs } from "@/config/services";
import { assistant } from "@/config/assistant";
import { forms } from "@/config/forms";

/*
Claims audit.

This file is the mechanical half of the copy review. It renders every
customer-facing route, then classifies each occurrence of a sensitive term by
context instead of banning the term outright.

Three verdicts are used:

- allowed: the term appears as ordinary marketing or service copy inside the
  globally disclosed fictional portfolio experience.
- negated: the term appears in a sentence that explicitly denies it.
- violation: the term asserts something that did not actually happen, or
  borrows credibility from a third party that never reviewed this site.

Only "violation" fails the build. That distinction is the whole point of the
review: "24/7 Emergency Service" is required by the brief, while "a live agent
is handling your chat" would be a lie.
*/
type Verdict = "allowed" | "negated" | "violation";

type Rule = {
  label: string;
  /** Matches the sensitive term itself. */
  pattern: RegExp;
  /**
   * Decides the verdict for each sentence that matched. Returning "allowed"
   * for a term the brief explicitly permits keeps the rule documented rather
   * than implicit.
   */
  classify: (sentence: string) => Verdict;
};

const negationWords = [
  "no ",
  "not ",
  "never",
  "cannot",
  "can't",
  "isn't",
  "does not",
  "without",
  "nothing",
];

function isNegated(sentence: string): boolean {
  const lower = sentence.toLowerCase();
  return negationWords.some((negation) => lower.includes(negation));
}

/**
 * Allowed when the term is presented as this business's own positioning, or as
 * a subject of a general description. A violation would be the term being
 * asserted about a third party who is not involved.
 */
function ownPositioning(sentence: string): Verdict {
  const lower = sentence.toLowerCase();
  const thirdParty = /google|yelp|trustpilot|facebook|bbb|angi|houzz|real customers|real people/i;
  if (thirdParty.test(lower)) return "violation";
  if (isNegated(lower)) return "negated";
  return "allowed";
}

function mustBeNegated(sentence: string): Verdict {
  return isNegated(sentence) ? "negated" : "violation";
}

const rules: Rule[] = [
  {
    label: "24/7",
    pattern: /24\/7/gi,
    classify: (sentence) => ownPositioning(sentence),
  },
  {
    label: "Licensed & Insured",
    pattern: /\blicen[cs]ed\b/gi,
    classify: (sentence) => {
      const lower = sentence.toLowerCase();
      if (/license\s*(?:#|no\.?|number)/i.test(lower)) return "violation";
      if (/\b(bbb|state of ohio|epa|fda)\b/i.test(lower)) return "violation";
      return ownPositioning(lower);
    },
  },
  {
    label: "Insured",
    pattern: /\binsured\b/gi,
    classify: (sentence) => {
      const lower = sentence.toLowerCase();
      if (/policy\s*(?:#|no\.?|number)/i.test(lower)) return "violation";
      return ownPositioning(lower);
    },
  },
  {
    label: "Guarantee / Satisfaction Guarantee",
    pattern: /\bguarantee\w*/gi,
    classify: (sentence) => {
      const lower = sentence.toLowerCase();
      if (/guaranteed\s+(response|arrival|fix|repair|outcome)/i.test(lower)) {
        return "violation";
      }
      if (/guaranteed\s+same[- ]day/i.test(lower)) return "violation";
      return ownPositioning(lower);
    },
  },
  {
    label: "Background checked",
    pattern: /background[-\s]check\w*/gi,
    classify: (sentence) => ownPositioning(sentence),
  },
  {
    label: "Verified reviews",
    pattern: /verified\s+review\w*/gi,
    classify: () => "violation",
  },
  {
    label: "Google rating",
    pattern: /google\s+(rating|reviews?|reviews\b)/gi,
    classify: () => "violation",
  },
  {
    label: "Live agent / live person",
    pattern: /live\s+(agent|person|representative|operator)/gi,
    classify: (sentence) => mustBeNegated(sentence),
  },
  {
    label: "Online technician",
    pattern: /online\s+technician/gi,
    classify: () => "violation",
  },
  {
    label: "Technician dispatched",
    pattern: /technician\s+(is\s+|has\s+been\s+|was\s+)?dispatched/gi,
    classify: (sentence) => mustBeNegated(sentence),
  },
  {
    label: "Location detected",
    pattern: /location\s+(detected|automatically\s+detected)/gi,
    classify: () => "violation",
  },
  {
    label: "Real appointment",
    pattern: /real\s+(appointment|request|financing|transaction)/gi,
    classify: (sentence) => mustBeNegated(sentence),
  },
  {
    label: "AI diagnosis",
    pattern: /\b(ai|assistant|chatbot)\s+diagnos\w*/gi,
    classify: (sentence) => mustBeNegated(sentence),
  },
];

type Finding = {
  route: string;
  rule: string;
  verdict: Verdict;
  sentence: string;
};

const pages: readonly { route: string; element: () => ReactElement }[] = [
  { route: "/", element: () => <HomePage /> },
  { route: "/emergency", element: () => <EmergencyPage /> },
  { route: "/pricing", element: () => <PricingPage /> },
  { route: "/financing", element: () => <FinancingPage /> },
  { route: "/gallery", element: () => <GalleryPage /> },
  { route: "/service-areas", element: () => <ServiceAreasPage /> },
  { route: "/contact", element: () => <ContactPage /> },
  { route: "/about", element: () => <AboutPage /> },
];

/*
Block-level elements are the unit of review.

A whole-page textContent run merges an entire <main> into one unpunctuated
blob, which would let an unrelated "no" elsewhere on the page turn a genuine
claim into a false negative. Reading each block element's own text keeps the
negation check scoped to the sentence it actually belongs to.
*/
const blockSelector = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "a",
  "label",
  "dt",
  "dd",
  "blockquote",
  "td",
  "th",
].join(", ");

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function blockSentences(container: HTMLElement): string[] {
  const blocks = Array.from(container.querySelectorAll(blockSelector));
  const seen = new Set<string>();
  const result: string[] = [];

  for (const block of blocks) {
    // Skip a container whose text is fully owned by nested blocks, so a card
    // is not counted once per descendant element as well.
    const ownsText = !Array.from(block.children).some((child) =>
      blockSelector.includes(child.tagName.toLowerCase()),
    );
    if (!ownsText) continue;

    for (const sentence of sentences(block.textContent ?? "")) {
      const key = sentence.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(sentence);
    }
  }

  return result;
}

function collectFindings(): Finding[] {
  const findings: Finding[] = [];

  for (const page of pages) {
    const { container, unmount } = render(page.element());

    for (const rule of rules) {
      for (const sentence of blockSentences(container)) {
        rule.pattern.lastIndex = 0;
        if (!rule.pattern.test(sentence)) continue;
        findings.push({
          route: page.route,
          rule: rule.label,
          verdict: rule.classify(sentence),
          sentence,
        });
      }
    }
    unmount();
  }

  return findings;
}

describe("copy and claims audit", () => {
  const findings = collectFindings();

  it("makes no claim that contradicts actual technical behaviour", () => {
    const violations = findings.filter(
      (finding) => finding.verdict === "violation",
    );
    const readable = violations
      .map((finding) => `${finding.route} [${finding.rule}]: ${finding.sentence}`)
      .join("\n");
    expect(readable).toBe("");
  });

  it("records the allowed trust and emergency positioning", () => {
    const allowed = findings.filter((finding) => finding.verdict === "allowed");
    const rules = new Set(allowed.map((finding) => finding.rule));

    expect(rules.has("24/7")).toBe(true);
    expect(rules.has("Licensed & Insured")).toBe(true);
    expect(rules.has("Insured")).toBe(true);
    expect(rules.has("Guarantee / Satisfaction Guarantee")).toBe(true);
    expect(rules.has("Background checked")).toBe(true);
  });

  it("keeps every mention of a performed transaction inside a negation", () => {
    const transactionFindings = findings.filter((finding) =>
      /Technician dispatched|Real appointment|AI diagnosis/.test(finding.rule),
    );
    for (const finding of transactionFindings) {
      expect(
        finding.verdict,
        `${finding.route} mentions "${finding.rule}" without a negation: ${finding.sentence}`,
      ).not.toBe("violation");
    }
  });

  it("never claims a third party verified or reviewed this business", () => {
    const thirdParty = findings.filter((finding) =>
      /Verified reviews|Google rating/.test(finding.rule),
    );
    expect(thirdParty).toHaveLength(0);
  });

  it("keeps the assistant honest about diagnosis, live people and transmission", () => {
    const resolve = (text: string | (() => string)) =>
      typeof text === "function" ? text() : text;

    const copy = [
      assistant.welcome,
      assistant.explanation,
      ...assistant.disclosures,
      resolve(assistant.safetyIntent.response.text),
      ...assistant.intents.flatMap((intent) => [
        resolve(intent.response.text),
        ...(intent.response.actions ?? []).map((action) => action.label),
      ]),
    ]
      .join(" ")
      .toLowerCase();

    expect(copy).toMatch(/cannot diagnose/);
    expect(copy).toMatch(/does not connect to a live person/);
    expect(copy).toMatch(/nothing you type is sent anywhere or stored/i);
    expect(copy).toMatch(/no repair steps are given here for safety reasons/i);
  });

  it("retains the truthful negative disclosures rather than deleting them", () => {
    const homepage = render(<HomePage />);
    const text = (homepage.container.textContent ?? "").toLowerCase();
    // The form acknowledgement sits on the final review step, so the visible
    // homepage copy is what carries the disclosure at this stage.
    expect(text).toMatch(/does not create a real appointment/);
    expect(text).toMatch(/portfolio demonstration|fictional/);
    homepage.unmount();

    // The acknowledgement itself must still exist on the review step.
    expect(forms.privacyLabel.toLowerCase()).toMatch(
      /no real appointment is created/,
    );
    expect(forms.confirmationDisclosure.toLowerCase()).toMatch(
      /no information has been sent/,
    );
    expect(forms.confirmationDisclosure.toLowerCase()).toMatch(
      /no technician has been dispatched/,
    );
  });

  it("exposes a non-empty audit trail for the report", () => {
    expect(findings.length).toBeGreaterThan(0);
    for (const finding of findings) {
      expect(finding.route.startsWith("/")).toBe(true);
      expect(finding.rule.length).toBeGreaterThan(0);
      expect(["allowed", "negated", "violation"]).toContain(finding.verdict);
    }
  });

  it("renders every audited route without crashing", () => {
    for (const page of pages) {
      const rendered = render(page.element());
      expect(rendered.container.querySelector("main")).not.toBeNull();
      rendered.unmount();
    }
    expect(serviceSlugs.length).toBeGreaterThan(0);
  });
});