import type { NextConfig } from "next";

/*
Content Security Policy.

The app is statically rendered and ships no third-party scripts, so the policy
is intentionally tight. Two allowances are required and documented:

- script-src 'unsafe-inline' is needed because Next.js streams the RSC payload
  and hydration bootstrap through inline <script> tags. Removing it would
  require a per-request nonce in middleware, which would opt every route out of
  static rendering.
- style-src 'unsafe-inline' is needed for framework-injected inline styles.

'unsafe-eval' is added only in development for the bundler's dev runtime and is
absent from the production policy.

connect-src stays at 'self' in production. WebSocket origins (ws:, wss:) are
only added in development because they are needed by the dev-server HMR client;
the production site opens no WebSocket connections.
*/
const isProduction = process.env.NODE_ENV === "production";

const scriptSrc = isProduction
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const connectSrc = isProduction
  ? "connect-src 'self'"
  : "connect-src 'self' ws: wss:";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  scriptSrc,
  connectSrc,
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), camera=(), microphone=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  agentRules: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
