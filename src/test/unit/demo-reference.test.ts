import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createDemoReference,
  demoReferencePattern,
} from "@/lib/demo-reference";

function forceZeros() {
  const source = globalThis.crypto;
  if (source && typeof source.getRandomValues === "function") {
    return vi
      .spyOn(source, "getRandomValues")
      .mockImplementation((array: unknown) => {
        (array as Uint32Array).fill(0);
        return array as Uint32Array;
      });
  }
  return vi.stubGlobal("crypto", {
    getRandomValues: (array: Uint32Array) => {
      array.fill(0);
      return array;
    },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createDemoReference", () => {
  it("matches the required CF-DEMO-XXXXXX format", () => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      expect(createDemoReference()).toMatch(demoReferencePattern);
      expect(createDemoReference()).toMatch(/^CF-DEMO-\d{6}$/);
    }
  });

  it("keeps leading zeroes", () => {
    forceZeros();
    expect(createDemoReference()).toBe("CF-DEMO-000000");
  });

  it("uses Web Crypto when the browser provides it", () => {
    const spy = forceZeros();
    createDemoReference();
    expect(spy).toHaveBeenCalled();
  });

  it("falls back to a non-security source when Web Crypto is unavailable", () => {
    vi.stubGlobal("crypto", undefined);
    const random = vi.spyOn(Math, "random").mockReturnValue(0.999999);
    expect(createDemoReference()).toBe("CF-DEMO-999999");
    expect(random).toHaveBeenCalledTimes(6);
  });

  it("returns a new value on each call", () => {
    const seen = new Set<string>();
    for (let attempt = 0; attempt < 50; attempt += 1) {
      seen.add(createDemoReference());
    }
    expect(seen.size).toBeGreaterThan(1);
  });
});
