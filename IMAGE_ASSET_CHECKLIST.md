# IMAGE_ASSET_CHECKLIST

Handoff checklist for the 22 image slots defined in `src/config/images.ts`. Every slot
currently has `available: false`, so the UI renders a branded SVG fallback at the exact
final aspect ratio (no broken images, no layout shift). Generation prompts live in
`IMAGE_GENERATION_PROMPTS.md`.

## Activation process

1. Generate each visual from `IMAGE_GENERATION_PROMPTS.md` at the exact dimensions below.
2. Export an optimized `.jpg` (quality ~80) where practical; keep the exact pixel dimensions.
3. Save the file under `public/` at the `src` path shown in the table (folder `public/images`).
4. Verify the file exists and its width/height match the table before editing any config.
5. In `src/config/images.ts`, change `available: false` to `true` for that one slot only.
6. Run `npm run check` and confirm lint, build and typecheck pass with `next/image`.
7. Run `npm test` and `npm run e2e`; the axe checks re-run against the real image rendering.
8. If the final image differs from the placeholder's meaning, update that entry's `alt` and
   keep the AI-generated disclosure text accurate, then commit the image change on its own.

## Slot checklist

`available: false` = fallback SVG is rendered. `available: true` = real file is served.

| # | Slot (`images` key) | File under `public/` | Dimensions | Aspect | Priority | `available` today |
| - | ------------------- | -------------------- | ---------- | ------ | -------- | ----------------- |
| 1 | `heroTechnician` | `/images/hero-technician.jpg` | 1600x1200 | 4:3 | yes | false |
| 2 | `serviceDrain` | `/images/service-drain-cleaning.jpg` | 1200x900 | 4:3 | no | false |
| 3 | `serviceLeak` | `/images/service-leak-repair.jpg` | 1200x900 | 4:3 | no | false |
| 4 | `serviceWaterHeater` | `/images/service-water-heater.jpg` | 1200x900 | 4:3 | no | false |
| 5 | `servicePipe` | `/images/service-pipe-repair.jpg` | 1200x900 | 4:3 | no | false |
| 6 | `serviceFaucet` | `/images/service-toilet-faucet.jpg` | 1200x900 | 4:3 | no | false |
| 7 | `serviceSump` | `/images/service-sump-pump.jpg` | 1200x900 | 4:3 | no | false |
| 8 | `serviceSewer` | `/images/service-sewer-line.jpg` | 1200x900 | 4:3 | no | false |
| 9 | `technicianHomeowner` | `/images/technician-homeowner.jpg` | 1200x900 | 4:3 | no | false |
| 10 | `brandedVan` | `/images/branded-van.jpg` | 1600x1000 | 16:10 | no | false |
| 11 | `aboutTeam` | `/images/about-team.jpg` | 1400x1050 | 4:3 | no | false |
| 12 | `galleryPipeBefore` | `/images/gallery-pipe-before.jpg` | 1000x750 | 4:3 | no | false |
| 13 | `galleryPipeAfter` | `/images/gallery-pipe-after.jpg` | 1000x750 | 4:3 | no | false |
| 14 | `galleryHeaterBefore` | `/images/gallery-heater-before.jpg` | 1000x750 | 4:3 | no | false |
| 15 | `galleryHeaterAfter` | `/images/gallery-heater-after.jpg` | 1000x750 | 4:3 | no | false |
| 16 | `galleryDrainBefore` | `/images/gallery-drain-before.jpg` | 1000x750 | 4:3 | no | false |
| 17 | `galleryDrainAfter` | `/images/gallery-drain-after.jpg` | 1000x750 | 4:3 | no | false |
| 18 | `galleryFaucetBefore` | `/images/gallery-faucet-before.jpg` | 1000x750 | 4:3 | no | false |
| 19 | `galleryFaucetAfter` | `/images/gallery-faucet-after.jpg` | 1000x750 | 4:3 | no | false |
| 20 | `galleryUtilityBefore` | `/images/gallery-utility-before.jpg` | 1000x750 | 4:3 | no | false |
| 21 | `galleryUtilityAfter` | `/images/gallery-utility-after.jpg` | 1000x750 | 4:3 | no | false |
| 22 | `openGraph` | `/images/opengraph.jpg` | 1200x630 | 1200:630 | no | false |

## Safety rules

- Never set `available: true` for a slot whose file is not present; `next/image` would
  request a missing file and the page would show a broken image.
- Do not rename or move a file without updating the matching `src` in `src/config/images.ts`.
- Keep each before/after pair at the same camera angle, framing and lighting so the
  comparison reads as one project.
- Do not include real company names, phone numbers, addresses, readable license plates,
  signage, logos or identifiable real people.
- Slot 22 (`openGraph`) is a reserved photographic asset. The live social preview is the
  generated `/opengraph-image` route (`src/app/opengraph-image/route.tsx`), which is emitted
  only when `NEXT_PUBLIC_SITE_URL` is configured. Adopting the photo for social previews
  would additionally require wiring it into `src/app/layout.tsx`.
