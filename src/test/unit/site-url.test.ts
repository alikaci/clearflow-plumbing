import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import {
  getSiteUrl,
  normalizeSiteUrl,
  toAbsoluteUrl,
} from "@/lib/site-url";

describe("normalizeSiteUrl", () => {
  it("returns null when the value is missing or blank", () => {
    expect(normalizeSiteUrl(undefined)).toBeNull();
    expect(normalizeSiteUrl(null)).toBeNull();
    expect(normalizeSiteUrl("")).toBeNull();
    expect(normalizeSiteUrl("   ")).toBeNull();
  });

  it("accepts a valid https origin and removes a trailing slash", () => {
    expect(normalizeSiteUrl("https://clearflow-plumbing.com")).toBe(
      "https://clearflow-plumbing.com",
    );
    expect(normalizeSiteUrl("https://clearflow-plumbing.com/")).toBe(
      "https://clearflow-plumbing.com",
    );
    expect(normalizeSiteUrl("https://clearflow-plumbing.com/some/path?x=1#y")).toBe(
      "https://clearflow-plumbing.com",
    );
  });

  it("accepts a valid http origin", () => {
    expect(normalizeSiteUrl("http://clearflow-plumbing.com")).toBe(
      "http://clearflow-plumbing.com",
    );
  });

  it("rejects malformed and non-http(s) values", () => {
    expect(normalizeSiteUrl("not a url")).toBeNull();
    expect(normalizeSiteUrl("clearflow-plumbing.com")).toBeNull();
    expect(normalizeSiteUrl("ftp://clearflow-plumbing.com")).toBeNull();
    expect(normalizeSiteUrl("javascript:alert(1)")).toBeNull();
  });

  it("rejects loopback hosts so localhost never becomes canonical", () => {
    expect(normalizeSiteUrl("http://localhost:3000")).toBeNull();
    expect(normalizeSiteUrl("http://127.0.0.1:4300")).toBeNull();
    expect(normalizeSiteUrl("http://[::1]:3000")).toBeNull();
  });

  it("rejects reserved documentation hosts", () => {
    expect(normalizeSiteUrl("https://clearflow.example")).toBeNull();
    expect(normalizeSiteUrl("https://something.test")).toBeNull();
    expect(normalizeSiteUrl("https://something.invalid")).toBeNull();
  });

  it("reads the environment value through getSiteUrl", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://clearflow-plumbing.com/");
    expect(getSiteUrl()).toBe("https://clearflow-plumbing.com");
    vi.unstubAllEnvs();

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBeNull();
    vi.unstubAllEnvs();
  });
});

describe("toAbsoluteUrl", () => {
  it("keeps the bare origin for the home path", () => {
    expect(toAbsoluteUrl("https://clearflow-plumbing.com", "/")).toBe(
      "https://clearflow-plumbing.com",
    );
  });

  it("joins route paths without a double slash", () => {
    expect(toAbsoluteUrl("https://clearflow-plumbing.com", "/services")).toBe(
      "https://clearflow-plumbing.com/services",
    );
    expect(toAbsoluteUrl("https://clearflow-plumbing.com", "services")).toBe(
      "https://clearflow-plumbing.com/services",
    );
  });
});

describe("robots output", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("omits the Host value when no site URL is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    const result = robots();
    expect(result.host).toBeUndefined();
    expect(result.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
  });

  it("uses the configured origin as the Host value", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://clearflow-plumbing.com");
    expect(robots().host).toBe("https://clearflow-plumbing.com");
  });

  it("never emits an unowned reserved Host value", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://clearflow.example");
    expect(robots().host).toBeUndefined();
  });
});
