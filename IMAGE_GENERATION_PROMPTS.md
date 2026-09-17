# IMAGE_GENERATION_PROMPTS

Every image slot in `src/config/images.ts` currently renders a branded SVG fallback so the
layout is final and no broken images or layout shift can occur. This file documents the
intended final photographs.

## How to adopt a generated image

1. Generate the image with the prompt below at the listed aspect ratio.
2. Save it under `public/` at the `src` path shown for that slot.
3. Open `src/config/images.ts` and set `available: true` for that entry.

No component change is required. `BrandImage` automatically switches from the fallback to
`next/image`. The hero entry has `priority: true`; every other entry is lazy loaded.

## Shared style brief (prepend to every prompt)

> Photorealistic editorial photograph for a plumbing-service website. American residential
> setting, natural daylight, neutral color grading, clean and organized work areas. The
> technician wears a plain navy work uniform. Shot on a 35mm lens with shallow depth of
> field and sharp focus on the subject. No text, no logos, no brand names, no phone
> numbers, no license plates, no signage, no readable labels, no competitor branding, no
> distorted hands or faces, no exaggerated damage, no watermarks. Leave natural negative
> space. Do not add any captions or graphics.

## Slots

### 1. heroTechnician -> `/images/hero-technician.jpg` (1600x1200, 4:3, priority)

A friendly plumbing technician in a navy uniform standing beside a neat open tool case at
the side of a suburban American home, looking toward the entrance as if arriving for a
service visit. Soft late-morning light, clean driveway, no vehicle branding visible.

### 2. serviceDrain -> `/images/service-drain-cleaning.jpg` (1200x900, 4:3)

Close, documentary view of a residential kitchen sink drain being inspected, a gloved hand
holding a clean drain tool, tidy counter, subtle water droplets on stainless steel.

### 3. serviceLeak -> `/images/service-leak-repair.jpg` (1200x900, 4:3)

Under-sink cabinet view of a supply line being checked for a leak with a small flashlight,
folded towel nearby, dry and clean cabinet interior, faucet base visible above.

### 4. serviceWaterHeater -> `/images/service-water-heater.jpg` (1200x900, 4:3)

Residential tank water heater in a tidy utility room, gauges and connections clearly
visible, a technician's hand resting on the shutoff valve, dry concrete floor.

### 5. servicePipe -> `/images/service-pipe-repair.jpg` (1200x900, 4:3)

Clean basement view of exposed copper and PEX supply lines with a technician pointing at a
joint during an assessment, organized pipe supports, no wall damage.

### 6. serviceFaucet -> `/images/service-toilet-faucet.jpg` (1200x900, 4:3)

Modern kitchen faucet being serviced, a technician tightening a supply connection beneath
the counter edge, bright natural window light, clean quartz countertop.

### 7. serviceSump -> `/images/service-sump-pump.jpg` (1200x900, 4:3)

Sump pump and pit in a dry, well-kept basement with the discharge line visible, a
technician's gloved hand checking the float, no standing water or debris.

### 8. serviceSewer -> `/images/service-sewer-line.jpg` (1200x900, 4:3)

Exterior sewer cleanout beside a residential foundation slab, a technician crouching with a
clipboard during an assessment, green lawn, overcast daylight.

### 9. technicianHomeowner -> `/images/technician-homeowner.jpg` (1200x900, 4:3)

Warm but professional conversation between a navy-uniformed plumbing technician and a
homeowner at an open front door, natural posture, daytime, no exaggerated expressions.

### 10. brandedVan -> `/images/branded-van.jpg` (1600x1000, 16:10)

White service van with a subtle navy side panel and no readable text, parked at the curb of
a suburban American home, soft afternoon light, unreadable license plate.

### 11. aboutTeam -> `/images/about-team.jpg` (1400x1050, 4:3)

Small plumbing team in plain navy uniforms reviewing a schedule board inside a clean,
bright workshop, no name badges and no readable text on the board.

### 12-13. galleryPipeBefore / galleryPipeAfter -> `/images/gallery-pipe-before.jpg`,
`/images/gallery-pipe-after.jpg` (1000x750, 4:3)

Identical camera angle. Before: an older residential supply line with honest corrosion and
mineral buildup in a utility area. After: the same line replaced with clean pipe, tidy
supports and a dry surrounding surface. Same lighting and framing in both.

### 14-15. galleryHeaterBefore / galleryHeaterAfter -> `/images/gallery-heater-before.jpg`,
`/images/gallery-heater-after.jpg` (1000x750, 4:3)

Identical camera angle. Before: an aging water heater with visible wear in a residential
utility room. After: a newly installed unit with neat connections and a dry base, same
framing and lighting.

### 16-17. galleryDrainBefore / galleryDrainAfter -> `/images/gallery-drain-before.jpg`,
`/images/gallery-drain-after.jpg` (1000x750, 4:3)

Identical camera angle. Before: a kitchen sink holding standing water with a used work
area. After: the same sink clean and freely draining with a tidy counter, same framing.

### 18-19. galleryFaucetBefore / galleryFaucetAfter -> `/images/gallery-faucet-before.jpg`,
`/images/gallery-faucet-after.jpg` (1000x750, 4:3)

Identical camera angle. Before: an older faucet with mineral buildup and a visible drip.
After: a newly installed faucet with clean connections and a dry surface, same framing.

### 20-21. galleryUtilityBefore / galleryUtilityAfter ->
`/images/gallery-utility-before.jpg`, `/images/gallery-utility-after.jpg` (1000x750, 4:3)

Identical camera angle. Before: a cluttered utility room with obstructed shutoff access.
After: the same room organized with clearly accessible shutoff valves and tidy storage,
same framing and lighting.

### 22. openGraph -> `/images/opengraph.jpg` (1200x630, 1200:630)

Wide social-preview composition: a calm residential plumbing scene with a navy brand strip
across the lower third and generous empty space in the upper area for a headline overlay.
No text, no phone number, no logos.

## Notes

- These images are presented as AI-generated concept visuals. Keep the disclosure text in
  `src/config/business.ts` and `src/config/gallery.ts` accurate for that.
- Keep each pair (before/after) visually consistent so the side-by-side comparison reads as
  one project.
- Avoid any real company names, real phone numbers, real addresses or real people.
