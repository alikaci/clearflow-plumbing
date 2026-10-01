import { describe, expect, it } from "vitest";
import { assistant } from "@/config/assistant";
import { business } from "@/config/business";
import {
  MIN_CONFIDENCE,
  matchIntent,
  normalizeInput,
  resolveMatch,
  resolveResponseText,
  tokenize,
} from "@/lib/assistant-intents";

const OPTIONS = {
  safetyIntent: assistant.safetyIntent,
  fallback: assistant.fallback,
  intents: assistant.intents,
} as const;

function route(text: string) {
  const match = matchIntent(text, OPTIONS);
  return match.kind === "intent" ? match.intent.id : "fallback";
}

function reply(text: string, pathname = "/") {
  return resolveMatch(matchIntent(text, OPTIONS), pathname);
}

describe("assistant input normalization", () => {
  it("lowercases, collapses whitespace and drops harmless punctuation", () => {
    expect(normalizeInput("  No   HOT   Water!!  ")).toBe("no hot water");
    expect(normalizeInput("Do you serve my area?")).toBe("do you serve my area");
    expect(normalizeInput("leaking-pipe / dripping_faucet")).toBe(
      "leaking pipe dripping faucet",
    );
  });

  it("strips accents so accented input still matches", () => {
 expect(normalizeInput("Café sink-is it blocked?")).toBe(
      "cafe sink is it blocked",
    );
  });

  it("tokenizes an empty or punctuation-only string to nothing", () => {
    expect(tokenize("")).toEqual([]);
    expect(tokenize("   ")).toEqual([]);
    expect(tokenize("!!! ??? ...")).toEqual([]);
  });

  it("never lets a stopword alone satisfy a keyword match", () => {
    expect(route("the a my is of and")).toBe("fallback");
  });
});

describe("required intent routing", () => {
  const cases: readonly (readonly [string, string])[] = [
    ["I have a leak", "leak"],
    ["leaking pipe", "leak"],
    ["water coming from the pipe", "leak"],
    ["a puddle under the sink", "leak"],
    ["blocked drain", "drain"],
    ["clogged drain", "drain"],
    ["slow drain", "drain"],
    ["sink not draining", "drain"],
    ["no hot water", "water-heater"],
    ["water heater leaking", "water-heater"],
    ["cold water only", "water-heater"],
    ["clogged toilet", "toilets-faucets"],
    ["toilet overflowing", "toilets-faucets"],
    ["running toilet", "toilets-faucets"],
    ["dripping faucet", "toilets-faucets"],
    ["sewer backup", "sewer"],
    ["sewage", "sewer"],
    ["multiple drains backing up", "sewer"],
    ["low water pressure", "pipe"],
    ["damaged pipe", "pipe"],
    ["burst pipe", "pipe"],
    ["sump pump", "sump"],
    ["basement water", "sump"],
    ["not sure", "general"],
    ["other problem", "general"],
    ["help me choose", "general"],
    ["do you serve my area", "service-area"],
    ["zip code", "service-area"],
    ["service area", "service-area"],
    ["Columbus", "service-area"],
    ["how much", "pricing"],
    ["what does it cost", "pricing"],
    ["estimate", "pricing"],
    ["financing", "financing"],
    ["payment plan", "financing"],
    ["monthly payments", "financing"],
    ["book", "booking"],
    ["appointment", "booking"],
    ["schedule", "booking"],
    ["request service", "booking"],
    ["business hours", "hours"],
    ["when are you open", "hours"],
    ["call", "contact"],
    ["phone number", "contact"],
    ["contact", "contact"],
    ["privacy", "privacy"],
    ["is this stored", "privacy"],
    ["do you save this", "privacy"],
  ];

  for (const [input, expected] of cases) {
    it(`routes "${input}" to ${expected}`, () => {
      expect(route(input)).toBe(expected);
    });
  }

  it("is case-insensitive and punctuation-tolerant", () => {
    expect(route("NO HOT WATER!!!")).toBe("water-heater");
    expect(route("  SeWer BaCkUp?  ")).toBe("sewer");
    expect(route("burst-pipe")).toBe("pipe");
  });
});

describe("safety precedence", () => {
  it("routes danger phrases to the safety intent", () => {
    for (const input of [
      "I smell gas",
      "gas leak",
      "there is smoke",
      "sparks from the outlet",
      "electrical danger",
      "standing water near electricity",
      "severe flooding",
      "immediate danger",
    ]) {
      expect(route(input), input).toBe("safety");
    }
  });

  it("overrides a plumbing intent when the same message mentions danger", () => {
    expect(route("my water heater is leaking and I smell gas")).toBe("safety");
    expect(route("leaking pipe and I see sparks")).toBe("safety");
    expect(route("flooding in the basement near the outlet")).toBe("safety");
  });

  it("returns the safety variant and no repair instructions", () => {
    const result = reply("I smell gas");
    expect(result.variant).toBe("safety");
    expect(result.text).toMatch(/safety comes before/i);
    expect(result.text).toMatch(/appropriate emergency service or utility provider/i);
    expect(result.text).toMatch(/cannot provide emergency response/i);
    expect(result.actions.map((action) => action.href)).toContain("/emergency");

    for (const forbidden of [
      "shut off the gas",
      "open a window",
      "turn off the breaker",
      "call 911",
      "we are on the way",
      "our technician",
    ]) {
      expect(result.text.toLowerCase(), forbidden).not.toContain(forbidden);
    }
  });
});

describe("safe fallback", () => {
  it("falls back for unrelated or weakly matching text", () => {
    for (const input of [
      "hello",
      "what is the weather",
      "qwertyuiop",
      "thanks very much",
      "",
      "   ",
    ]) {
      expect(route(input), JSON.stringify(input)).toBe("fallback");
    }
  });

  it("offers services, request form and contact without inventing an answer", () => {
    const result = reply("what is the weather");
    expect(result.text).toMatch(/couldn.t match that question/i);
    expect(result.variant).toBe("standard");
    expect(result.actions.map((action) => action.href)).toEqual([
      "/services",
      "#estimate",
      "/contact",
    ]);
    expect(result.text).not.toMatch(/diagnos/i);
  });
});

describe("response resolution", () => {
  it("routes each intent to the expected service page", () => {
    expect(
      reply("I have a leak").actions[0].href,
    ).toBe("/services/leak-repair");
    expect(reply("blocked drain").actions[0].href).toBe(
      "/services/drain-cleaning",
    );
    expect(reply("no hot water").actions[0].href).toBe(
      "/services/water-heaters",
    );
    expect(reply("clogged toilet").actions[0].href).toBe(
      "/services/toilets-faucets",
    );
    expect(reply("sewer backup").actions[0].href).toBe(
      "/services/sewer-lines",
    );
    expect(reply("burst pipe").actions[0].href).toBe("/services/pipe-repair");
    expect(reply("sump pump").actions[0].href).toBe("/services/sump-pumps");
    expect(reply("not sure").actions[0].href).toBe(
      "/services/general-plumbing",
    );
  });

  it("resolves the same-page estimate hash per route", () => {
    expect(reply("estimate", "/").actions.map((a) => a.href)).toContain(
      "#estimate",
    );
    expect(reply("estimate", "/services").actions.map((a) => a.href)).toContain(
      "/#estimate",
    );
  });

  it("keeps the service-area coverage hash target", () => {
    expect(reply("do you serve my area").actions[0].href).toBe(
      "/service-areas#check-coverage",
    );
  });

  it("substitutes configured business facts into hours and contact answers", () => {
const hours = reply("what are your hours");
    expect(hours.text).toContain(business.hours.full);
    expect(hours.text).toContain("Emergency calls are taken");
    // 24/7 is permitted here, but only as the emergency-calls fact.
    expect(hours.text).toContain(business.hours.emergency);
    expect(hours.text).toMatch(/no technician is dispatched/i);
    expect(hours.text).not.toMatch(/always open|round the clock/i);

    const contact = reply("phone number");
    expect(contact.text).toContain(business.phoneDisplay);
    expect(contact.actions[0].href).toBe(business.phoneUri);
  });

  it("states financing and booking are described, not real offers", () => {
    expect(reply("financing").text).toMatch(/not actually offered/i);
    expect(reply("financing").text).toMatch(/no application is submitted/i);
    expect(reply("book").text).toMatch(/no appointment is ever created/i);
  });

  it("explains that assistant messages are never stored", () => {
    const result = reply("is this stored");
    expect(result.text).toMatch(/only in this browser tab/i);
    expect(result.text).toMatch(
      /is transmitted, stored, logged or shared/i,
    );
    expect(result.actions[0].href).toBe("/privacy");
  });
});

describe("intent configuration integrity", () => {
  const ids = assistant.intents.map((intent) => intent.id);

  it("defines each required topic exactly once", () => {
    for (const required of [
      "leak",
      "drain",
      "water-heater",
      "toilets-faucets",
      "sewer",
      "pipe",
      "sump",
      "general",
      "service-area",
      "pricing",
      "financing",
      "booking",
      "hours",
      "contact",
      "privacy",
    ]) {
      expect(ids, required).toContain(required);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every intent keywords, phrases and a non-empty response", () => {
    for (const intent of assistant.intents) {
      expect(intent.keywords.length, intent.id).toBeGreaterThan(0);
      expect(intent.phrases.length, intent.id).toBeGreaterThan(0);
      expect(resolveResponseText(intent.response).length, intent.id).toBeGreaterThan(
        40,
      );
    }
  });

  it("keeps every keyword a single usable token and every phrase multi-word", () => {
    for (const intent of [...assistant.intents, assistant.safetyIntent]) {
      for (const keyword of intent.keywords) {
        expect(tokenize(keyword).length, `${intent.id}:${keyword}`).toBe(1);
      }
      for (const phrase of intent.phrases) {
        expect(tokenize(phrase).length, `${intent.id}:${phrase}`).toBeGreaterThanOrEqual(
          2,
        );
      }
    }
  });

  it("uses only safe internal links or the demo tel link in responses", () => {
    const bodies = [
      assistant.fallback,
      assistant.safetyIntent.response,
      ...assistant.intents.map((intent) => intent.response),
    ];
    for (const body of bodies) {
      for (const action of body.actions ?? []) {
        expect(
          action.href.startsWith("/") ||
            action.href.startsWith("#") ||
            action.href.startsWith("tel:"),
          action.href,
        ).toBe(true);
      }
    }
  });
});

describe("assistant copy safety", () => {
  const allText = [
    assistant.welcome,
    assistant.explanation,
    assistant.statusLabel,
    ...assistant.disclosures,
    assistant.fallback.text as string,
    ...assistant.quickPrompts.map((prompt) => prompt.label),
    ...assistant.intents.flatMap((intent) => [
      resolveResponseText(intent.response),
      ...(intent.response.actions ?? []).map((action) => action.label),
    ]),
    resolveResponseText(assistant.safetyIntent.response),
    ...(assistant.safetyIntent.response.actions ?? []).map((a) => a.label),
  ]
    .join(" ")
    .toLowerCase();

  it("never implies a live person, real-time service or blanket availability", () => {
    for (const forbidden of [
      "ai technician",
      "live agent",
      "online plumber",
      "technician available",
      "we are responding",
      "we're responding",
      "responding now",
      "24 7",
      "round the clock",
      "always open",
      "open 24",
      "real-time",
      "chat with a real",
      "our team will call you",
      "we will call you back",
      "a technician will",
      "i am an ai",
      "ai assistant",
      "language model",
    ]) {
      expect(allText, forbidden).not.toContain(forbidden);
    }
  });

  it("states 24/7 only as the emergency-calls fact, never as general availability", () => {
    /*
    Scope is carried by the sentence around "24/7", not by the characters that
    follow it, so split into sentences first. Matching forward from the digits
    would drop "Emergency calls are taken" and then fail a correct sentence.
    */
    const sentences = allText
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    const uses = sentences.filter((sentence) => sentence.includes("24/7"));
    expect(uses.length).toBeGreaterThan(0);
    for (const use of uses) {
      expect(use, `unscoped 24/7: ${use}`).toMatch(/emergency call/i);
    }
    // The office itself is closed outside its posted hours.
    expect(allText).toContain(business.hours.full.toLowerCase());
    expect(allText).toContain("emergency calls are taken");
    // A bare availability label must not be spliced into a sentence.
    expect(allText).not.toMatch(/availability is 24\/7 emergency calls/i);
  });

  it("never claims to diagnose a problem or provide repair instructions", () => {
    expect(allText).not.toMatch(/\bthe problem is\b/);
    expect(allText).not.toMatch(/i (can|will) diagnose/);
    expect(allText).not.toMatch(/here.s how to fix/);
    expect(allText).not.toMatch(/step 1: turn off/);
  });

  it("keeps the required honest disclosures", () => {
    expect(allText).toContain("guided demo");
    expect(assistant.disclosures.join(" ").toLowerCase()).toContain(
      "cannot diagnose",
    );
    expect(assistant.disclosures.join(" ").toLowerCase()).toContain(
      "does not connect to a live person",
    );
    expect(assistant.disclosures.join(" ").toLowerCase()).toContain(
      "nothing you type is sent anywhere or stored",
    );
    expect(assistant.disclosures.join(" ").toLowerCase()).toContain(
      "fictional portfolio demonstration",
    );
  });

  it("keeps the visible identity and status free of AI claims", () => {
    expect(assistant.name).toBe("ClearFlow Guide");
    expect(assistant.statusLabel).toBe("Guided demo");
    expect(assistant.dialogLabel).toBe("Website assistant");
  });
});

describe("matcher determinism", () => {
  it("returns the same result for the same input every time", () => {
    const input = "my kitchen sink is draining very slowly";
    const first = reply(input);
    for (let i = 0; i < 5; i += 1) {
      expect(reply(input)).toEqual(first);
    }
  });

  it("reports a confidence at or above the threshold for a real match", () => {
    const match = matchIntent("blocked drain", OPTIONS);
    expect(match.kind).toBe("intent");
    if (match.kind === "intent") {
      expect(match.confidence).toBeGreaterThanOrEqual(MIN_CONFIDENCE);
      expect(match.matched.length).toBeGreaterThan(0);
    }
  });
});
