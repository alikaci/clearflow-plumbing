/*
Site URL resolution.

The project does not own a public domain and has not been deployed, so there is
no hard-coded production URL anywhere in the codebase. An optional origin is
read from NEXT_PUBLIC_SITE_URL. When it is absent or invalid, callers must omit
canonical URLs, Open Graph URLs and the robots Host value rather than emitting
an assumed, localhost or otherwise unverified domain.
*/

const RESERVED_TLDS = [".invalid", ".test", ".localhost"] as const;

function isLoopbackHost(host: string): boolean {
  return (
    host === "localhost" ||
    host === "[::1]" ||
    host === "::1" ||
    host === "0.0.0.0" ||
    host.startsWith("127.")
  );
}

function isReservedHost(host: string): boolean {
  return RESERVED_TLDS.some((tld) => host === tld.slice(1) || host.endsWith(tld));
}

/**
 * Normalizes a raw URL value into a bare http(s) origin, or returns null when
 * the value is missing, malformed, not http(s), or clearly not a public host.
 * The reserved IANA `.example` host (for example `clearflow-preview.example`)
 * is accepted as an origin for deterministic tests even though it is
 * intentionally not a real deployment.
 *
 * - `https://clearflow-preview.example/` -> `https://clearflow-preview.example`
 * - `https://example.com/path?q=1#x` -> `https://example.com`
 * - `http://localhost:3000` -> `null`
 * - `clearflow-preview.example` -> `null` (not an absolute URL)
 * - `not a url` -> `null`
 */
export function normalizeSiteUrl(value: string | undefined | null): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase();
  if (isLoopbackHost(host) || isReservedHost(host)) return null;

  return url.origin;
}

/*
The value is only echoed in a warning when it came from the environment, so no
credential or secret a developer stored in the variable is ever printed.
*/
let warnedForInvalidEnvironmentValue = false;

export function hasConfiguredSiteUrl(): boolean {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) !== null;
}

export function getSiteUrl(
  value: string | undefined = process.env.NEXT_PUBLIC_SITE_URL,
): string | null {
  const normalized = normalizeSiteUrl(value);

  if (
    normalized === null &&
    value !== undefined &&
    value.trim().length > 0 &&
    !warnedForInvalidEnvironmentValue &&
    process.env.NODE_ENV !== "test"
  ) {
    warnedForInvalidEnvironmentValue = true;
    console.warn(
      "NEXT_PUBLIC_SITE_URL is set but was rejected. Canonical tags, Open Graph URLs and the robots Host value will be omitted. Provide a bare https or http origin on a non-local host with no path, query, hash or credentials.",
    );
  }

  return normalized;
}

/** Joins a site origin and a route path without producing a double slash. */
export function toAbsoluteUrl(origin: string, path: string): string {
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
