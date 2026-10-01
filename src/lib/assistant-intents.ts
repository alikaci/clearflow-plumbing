import type {
  AssistantActionLink,
  AssistantIntent,
  AssistantMessageVariant,
  AssistantResponseBody,
} from "@/types";
import { resolveHashHref } from "./links";

/*
Deterministic, local intent matching for the guided assistant.

This is keyword and short-phrase routing, not natural-language understanding:
there is no model, no network call, no randomness and no persistence. The same
function serves free text and the quick-prompt chips, so both go through one
implementation.

Scoring is intentionally small and readable rather than a general framework:
  - a configured multi-word phrase hit scores 4
  - a configured specific single-word keyword hit scores 2
  - a bare stopword (a, my, the, is ...) is never treated as a keyword
  - the highest-scoring intent wins, and it must clear MIN_CONFIDENCE
Safety is resolved first and independently, so danger always outranks plumbing.
*/

const STOPWORDS = new Set([
  "a",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "can",
  "do",
  "does",
  "for",
  "from",
  "get",
  "have",
  "help",
  "hi",
  "how",
  "i",
  "in",
  "is",
  "it",
  "just",
  "me",
  "my",
  "need",
  "no",
  "not",
  "of",
  "on",
  "or",
  "please",
  "so",
  "some",
  "that",
  "the",
  "there",
  "this",
  "to",
  "was",
  "we",
  "what",
  "when",
  "where",
  "with",
  "would",
  "you",
  "your",
]);

/** Minimum score an intent must reach before it is considered a match. */
export const MIN_CONFIDENCE = 2;

const PHRASE_SCORE = 4;
const KEYWORD_SCORE = 2;

/**
 * Lowercase, strip accents and reduce harmless punctuation to single spaces.
 * This never removes letters or digits, so "Do you serve my area?" and
 * "do-you-serve-my-area" normalize to the same token sequence.
 */
export function normalizeInput(raw: string): string {
  return raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function tokenize(raw: string): string[] {
  const normalized = normalizeInput(raw);
  return normalized.length === 0 ? [] : normalized.split(" ");
}

type IntentScore = {
  intent: AssistantIntent;
  score: number;
  matched: string[];
};

function scoreIntent(tokens: string[], intent: AssistantIntent): IntentScore {
  const tokenSet = new Set(tokens);
  let score = 0;
  const matched: string[] = [];

  for (const phrase of intent.phrases) {
    const phraseTokens = tokenize(phrase);
    if (phraseTokens.length < 2) continue;

    // Look for the phrase's tokens as a contiguous run so "no hot water" does
    // not match an unrelated sentence that happens to contain all three words.
    for (let i = 0; i + phraseTokens.length <= tokens.length; i++) {
      const window = tokens.slice(i, i + phraseTokens.length);
      if (window.every((token, index) => token === phraseTokens[index])) {
        score += PHRASE_SCORE;
        matched.push(phrase);
        break;
      }
    }
  }

  for (const keyword of intent.keywords) {
    const keywordTokens = tokenize(keyword);
    if (keywordTokens.length !== 1) continue;
    if (STOPWORDS.has(keywordTokens[0])) continue;
    if (tokenSet.has(keywordTokens[0])) {
      score += KEYWORD_SCORE;
      matched.push(keyword);
    }
  }

  return { intent, score, matched };
}

function rankIntents(tokens: string[], intents: readonly AssistantIntent[]): IntentScore[] {
  return intents
    .map((intent) => scoreIntent(tokens, intent))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
}

export type IntentMatch =
  | {
      kind: "intent";
      intent: AssistantIntent;
      confidence: number;
      matched: string[];
      fallback: AssistantResponseBody;
    }
  | { kind: "fallback"; confidence: number; fallback: AssistantResponseBody };

export type MatchOptions = {
  safetyIntent: AssistantIntent;
  fallback: AssistantResponseBody;
  intents: readonly AssistantIntent[];
};

/**
 * Route a piece of typed text to exactly one intent, or to the safe fallback.
 *
 * Safety is checked first and returns as soon as it matches, which is what
 * makes a message such as "my water heater is leaking and I smell gas" produce
 * the safety response instead of the water-heater response.
 */
export function matchIntent(raw: string, options: MatchOptions): IntentMatch {
  const tokens = tokenize(raw);
  const fallback = options.fallback;

  if (tokens.length === 0) {
    return { kind: "fallback", confidence: 0, fallback };
  }

  const safety = scoreIntent(tokens, options.safetyIntent);
  if (safety.score >= MIN_CONFIDENCE) {
    return {
      kind: "intent",
      intent: safety.intent,
      confidence: safety.score,
      matched: safety.matched,
      fallback,
    };
  }

  const ranked = rankIntents(tokens, options.intents);
  const best = ranked[0];

  if (best && best.score >= MIN_CONFIDENCE) {
    return {
      kind: "intent",
      intent: best.intent,
      confidence: best.score,
      matched: best.matched,
      fallback,
    };
  }

  return { kind: "fallback", confidence: best?.score ?? 0, fallback };
}

/** Resolve a configured response body, expanding any business-fact function. */
export function resolveResponseText(body: AssistantResponseBody): string {
  return typeof body.text === "function" ? body.text() : body.text;
}

/** A fully resolved assistant reply, ready to render. */
export type ResolvedReply = {
  text: string;
  actions: AssistantActionLink[];
  variant: AssistantMessageVariant;
};

/**
 * Turn a match into a renderable reply, expanding the response text and
 * rewriting any same-page hash href (e.g. "#estimate") for the current route
 * through the same helper the rest of the site uses.
 */
export function resolveMatch(match: IntentMatch, pathname: string): ResolvedReply {
  const body: AssistantResponseBody =
    match.kind === "intent" ? match.intent.response : match.fallback;

  return {
    text: resolveResponseText(body),
    actions: (body.actions ?? []).map((action) => ({
      label: action.label,
      href: resolveHashHref(action.href, pathname),
    })),
    variant: body.variant ?? "standard",
  };
}
