import type { ImageManifest } from "@/types";

/*
Image manifest.

Every slot lists the intended local path for the final photo under `public/`.
The delivered assets are AI-generated concept visuals for this fictional
portfolio brand, converted to progressive JPEG and sized to the exact ratio
each slot renders at.

The SVG fallback is intentionally kept: any entry set back to `available: false`
renders a brand-coloured placeholder at the same aspect ratio, so a missing
future asset can never break the layout. Full generation prompts live in
IMAGE_GENERATION_PROMPTS.md and the handoff steps in IMAGE_ASSET_CHECKLIST.md.
*/

export const images: ImageManifest = {
  heroTechnician: {
    src: "/images/hero-technician.jpg",
    alt: "Technician in a navy uniform standing beside an open tool case outside a suburban home, arriving for a service call.",
    width: 1448,
    height: 1086,
    aspectRatio: "4 / 3",
    priority: true,
    decorative: false,
    available: true,
    motif: "pipes",
    generationNote:
      "Photorealistic American plumbing technician in a navy ClearFlow uniform standing beside a service van or open tool case, natural daylight.",
  },
  serviceDrain: {
    src: "/images/service-drain-cleaning.jpg",
    alt: "Plumbing tools being used to clear a blocked kitchen sink drain.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "drain",
    generationNote:
      "Photorealistic close view of a residential drain being inspected, clean tools, tidy work area, navy uniform details.",
  },
  serviceLeak: {
    src: "/images/service-leak-repair.jpg",
    alt: "Supply line under a sink being checked for a leak.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "droplet",
    generationNote:
      "Photorealistic under-sink plumbing inspection with a towel and flashlight, clean cabinet, navy uniform, no visible damage exaggeration.",
  },
  serviceWaterHeater: {
    src: "/images/service-water-heater.jpg",
    alt: "Water heater gauges and connections being checked during a maintenance visit.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "tank",
    generationNote:
      "Photorealistic residential water heater in a tidy utility room with gauges and connections clearly visible, natural light.",
  },
  servicePipe: {
    src: "/images/service-pipe-repair.jpg",
    alt: "Exposed supply lines in a basement being assessed for repair.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "pipes",
    generationNote:
      "Photorealistic exposed copper and PEX lines in a clean basement, technician hand pointing at a joint, navy uniform sleeve visible.",
  },
  serviceFaucet: {
    src: "/images/service-toilet-faucet.jpg",
    alt: "Kitchen faucet supply connection being tightened during service.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "droplet",
    generationNote:
      "Photorealistic modern kitchen faucet with a technician tightening a connection, clean countertop, natural window light.",
  },
  serviceSump: {
    src: "/images/service-sump-pump.jpg",
    alt: "Sump pump and discharge line being checked in a basement.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "drain",
    generationNote:
      "Photorealistic sump pump and pit in a dry, organized basement with discharge line visible, natural light.",
  },
  serviceSewer: {
    src: "/images/service-sewer-line.jpg",
    alt: "Exterior sewer cleanout being inspected beside a home.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "pipes",
    generationNote:
      "Photorealistic exterior sewer cleanout near a residential foundation, technician crouching with a clipboard, daylight.",
  },
  technicianHomeowner: {
    src: "/images/technician-homeowner.jpg",
    alt: "Technician talking with a homeowner at an open front door.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "people",
    generationNote:
      "Photorealistic friendly conversation between a navy-uniformed plumbing technician and a homeowner on a porch, natural light, no exaggerated expressions.",
  },
  brandedVan: {
    src: "/images/branded-van.jpg",
    alt: "Service van parked at a residential curb.",
    width: 1448,
    height: 905,
    aspectRatio: "16 / 10",
    priority: false,
    decorative: false,
    available: true,
    motif: "van",
    generationNote:
      "Photorealistic white service van with subtle navy ClearFlow branding, parked on a residential street, unreadable license plate.",
  },
  aboutTeam: {
    src: "/images/about-team.jpg",
    alt: "Two uniformed technicians reviewing the day's schedule in a workshop.",
    width: 1323,
    height: 992,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "people",
    generationNote:
      "Photorealistic small plumbing team in navy uniforms reviewing a job board in a clean shop, no name badges, no readable text.",
  },
  galleryPipeBefore: {
    src: "/images/gallery-pipe-before.jpg",
    alt: "Older supply line with visible corrosion and mineral buildup before replacement.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "before",
    generationNote:
      "Photorealistic corroded residential supply line, honest condition without staging, neutral utility-room lighting.",
  },
  galleryPipeAfter: {
    src: "/images/gallery-pipe-after.jpg",
    alt: "Newly installed supply line with tidy supports after replacement.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "after",
    generationNote:
      "Photorealistic newly installed supply line with tidy supports, same angle as the before photo.",
  },
  galleryHeaterBefore: {
    src: "/images/gallery-heater-before.jpg",
    alt: "Aging water heater with visible wear in a utility room before replacement.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "before",
    generationNote:
      "Photorealistic aging residential water heater with visible wear in a utility room, neutral lighting.",
  },
  galleryHeaterAfter: {
    src: "/images/gallery-heater-after.jpg",
    alt: "Newly installed water heater with clean connections after replacement.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "after",
    generationNote:
      "Photorealistic newly installed water heater with clean connections, same angle as the before photo.",
  },
  galleryDrainBefore: {
    src: "/images/gallery-drain-before.jpg",
    alt: "Kitchen sink holding standing water with a used work area before cleaning.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "before",
    generationNote:
      "Photorealistic kitchen sink with standing water and a used work area, honest condition, natural light.",
  },
  galleryDrainAfter: {
    src: "/images/gallery-drain-after.jpg",
    alt: "Clean kitchen sink draining freely with a tidy counter after service.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "after",
    generationNote:
      "Photorealistic clean kitchen sink with clear water and a tidy countertop, same angle as the before photo.",
  },
  galleryFaucetBefore: {
    src: "/images/gallery-faucet-before.jpg",
    alt: "Older faucet with mineral buildup and a visible drip before replacement.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "before",
    generationNote:
      "Photorealistic older faucet with mineral buildup and a drip, neutral bathroom lighting.",
  },
  galleryFaucetAfter: {
    src: "/images/gallery-faucet-after.jpg",
    alt: "Newly installed faucet with clean connections after replacement.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "after",
    generationNote:
      "Photorealistic new faucet with clean connections and a dry surface, same angle as the before photo.",
  },
  galleryUtilityBefore: {
    src: "/images/gallery-utility-before.jpg",
    alt: "Cluttered utility room with obstructed access to the shutoff valves before cleanup.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "before",
    generationNote:
      "Photorealistic cluttered residential utility room with obstructed shutoff access, honest condition, neutral lighting.",
  },
  galleryUtilityAfter: {
    src: "/images/gallery-utility-after.jpg",
    alt: "Organized utility room with clearly accessible shutoff valves after cleanup.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: true,
    motif: "after",
    generationNote:
      "Photorealistic organized utility room with clearly accessible shutoff valves and tidy labeling, same angle as the before photo.",
  },
  openGraph: {
    src: "/images/opengraph.jpg",
    alt: "Social preview visual for the ClearFlow Plumbing Co. concept.",
    width: 1200,
    height: 630,
    aspectRatio: "1200 / 630",
    priority: false,
    decorative: false,
    available: true,
    motif: "brand",
    generationNote:
      "Photorealistic plumbing scene with navy ClearFlow branding strip and generous empty space for a headline overlay, no phone number.",
  },
};
