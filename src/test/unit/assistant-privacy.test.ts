import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assistant as assistantConfigCopy } from "@/config/assistant";
import { resolveResponseText } from "@/lib/assistant-intents";

/*
Static regression guards for the guided assistant.

These read the assistant's source and config as text and assert the absence of
network, storage and third-party integration. They intentionally check only
behavioral promises (no fetch, no storage, no vendor references, no live-person
wording) rather than implementation details such as hooks or component shape.
*/

const root = join(process.cwd(), "src");

function read(relativePath: string): string {
  return readFileSync(join(root, relativePath), "utf8");
}

const assistantComponent = read("components/assistant/Assistant.tsx");
const assistantMatcher = read("lib/assistant-intents.ts");
const assistantConfig = read("config/assistant.ts");
const assistantSource = `${assistantComponent}\n${assistantMatcher}\n${assistantConfig}`;

describe("assistant adds no network, storage or AI dependency", () => {
  it("never calls fetch, XMLHttpRequest, WebSocket or a beacon", () => {
    for (const forbidden of [
      "fetch(",
      "XMLHttpRequest",
      "new WebSocket",
      "sendBeacon",
      "EventSource",
      "navigator.geolocation",
    ]) {
      expect(assistantSource, forbidden).not.toContain(forbidden);
    }
  });

  it("never touches browser storage, cookies, IndexedDB or the URL", () => {
    for (const forbidden of [
      "localStorage",
      "sessionStorage",
      "indexedDB",
      "document.cookie",
      "useSearchParams",
      "URLSearchParams",
      "history.pushState",
    ]) {
      expect(assistantSource, forbidden).not.toContain(forbidden);
    }
  });

  it("never references an external AI, chat or analytics vendor", () => {
    const lowered = assistantSource.toLowerCase();
    for (const forbidden of [
      "openai",
      "anthropic",
      "gpt",
      "claude",
      "gemini",
      "langchain",
      "ollama",
      "replicate",
      "huggingface",
      "api.openai",
      "api.",
      "axios",
      "google-analytics",
      "gtag",
      "segment",
      "posthog",
    ]) {
      expect(lowered, forbidden).not.toContain(forbidden);
    }
  });

  it("renders no raw HTML from configuration or user input", () => {
    expect(assistantSource).not.toContain("dangerouslySetInnerHTML");
    expect(assistantSource).not.toContain("innerHTML");
    expect(assistantSource).not.toContain("outerHTML");
    expect(assistantSource).not.toContain("insertAdjacentHTML");
    expect(assistantSource).not.toContain("document.write");
  });

  it("adds no server action, route handler or API endpoint", () => {
    for (const forbidden of ['"use server"', "use server", "server-only"]) {
      expect(assistantSource, forbidden).not.toContain(forbidden);
    }
  });

  it("uses no randomness, so ids and output stay hydration-stable", () => {
    for (const forbidden of [
      "Math.random",
      "Date.now",
      "crypto.randomUUID",
      "nanoid",
      "uuid",
    ]) {
      expect(assistantSource, forbidden).not.toContain(forbidden);
    }
  });

  it("adds no timers for a simulated typing delay", () => {
    // A finite typing indicator was deliberately omitted: it would add
    // fragility without improving a deterministic local router.
    expect(assistantSource).not.toContain("setTimeout");
    expect(assistantSource).not.toContain("setInterval");
  });
});

describe("assistant copy never claims real people or availability", () => {
  /*
  These assertions run against the resolved text a user actually sees, not
  against raw source literals. Scanning source would conflate a routing keyword
  such as "24/7" with copy that reaches the screen, which is too blunt: 24/7 is
  a permitted fact when scoped to emergency calls, and a forbidden claim when
  presented as office hours or general availability.
  */
  const rendered = (
    [
      assistantConfigCopy.welcome,
      assistantConfigCopy.explanation,
      ...assistantConfigCopy.disclosures,
      ...assistantConfigCopy.quickPrompts.map((prompt) => prompt.label),
      ...assistantConfigCopy.intents.map((intent) =>
        resolveResponseText(intent.response),
      ),
    ]
      .join(" ")
      .toLowerCase()
  );

  it("avoids live-person and real-time support wording", () => {
    for (const forbidden of [
      "live agent",
      "online plumber",
      "ai technician",
      "technician available",
      "we are responding",
      "round the clock",
      "always available",
      "real-time support",
    ]) {
      expect(rendered, forbidden).not.toContain(forbidden);
    }
  });

  it("scopes 24/7 to emergency calls rather than office hours", () => {
    for (const match of rendered.matchAll(/24\/7/g)) {
      const window = rendered.slice(
        Math.max(0, match.index! - 60),
        match.index! + 60,
      );
      expect(window, `unscoped 24/7 near: ${window}`).toContain("emergency");
    }
    expect(rendered).not.toMatch(/24\/7[^.]{0,40}office hours/i);
  });

  it("avoids claims of diagnosis, guarantees or dispatch", () => {
    for (const forbidden of [
      "we diagnose",
      "i diagnose",
      "guaranteed",
      "we will fix",
      "our technician will",
      "a technician is on the way",
      "we are on the way",
    ]) {
      expect(rendered, forbidden).not.toContain(forbidden);
    }
  });

  it("states the demo, storage and no-diagnosis disclosures in config", () => {
    expect(assistantConfig).toContain("Guided demo");
    expect(assistantConfig).toContain("cannot diagnose");
    expect(assistantConfig).toContain("does not connect to a live person");
    expect(assistantConfig).toMatch(/nothing you type is sent anywhere or stored/i);
    expect(assistantConfig).toContain("fictional portfolio demonstration");
    expect(assistantConfig).toContain("no appointment is ever created");
    expect(assistantConfig).toMatch(/not actually offered/i);
    // The financing notice is composed from config, so assert it there.
    expect(read("config/financing.ts")).toMatch(/no application is submitted/i);
  });
});
