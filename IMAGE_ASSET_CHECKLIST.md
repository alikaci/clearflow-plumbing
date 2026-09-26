# IMAGE_ASSET_CHECKLIST

Status of the 22 image slots defined in `src/config/images.ts`.

**All 22 assets are installed and active** (`available: true`). Each slot renders the real
photo through `next/image`; the branded SVG fallback is intentionally retained, so any entry
switched back to `available: false` still renders a placeholder at the same aspect ratio with
no layout shift. Generation prompts live in `IMAGE_GENERATION_PROMPTS.md`.

The delivered files were AI-generated concept visuals for this fictional portfolio brand.
They were converted from the staged PNG sources to progressive JPEG (quality 85, 4:2:0,
metadata stripped) and placed at the exact manifest paths under `public/images/`.

## Slot checklist

`Final dimensions` is the delivered pixel size. Where it differs from the original plan, the
reason is stated in the notes below.

| # | Slot (`images` key) | File under `public/images/` | Planned | Final | Aspect | Priority | Active |
| - | ------------------- | --------------------------- | ------- | ----- | ------ | -------- | ------ |
| 1 | `heroTechnician` | `hero-technician.jpg` | 1600x1200 | 1448x1086 | 4:3 | yes | yes |
| 2 | `serviceDrain` | `service-drain-cleaning.jpg` | 1200x900 | 1200x900 | 4:3 | no | yes |
| 3 | `serviceLeak` | `service-leak-repair.jpg` | 1200x900 | 1200x900 | 4:3 | no | yes |
| 4 | `serviceWaterHeater` | `service-water-heater.jpg` | 1200x900 | 1200x900 | 4:3 | no | yes |
| 5 | `servicePipe` | `service-pipe-repair.jpg` | 1200x900 | 1200x900 | 4:3 | no | yes |
| 6 | `serviceFaucet` | `service-toilet-faucet.jpg` | 1200x900 | 1200x900 | 4:3 | no | yes |
| 7 | `serviceSump` | `service-sump-pump.jpg` | 1200x900 | 1200x900 | 4:3 | no | yes |
| 8 | `serviceSewer` | `service-sewer-line.jpg` | 1200x900 | 1200x900 | 4:3 | no | yes |
| 9 | `technicianHomeowner` | `technician-homeowner.jpg` | 1200x900 | 1200x900 | 4:3 | no | yes |
| 10 | `brandedVan` | `branded-van.jpg` | 1600x1000 | 1448x905 | 16:10 | no | yes |
| 11 | `aboutTeam` | `about-team.jpg` | 1400x1050 | 1323x992 | 4:3 | no | yes |
| 12 | `galleryPipeBefore` | `gallery-pipe-before.jpg` | 1000x750 | 1000x750 | 4:3 | no | yes |
| 13 | `galleryPipeAfter` | `gallery-pipe-after.jpg` | 1000x750 | 1000x750 | 4:3 | no | yes |
| 14 | `galleryHeaterBefore` | `gallery-heater-before.jpg` | 1000x750 | 1000x750 | 4:3 | no | yes |
| 15 | `galleryHeaterAfter` | `gallery-heater-after.jpg` | 1000x750 | 1000x750 | 4:3 | no | yes |
| 16 | `galleryDrainBefore` | `gallery-drain-before.jpg` | 1000x750 | 1000x750 | 4:3 | no | yes |
| 17 | `galleryDrainAfter` | `gallery-drain-after.jpg` | 1000x750 | 1000x750 | 4:3 | no | yes |
| 18 | `galleryFaucetBefore` | `gallery-faucet-before.jpg` | 1000x750 | 1000x750 | 4:3 | no | yes |
| 19 | `galleryFaucetAfter` | `gallery-faucet-after.jpg` | 1000x750 | 1000x750 | 4:3 | no | yes |
| 20 | `galleryUtilityBefore` | `gallery-utility-before.jpg` | 1000x750 | 1000x750 | 4:3 | no | yes |
| 21 | `galleryUtilityAfter` | `gallery-utility-after.jpg` | 1000x750 | 1000x750 | 4:3 | no | yes |
| 22 | `openGraph` | `opengraph.jpg` | 1200x630 | 1200x630 | 1200:630 | no | yes |

## Processing notes

- Everything except three files arrived at the planned ratio already; those were only
  downscaled. No image was upscaled and none was stretched.
- `hero-technician.jpg` (1448x1086) and `branded-van.jpg` (1448x905) are smaller than the
  original 1600px plan because the staged source was smaller. They are delivered at source
  resolution instead of being enlarged.
- `branded-van.jpg` was cropped from 1448x1086 to 1448x905 (4:3 to 16:10). The crop is biased
  to the top: the row-detail analysis put the low-detail band (sky and background) at the top
  and the strongest detail (vehicle body, wheels, road) in the lower middle, so only 49px was
  trimmed from the bottom and 132px from the top. The vehicle and both wheels stay inside the
  frame.
- `about-team.jpg` was cropped from 1586x992 to 1323x992 (16:10 to 4:3). The crop is biased to
  the right: the column-detail analysis put the strongest detail in the left and centre
  columns and a bright, low-detail band on the right, so 203px was trimmed from the right and
  60px from the left.
- `opengraph.jpg` was scaled to cover 1200x630 and centre-cropped, removing roughly 5px of
  total width.
- No image was stretched, and no image was re-encoded beyond the JPEG conversion.

## Changing an asset later

1. Generate the replacement from `IMAGE_GENERATION_PROMPTS.md` at the dimensions in the table.
2. Export an optimized `.jpg` (quality 82-88), keeping the exact pixel dimensions.
3. Save it at the `public/images/` path shown for that slot.
4. Set `available: true` in `src/config/images.ts` if the entry is currently `false`, and keep
   `width`, `height` and `aspectRatio` in sync with the new file.
5. Run `npm run check`, `npm test` and `npm run e2e`.

## Safety rules

- Never set `available: true` for a slot whose file is not present; `next/image` would request
  a missing file and show a broken image.
- Do not rename or move a file without updating the matching `src` in `src/config/images.ts`.
- Keep each before/after pair at the same camera angle, framing and lighting so the comparison
  reads as one project.
- Do not introduce real company names, phone numbers, addresses, readable license plates,
  signage, logos or identifiable real people.
- The social preview served at `/opengraph-image` is generated in code by
  `src/app/opengraph-image/route.tsx`, which uses `public/images/opengraph.jpg` as the
  background and renders the required text deterministically. The image is only referenced from
  metadata when `NEXT_PUBLIC_SITE_URL` is configured.
