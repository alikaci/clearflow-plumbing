# Social Sharing & Metadata Checklist

This demonstration website has no deployed domain, so all social metadata is
safety-gated by one rule: it is only emitted when `NEXT_PUBLIC_SITE_URL` is
configured with a **bare http(s) origin on an owned, non-local, non-reserved
domain**. Until then, canonical tags, `og:url`, `og:image`, `twitter:image` and
the `robots.txt` `Host` directive are all omitted, and `robots` stays
`noindex, nofollow`.

This checklist is for the person who later deploys this portfolio concept. It is
a fictional website: nothing here offers real services, appointments, pricing or
reviews, and the metadata must never imply otherwise.

## How social metadata is produced

- Root metadata: `src/app/layout.tsx` (site name, default title/description,
  Open Graph, X/Twitter card, conditional `metadataBase`).
- Page metadata: `buildMetadata("<routeKey>")` via `src/lib/metadata.ts`, which
  uses `src/config/seo.ts` for route titles/descriptions and produces absolute
  canonicals (`alternates.canonical`) plus `og:url` from `toAbsoluteUrl`.
- Social image: `src/app/opengraph-image/route.tsx` renders a 1200x630 PNG
  (`image/png`, <5 MB, ~0.9 MB today) from the approved local concept art in
  `public/images/opengraph.jpg`. All text is rendered in code.
- URL safety: `src/lib/site-url.ts`. An explicitly set invalid value makes the
  build print a warning (the value is never echoed); metadata stays omitted.

## Before deployment

- [ ] Keep `NEXT_PUBLIC_SITE_URL=` empty in `.env.example` unless publishing.
- [ ] Set the variable to the **exact origin** of the owned domain, no trailing
      slash, http(s) only. Rejected values include `localhost`, `127.*`, `::1`,
      `0.0.0.0` and reserved documentation TLDs (`.example`, `.invalid`,
      `.test`, `.localhost`). Do not use a placeholder like
      `https://your-preview-domain.example` — it is rejected by design.
- [ ] Rebuild after changing the variable: `NEXT_PUBLIC_` values are inlined at
      build time.
- [ ] Decide search intent. If staging behind a public URL, keep `robots`
      `noindex, nofollow` (already the default). Note that `noindex` stops
      indexing but does NOT hide `<head>` metadata from crawlers or validators,
      so only put signs up that are truthful.
- [ ] Do not add invented social handles, fake review counts, phone numbers,
      ratings or "licensed/insured/guaranteed" claims to any metadata. The
      concept label "Fictional portfolio concept by ServiceHarbor Studio" must
      remain attached to the social image.
- [ ] If the social image or title ever changes after publishing, change the
      image URL (or use a versioned path) so producer/consumer caches refresh.
      The route is `force-static`, so the PNG URL does not change by itself.

## Local verification (before any deployment)

No URL configured:

- Build and start the production server.
- Expected: no `rel="canonical"`, no `og:url`, no `og:image`, no
  `twitter:image`, and `content="noindex, nofollow"` on every route; no `Host:`
  in `/robots.txt`; `GET /opengraph-image` still returns 200 with
  `content-type: image/png` at 1200x630.

Valid URL configured (`NEXT_PUBLIC_SITE_URL=https://your-real-domain.com`):

- Expected: absolute, route-correct canonicals and `og:url` (homepage = bare
  origin), one absolute `og:image`/`twitter:image` pointing at
  `https://your-real-domain.com/opengraph-image` (no localhost, no relative
  URL), `og:image:width/height` 1200/630, `og:image:type` `image/png`,
  Open Graph `type` `website`, `locale` `en_US`, X `card`
  `summary_large_image`, and `robots noindex` still intact.
- Run `e2e/metadata-valid.spec.ts` (auto-skips when the URL is not configured):
  `NEXT_PUBLIC_SITE_URL=https://your-real-domain.com npm run e2e -- e2e/metadata-valid.spec.ts`.

## After deployment

- [ ] Validate one page with Facebook's Sharing Debugger and X Card Validator
      (or equivalent). Confirm the image renders at 1200x630 and the text shown
      matches what is in code.
- [ ] Re-run the unit tests (`npm test`), the full E2E suite on the plain build
      (`npm run e2e`), lint and typecheck.
- [ ] Confirm `robots.txt` still disallows everything and `Host` is the owned
      origin.

## Known limitations

- No `sitemap.xml` yet (intentionally out of scope for the metadata batch).
- No Apple touch icon: the only brand asset is `src/app/icon.svg`, and
  rasterizing it to a PNG requires an image tool this project does not install
  by policy. A generated favicon (`/icon.svg`) and `theme-color` (navy
  `#0b1f33`) are published instead.
- No PWA manifest; `theme-color` is the only mobile-browser chrome hint.