# ClearFlow Plumbing Co.

Fictional portfolio demonstration website for a plumbing-services concept, designed and developed by ServiceHarbor Studio. No real service is provided and nothing here is deployed.

## Environment

- Node.js: 24.19.0 (see `.nvmrc`)
- npm: 11.17.0
- Package manager: npm

## Local setup

```bash
npm install
```

Copy `.env.example` to `.env.local` if you want to review canonical/Open Graph output. `NEXT_PUBLIC_SITE_URL` is optional and must be the bare origin of the site's owned/controlled domain once deployed (deterministic tests use the reserved IANA example origin `https://clearflow-preview.example`, which is intentionally never a real deployment). When it is unset, canonical tags, `og:url`, `og:image`, `twitter:image` and the `robots.txt` `Host` directive are omitted so no local or placeholder domain is ever published.

## Commands

| Task | Command |
| ---- | ------- |
| Development server | `npm run dev` |
| Production build | `npm run build` |
| Lint | `npm run lint` |
| Type check | `npm run typecheck` |
| Lint, type check and build | `npm run check` |
| Unit and component tests | `npm test` |
| End-to-end tests (Chromium) | `npm run e2e` |
| Run production build locally | `npm run start` |

`npm run e2e` starts the production server on port 4300, so run `npm run build` first.

## Status

- All routes, content, forms and interactions are implemented as a static-first portfolio concept.
- Content security policy and baseline security headers are applied in `next.config.ts`.
- Nothing has been deployed and no remote Git repository has been created.
