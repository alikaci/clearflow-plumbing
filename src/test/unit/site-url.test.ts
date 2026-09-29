import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import {
  getSiteUrl,
  hasConfiguredSiteUrl,
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
    expect(normalizeSiteUrl("https://clearflow-preview.example")).toBe(
      "https://clearflow-preview.example",
    );
    expect(normalizeSiteUrl("https://clearflow-preview.example/")).toBe(
      "https://clearflow-preview.example",
    );
    expect(normalizeSiteUrl("https://clearflow-preview.example/some/path?x=1#y")).toBe(
      "https://clearflow-preview.example",
    );
  });

  it("accepts a valid http origin", () => {
    expect(normalizeSiteUrl("http://clearflow-preview.example")).toBe(
      "http://clearflow-preview.example",
    );
  });

  it("rejects malformed and non-http(s) values", () => {
    expect(normalizeSiteUrl("not a url")).toBeNull();
    expect(normalizeSiteUrl("clearflow-preview.example")).toBeNull();
    expect(normalizeSiteUrl("ftp://clearflow-preview.example")).toBeNull();
    expect(normalizeSiteUrl("javascript:alert(1)")).toBeNull();
  });

  it("rejects opaque and non-web schemes", () => {
    expect(normalizeSiteUrl("data:text/plain,hello")).toBeNull();
    expect(normalizeSiteUrl("file:///C:/x.html")).toBeNull();
    expect(normalizeSiteUrl("mailto:jordan@example.com")).toBeNull();
  });

  it("drops userinfo so credentials never reach metadata", () => {
    expect(
      normalizeSiteUrl("https://jordan:secret@clearflow-preview.example/some/path"),
    ).toBe("https://clearflow-preview.example");
  });

  it("rejects loopback hosts so localhost never becomes canonical", () => {
    expect(normalizeSiteUrl("http://localhost:3000")).toBeNull();
    expect(normalizeSiteUrl("http://127.0.0.1:4300")).toBeNull();
    expect(normalizeSiteUrl("http://[::1]:3000")).toBeNull();
  });

  it("accepts the reserved IANA example host for deterministic tests", () => {
    expect(normalizeSiteUrl("https://clearflow-preview.example")).toBe(
      "https://clearflow-preview.example",
    );
    expect(normalizeSiteUrl("https://clearflow-preview.example/")).toBe(
      "https://clearflow-preview.example",
    );
    expect(normalizeSiteUrl("https://clearflow.example/gallery?x=1#y")).toBe(
      "https://clearflow.example",
    );
  });

  it("rejects other reserved hosts so only IANA example hosts pass", () => {
    expect(normalizeSiteUrl("https://something.test")).toBeNull();
    expect(normalizeSiteUrl("https://something.invalid")).toBeNull();
    expect(normalizeSiteUrl("https://something.localhost")).toBeNull();
  });

  it("reads the environment value through getSiteUrl", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://clearflow-preview.example/");
    expect(getSiteUrl()).toBe("https://clearflow-preview.example");
    vi.unstubAllEnvs();

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBeNull();
    vi.unstubAllEnvs();
  });

  it("reports whether a valid site URL is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://clearflow-preview.example");
    expect(hasConfiguredSiteUrl()).toBe(true);
    vi.unstubAllEnvs();

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(hasConfiguredSiteUrl()).toBe(false);
    vi.unstubAllEnvs();

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not a url");
    expect(hasConfiguredSiteUrl()).toBe(false);
    vi.unstubAllEnvs();
  });
});

describe("getSiteUrl warnings", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not warn when the environment value is absent", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    try {
      expect(getSiteUrl()).toBeNull();
      expect(warnSpy).not.toHaveBeenCalled();
    } finally {
      warnSpy.mockRestore();
    }
  });

  it("warns once for a set-but-invalid value without echoing it", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv(
      "NEXT_PUBLIC_SITE_URL",
      "https://superadmin:hunter2@localhost:3000",
    );
    try {
      expect(getSiteUrl()).toBeNull();
      expect(warnSpy).toHaveBeenCalledTimes(1);
      const message = String(warnSpy.mock.calls[0][0]);
      expect(message).toContain("NEXT_PUBLIC_SITE_URL");
      expect(message).not.toContain("superadmin");
      expect(message).not.toContain("hunter2");
    } finally {
      warnSpy.mockRestore();
    }
  });
});

describe("toAbsoluteUrl", () => {
  it("keeps the bare origin for the home path", () => {
    expect(toAbsoluteUrl("https://clearflow-preview.example", "/")).toBe(
      "https://clearflow-preview.example",
    );
  });

  it("joins route paths without a double slash", () => {
    expect(toAbsoluteUrl("https://clearflow-preview.example", "/services")).toBe(
      "https://clearflow-preview.example/services",
    );
    expect(toAbsoluteUrl("https://clearflow-preview.example", "services")).toBe(
      "https://clearflow-preview.example/services",
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
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://clearflow-preview.example");
    expect(robots().host).toBe("https://clearflow-preview.example");
  });

  it("emits the reserved IANA example origin as the Host value", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://clearflow-preview.example");
    expect(robots().host).toBe("https://clearflow-preview.example");
  });

  it("still omits Host for loopback or structurally invalid values", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    expect(robots().host).toBeUndefined();
  });
});
