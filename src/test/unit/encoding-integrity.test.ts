import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { resolveResponseText } from "@/lib/assistant-intents";

/**
 * Guard against mojibake reaching customer-facing text.
 *
 * Punctuation such as an em dash or a curly apostrophe is valid UTF-8, but it
 * is also exactly what turns into visible garbage when a file is read with the
 * wrong encoding: a Latin-1 read of a UTF-8 em dash produces a three-character
 * sequence. This repository standardises on ASCII punctuation so a mis-decoded
 * file can never render mojibake, and this test fails if that regresses.
 *
 * Markers are written with escapes on purpose: writing them literally would
 * reintroduce the very non-ASCII bytes this test exists to prevent.
 */

/** Mojibake markers, built from code points so this file stays ASCII. */
const MOJIBAKE = [
  "\u00e2\u0080\u0093", // Latin-1 read of UTF-8 en dash
  "\u00e2\u0080\u0098", // broken left single quote
  "\u00e2\u0080\u0099", // broken right single quote
  "\u00c2\u00a9", // broken copyright sign
  "\u00c2\u00a3", // broken pound sign
  "\u00e2\u0082\u00ac", // broken euro sign
  "\u00c3\u00a9", // broken e-acute
  "\u0638", // Arabic letter zah, from a double-encoded right single quote
  "\u0080", // stray C1 control from a mis-decoded UTF-8 sequence
  "\u00a4", // generic currency sign from a mis-decoded UTF-8 sequence
  "\u00c2\u0080", // Latin-1 read of a UTF-8 continuation pair
  "\u00c3\u0082", // another continuation-pair artefact
  "\u00e2\u0080", // truncated UTF-8 continuation sequence
  "\u00ef\u00bf\u00bd", // replacement character, double-encoded
  "\ufffd", // U+FFFD replacement character
];

/**
 * Non-ASCII characters that are meaningful content rather than punctuation, so
 * they are allowed to appear.
 */
const ALLOWED_NON_ASCII: ReadonlySet<string> = new Set([
  "\u00a3", // GBP price
  "\u20ac", // EUR price
  "\u00b7", // separator dot in review summaries
  "\u00e9", // accented given name
  "\u2192", // step connector rendered in the workflow rail
]);

const CUSTOMER_FACING = ["src", "e2e"] as const;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, out);
      continue;
    }
    if (/\.(ts|tsx|mjs|json|css)$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe("encoding integrity", () => {
  const files = CUSTOMER_FACING.flatMap((dir) => walk(dir));

  it("finds source files to scan", () => {
    expect(files.length).toBeGreaterThan(40);
  });

  it("keeps its own marker table ASCII-only", () => {
    // If this test file ever carries raw non-ASCII, the table above is already
    // wrong, so fail loudly rather than scanning with a corrupted marker.
    for (const ch of fs.readFileSync(__filename, "utf8")) {
      if (ch.charCodeAt(0) > 127 && !ALLOWED_NON_ASCII.has(ch)) {
        // Comments in this file use escapes precisely to avoid this.
        throw new Error(
          `encoding-integrity.test.ts contains non-ASCII ${JSON.stringify(ch)}; use an escape instead`,
        );
      }
    }
  });

  it("contains no mojibake markers in customer-facing source", () => {
    const hits: string[] = [];
    for (const file of files) {
      if (file.endsWith("encoding-integrity.test.ts")) continue;
      const text = fs.readFileSync(file, "utf8");
      for (const marker of MOJIBAKE) {
        if (marker.length === 0) continue;
        if (text.includes(marker)) hits.push(`${file}: ${JSON.stringify(marker)}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it("uses ASCII-only punctuation in customer-facing source", () => {
    const offenders: string[] = [];
    for (const file of files) {
      if (file.endsWith("encoding-integrity.test.ts")) continue;
      const lines = fs.readFileSync(file, "utf8").split("\n");
      for (let i = 0; i < lines.length; i += 1) {
        for (const ch of lines[i]) {
          if (ch.charCodeAt(0) <= 127) continue;
          if (ALLOWED_NON_ASCII.has(ch)) continue;
          offenders.push(
            `${file}:${i + 1} U+${ch.charCodeAt(0).toString(16).padStart(4, "0").toUpperCase()}`,
          );
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("keeps assistant copy free of mojibake and readable", async () => {
    const { assistant } = await import("@/config/assistant");
    const copy = [
      assistant.welcome,
      assistant.explanation,
      ...assistant.disclosures,
      resolveResponseText(assistant.safetyIntent.response),
      ...assistant.intents.map((intent) =>
        resolveResponseText(intent.response),
      ),
    ].join(" ");

    for (const marker of MOJIBAKE) {
      expect(copy).not.toContain(marker);
    }
    expect(assistant.welcome).toMatch(/^Hi - I'm the ClearFlow Guide\./);
  });
});